export const Status = {
	pending: 'PENDING',
	paid: 'PAID',
	overdue: 'OVERDUE',
} as const

export type StatusEnum = (typeof Status)[keyof typeof Status]

export const PaymentMethod = {
	cash: 'CASH',
	credit_card: 'CREDIT CARD',
	insurance: 'INSURANCE',
} as const

export type PaymentMethodEnum = (typeof PaymentMethod)[keyof typeof PaymentMethod]
