# AuthApi

## Class

```typescript
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
	async getCsrfToken() {
		return axios.get(import.meta.env.VITE_BACKEND_URL + '/sanctum/csrf-cookie')
	}

	async login({ email, password }: { email: string; password: string }) {
		await this.getCsrfToken()
		return axios.post(
			import.meta.env.VITE_BACKEND_URL + '/login',
			{ email, password },
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
		await this.getCsrfToken()
		return axios.get(import.meta.env.VITE_API_URL + '/user') as Promise<AxiosResponse<User>>
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
		await this.getCsrfToken()
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
		await axios.get(import.meta.env.VITE_API_URL + `/email/verify/${id}/${hash}`, {
			params: { expires, signature },
		})
		await this.getUser()
	}

	async resendEmailVerification() {
		return await axios.post(import.meta.env.VITE_API_URL + '/email/verification-notification')
	}

	async requestPasswordReset(params: RequestPasswordResetParams) {
		return axios.post(import.meta.env.VITE_API_URL + '/forgot-password', params)
	}

	async resetPassword(params: ResetPasswordParams) {
		return axios.post(import.meta.env.VITE_API_URL + '/reset-password', params)
	}
}
```

## Methods

### `getCsrfToken`

- **Type**: `() => Promise<void>`
- **Description**: A method that fetches the CSRF token from the API. The token
will automatically be set in a cookie.

### `login`

- **Type**: `(params: { email: string, password: string }) => Promise<AxiosResponse<User, any>>`
- **Description**: A method that logs in a user using the API. The method will
return the user object if the login is successful.

### `logout`

- **Type**: `() => Promise<AxiosResponse<any, any>>`
- **Description**: A method that logs out the current user using the API.

### `getUser`

- **Type**: `() => Promise<AxiosResponse<User, any>>`
- **Description**: A method that fetches the current user from the API.

### `register`

- **Type**: `(params: { name: string, email: string, password: string }) => Promise<AxiosResponse<any, any>>`
- **Description**: A method that registers a new user using the API.

### `verifyEmail`

- **Type**: `(params: { id: string, hash: string, expires: string, signature: string }) => Promise<AxiosResponse<any, any>>`
- **Description**: A method that verifies a user's email using the API.

### `resendEmailVerification`

- **Type**: `() => Promise<AxiosResponse<any, any>>`
- **Description**: A method that resends the email verification email to the user.

### `requestPasswordReset`

- **Type**: `(params: RequestPasswordResetParams) => Promise<AxiosResponse<any, any>>`
- **Description**: A method that requests a password reset for a user.

### `resetPassword`

- **Type**: `(params: ResetPasswordParams) => Promise<AxiosResponse<any, any>>`
- **Description**: A method that resets a user's password.

## Interfaces

### `RequestPasswordResetParams`

```typescript
export interface RequestPasswordResetParams {
	email: string
}
```

### `ResetPasswordParams`

```typescript
export interface ResetPasswordParams {
	email: string
	token: string
	password: string
	password_confirmation: string
}
```
