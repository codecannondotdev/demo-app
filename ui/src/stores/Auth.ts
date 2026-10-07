import AuthApi, {
	type RequestPasswordResetParams,
	type ResetPasswordParams,
} from '@/helpers/api/AuthApi'
import type { User } from '@/models/User/Model'
import { defineStore } from 'pinia'
const auth = new AuthApi()
const useAuthStore = defineStore('auth', {
	state: () => {
		return {
			user: null as User | null,
			userReturned: false,
			userRequest: null as Promise<any> | null,
		}
	},
	actions: {
		async login({
			email,
			password,
			remember = false,
		}: {
			email: string
			password: string
			remember?: boolean
		}) {
			await auth.login({ email, password, remember })
			await this.getUser()
		},
		async logout() {
			await auth.logout()
			this.user = null
		},
		async getUser() {
			try {
				if (!this.userRequest) {
					this.userRequest = auth.getUser()
				}
				this.user = (await this.userRequest).data
			} catch (error: any) {
				if (error.response?.status !== 401) throw error
			} finally {
				this.userRequest = null
			}
			this.userReturned = true
		},
		async register(params: { email: string; password: string; password_confirmation: string }) {
			await auth.register(params)
		},
		async requestPasswordReset(params: RequestPasswordResetParams) {
			return await auth.requestPasswordReset(params)
		},
		async resetPassword(params: ResetPasswordParams) {
			return await auth.resetPassword(params)
		},
	},
})

export { useAuthStore }
