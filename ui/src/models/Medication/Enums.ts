export const DosageForm = {
	tablet: 'TABLET',
	capsule: 'CAPSULE',
	injection: 'INJECTION',
	syrup: 'SYRUP',
} as const

export type DosageFormEnum = (typeof DosageForm)[keyof typeof DosageForm]
