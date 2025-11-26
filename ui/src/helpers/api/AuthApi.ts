import type { User } from '@/models/User/Model'
import axios, { type AxiosResponse } from 'axios'

export interface RequestPasswordResetParams {
	email: string
}

export interface ResetPasswordParams {
	email: string
	token: string
	password: string
	password_confirmation: string
}

export default class AuthApi {
	async login({
		email,
		password,
		remember = false,
	}: {
		email: string
		password: string
		remember?: boolean
	}) {
		return axios.post(
			import.meta.env.VITE_BACKEND_URL + '/login',
			{ email, password, remember },
			{
				headers: {
					Accept: 'application/json',
				},
			},
		) as Promise<AxiosResponse<User>>
	}

	async logout() {
		return axios.post(import.meta.env.VITE_BACKEND_URL + '/logout')
	}

	async getUser() {
		return axios.get(import.meta.env.VITE_BACKEND_URL + '/user') as Promise<AxiosResponse<User>>
	}

	async register({
		email,
		password,
		password_confirmation,
	}: {
		email: string
		password: string
		password_confirmation: string
	}) {
		return axios.post(import.meta.env.VITE_BACKEND_URL + '/register', {
			email,
			password,
			password_confirmation,
			name: email,
		})
	}

	async verifyEmail({
		id,
		hash,
		expires,
		signature,
	}: {
		id: string
		hash: string
		expires: string
		signature: string
	}) {
		await axios.get(import.meta.env.VITE_BACKEND_URL + `/email/verify/${id}/${hash}`, {
			params: { expires, signature },
		})
		await this.getUser()
	}

	async resendEmailVerification() {
		return await axios.post(import.meta.env.VITE_BACKEND_URL + '/email/verification-notification')
	}

	async requestPasswordReset(params: RequestPasswordResetParams) {
		return axios.post(import.meta.env.VITE_BACKEND_URL + '/forgot-password', params)
	}

	async resetPassword(params: ResetPasswordParams) {
		return axios.post(import.meta.env.VITE_BACKEND_URL + '/reset-password', params)
	}
}
