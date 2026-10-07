export const Status = {
	scheduled: 'SCHEDULED',
	completed: 'COMPLETED',
	cancelled: 'CANCELLED',
} as const

export type StatusEnum = (typeof Status)[keyof typeof Status]
