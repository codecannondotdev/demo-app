import { useAuthStore } from '@/stores/Auth'
import axios from 'axios'
import { onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
	const auth = useAuthStore()

	onBeforeMount(() => {
		auth.getUser()
	})

	onMounted(() => {
		const router = useRouter()
		axios.interceptors.response.use(
			async (response: any) => {
				return response
			},
			async (error: any) => {
				// If request returns 401 and user should be logged in
				// reset the user and redirect to login
				if (error.response?.status === 401 && auth.user) {
					auth.user = null
					auth.userReturned = false
					router.push('/login')
				}
				// If there's a CSRF token mismatch reload page
				else if (
					error.response?.status === 419 &&
					error.response.data.message === 'CSRF token mismatch.'
				) {
					document.location.reload()
				}

				return Promise.reject(error)
			},
		)
	})

	return { authStore: auth }
}
