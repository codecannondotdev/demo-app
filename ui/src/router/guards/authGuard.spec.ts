import { vi, it, expect, describe, beforeEach, afterEach } from 'vitest'
import authGuard from './authGuard'

let authStore: {
	userReturned: boolean
	getUser: () => any
	user: null | any
}

describe('authGuard', () => {
	beforeEach(() => {
		authStore = {
			userReturned: false,
			getUser: vi.fn(),
			user: null,
		}
		vi.mock('@/stores/Auth', () => ({ useAuthStore: () => authStore }))
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('should let the user pass when visiting unptorected route', async () => {
		const result = await authGuard({
			meta: { unprotected: true },
		} as any)
		expect(result).toBe(true)
	})

	it('should let the user pass when not authenticated and visiting avoidUser route', async () => {
		const result = await authGuard({
			meta: { avoidUser: true },
		} as any)

		expect(authStore.getUser).toHaveBeenCalledOnce()
		expect(result).toEqual(true)
	})

	it('should redirect the user to login when not authenticated and visiting normal route', async () => {
		const result = await authGuard({ meta: {} } as any)

		expect(authStore.getUser).toHaveBeenCalledOnce()
		expect(result).toEqual({ name: 'login' })
	})

	it('should let the user pass to verify-email-notice when not verified', async () => {
		authStore.userReturned = true
		authStore.user = { verified: false }
		const result = await authGuard({ name: 'verify-email-notice', meta: {} } as any)

		expect(result).toEqual(true)
	})

	it('should redirect the user to verify-email-notice when not verified', async () => {
		authStore.userReturned = true
		authStore.user = { verified: false }
		const result = await authGuard({ meta: {} } as any)

		expect(result).toEqual({ name: 'verify-email-notice' })
	})

	it('should redirect user to root if authenticated and visiting avoidUser route', async () => {
		authStore.userReturned = true
		authStore.user = { verified: true }
		const result = await authGuard({ meta: { avoidUser: true } } as any)

		expect(result).toEqual({ name: 'root' })
	})

	it('should redirect user to root if authenticated and missing required role', async () => {
		authStore.userReturned = true
		authStore.user = { role: 'user', verified: true }
		const result = await authGuard({ meta: { roles: ['admin'] } } as any)

		expect(result).toEqual({ name: 'root' })
	})

	it('should let the user pass if they are authenticated, verified, and have the required role', async () => {
		authStore.userReturned = true
		authStore.user = { role: 'admin', verified: true }
		const result = await authGuard({ meta: { roles: ['admin'] } } as any)

		expect(result).toEqual(true)
	})

	it('should let the user pass if they are authenticated, verified, and visiting route without required role', async () => {
		authStore.userReturned = true
		authStore.user = { verified: true }
		const result = await authGuard({ meta: {} } as any)

		expect(result).toEqual(true)
	})
})
