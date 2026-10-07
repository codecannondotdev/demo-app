---
outline: 'deep'
---

# Auth store

The auth store is a store that is used to store the authentication state of the
user. It is used to store the user's authentication token, user information, and
other information related to the user's authentication state.

It can be found in `ui/src/stores/Auth.ts`

## State Implementation

```typescript
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
			lastRouteCached: sessionStorage.getItem('lastRoute') || '/',
		}
	},
	actions: {
		async login({ email, password }: { email: string; password: string }) {
			this.setLastRoute(null)
			await auth.login({ email, password })
			await this.getUser()
		},
		async logout() {
			await auth.logout()
			this.user = null
		},
		async getUser() {
			try {
				const res = await auth.getUser()
				this.user = res.data
			} catch (error) {
				//
			} finally {
				this.userReturned = true
			}
		},
		async register(params: { email: string; password: string; password_confirmation: string }) {
			this.setLastRoute(null)
			await auth.register(params)
		},
		setLastRoute(route: string | null) {
			if (!route) route = '/'
			sessionStorage.setItem('lastRoute', route)
			this.lastRouteCached = route
		},
		githubLogin() {
			this.setLastRoute(null)
			auth.githubLoginRedirect()
		},
		googleLogin() {
			this.setLastRoute(null)
			auth.googleLoginRedirect()
		},
		async requestPasswordReset(params: RequestPasswordResetParams) {
			return await auth.requestPasswordReset(params)
		},
		async resetPassword(params: ResetPasswordParams) {
			return await auth.resetPassword(params)
		},
	},
	getters: {
		lastRoute(state) {
			return state.lastRouteCached
		},
	},
})

export { useAuthStore }
```

## State

### `user`

- **Type**: `User | null`
- **Default**: `null`
- **Description**: The user object that is currently authenticated. This value is
set when the user logs in and reset when the user logs out.

### `userReturned`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: A flag that indicates if the has been requested and the server
responded at least once.

### `lastRouteCached`

- **Type**: `string | null`
- **Default**: `null`
- **Description**: The last route that the user visited.

## Actions

### `login`

- **Type**: `(params: { email: string, password: string }) => Promise<void>`
- **Description**: A method that logs in a user using the API. The method will
set the `user` property with the user object if the login is successful.

### `logout`

- **Type**: `() => Promise<void>`
- **Description**: A method that logs out the current user using the API. The
method will reset the `user` property.

### `getUser`

- **Type**: `() => Promise<void>`
- **Description**: A method that fetches the current user from the API. The
method will set the `user` property with the user object.

### `register`

- **Type**: `(params: { name: string, email: string, password: string }) => Promise<void>`
- **Description**: A method that registers a new user using the API.

### `setLastRoute`

- **Type**: `(route: string) => void`
- **Description**: A method that sets the `lastRouteCached` property with the
given route.

### `requestPasswordReset`

- **Type**: `(params: RequestPasswordResetParams) => Promise<void>`
- **Description**: A method that requests a password reset for a user.

### `resetPassword`

- **Type**: `(params: ResetPasswordParams) => Promise<void>`
- **Description**: A method that resets a user's password.

## Getters

### `lastRoute`

- **Type**: `() => string | null`
- **Description**: A getter that returns the `lastRouteCached` property.
