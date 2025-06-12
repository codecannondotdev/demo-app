import { useAuthStore } from '@/stores/Auth'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export default async (to: RouteLocationNormalizedLoaded) => {
	const auth = useAuthStore()

	// Allow user to visit unprotected routes
	if (to.meta.unprotected) {
		return true
	}

	// Get the user if it's not already loaded
	if (!auth.userReturned) {
		await auth.getUser()
	}

	// Is user is not logged in
	if (!auth.user) {
		// If user is not logged in allow access of user avoidant routes
		if (to.meta.avoidUser) {
			return true
		}

		// If user is not logged in, redirect to login
		return { name: 'login' }
	}

	// If user is logged in but not verified redirect to verify email
	if (!auth.user.verified && to.name !== 'verify-email-notice') {
		return { name: 'verify-email-notice' }
	}

	// If user is logged in prevent access of user avoidant routes
	if (to.meta.avoidUser) {
		return { name: 'root' }
	}

	// If user doesn't have required role, prevent access to route
	if (Array.isArray(to.meta.roles) && !to.meta.roles?.includes(auth.user.role)) {
		return { name: 'root' }
	}

	// If user is logged in, allow access to everything else
	return true
}
