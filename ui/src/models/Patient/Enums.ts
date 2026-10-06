export const Gender = {
	male: 'Male',
	female: 'Female',
	other: 'Other',
} as const

export type GenderEnum = (typeof Gender)[keyof typeof Gender]
