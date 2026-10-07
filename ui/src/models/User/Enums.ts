export const Role = {
	admin: 'admin',
	user: 'user',
} as const

export type RoleEnum = (typeof Role)[keyof typeof Role]
