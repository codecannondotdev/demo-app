import { useAuthStore } from '@/stores/Auth'
import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { onBeforeMount, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

type CsrfRequestConfig = InternalAxiosRequestConfig & { csrfRetried?: boolean }

export function useAuth() {
	const auth = useAuthStore()
	const router = useRouter()
	const toast = useToast()
	const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')
	const backend = new URL(backendUrl, window.location.origin)
	const backendPath = backend.pathname.replace(/\/$/, '')
	const credentialPaths = ['login', 'register', 'forgot-password', 'reset-password'].map(
		(path) => `${backendPath}/${path}`,
	)
	let csrfRefresh: Promise<unknown> | null = null
	const isWrite = (config: AxiosRequestConfig) =>
		['post', 'put', 'patch', 'delete'].includes(config.method ?? 'get')

	function isBackendRequest(config: AxiosRequestConfig) {
		const url = new URL(axios.getUri(config), window.location.origin)
		return (
			url.origin === backend.origin &&
			(url.pathname === backendPath || url.pathname.startsWith(`${backendPath}/`))
		)
	}

	async function resetAuthentication() {
		auth.user = null
		auth.userReturned = false
		auth.userRequest = null
		await router.replace('/login')
		toast.add({
			severity: 'warn',
			summary: 'Session changed',
			detail: auth.user
				? 'Your account changed. Check the current account before trying again.'
				: 'Please sign in again to continue.',
			life: 7000,
		})
	}

	onBeforeMount(() => {
		auth.getUser()
	})

	const requestInterceptor = axios.interceptors.request.use((config) => {
		if (!isBackendRequest(config) || !isWrite(config)) return config
		const path = new URL(axios.getUri(config), window.location.origin).pathname
		// Credential-based flows deliberately choose an account independently of the current session.
		if (credentialPaths.includes(path)) return config

		// A retry must retain the account captured by the original request.
		if (!config.headers.has('X-Expected-User-Id')) {
			config.headers.set('X-Expected-User-Id', String(auth.user?.id ?? 'guest'))
		}
		return config
	})

	const responseInterceptor = axios.interceptors.response.use(
		(response) => response,
		async (error: unknown) => {
			if (!axios.isAxiosError(error) || !error.config || !isBackendRequest(error.config))
				throw error
			const config = error.config as CsrfRequestConfig
			if (
				(error.response?.status === 401 && auth.user) ||
				(error.response?.status === 409 && error.response.data?.code === 'AUTH_ACCOUNT_CHANGED')
			) {
				await resetAuthentication()
			} else if (
				error.response?.status === 419 &&
				error.response.data?.message === 'CSRF token mismatch.' &&
				isWrite(config) &&
				!config.csrfRetried
			) {
				// Laravel rejected this write before its controller ran, so it is safe to retry once.
				config.csrfRetried = true
				csrfRefresh ??= axios.get(`${backendUrl}/heartbeat`).finally(() => {
					csrfRefresh = null
				})
				await csrfRefresh
				config.headers.delete('X-CSRF-TOKEN')
				config.headers.delete('X-XSRF-TOKEN')
				return axios.request(config)
			}
			throw error
		},
	)

	onUnmounted(() => {
		axios.interceptors.request.eject(requestInterceptor)
		axios.interceptors.response.eject(responseInterceptor)
	})

	return { authStore: auth }
}
