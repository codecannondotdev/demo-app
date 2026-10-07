export const Shift = {
	morning: 'MORNING',
	afternoon: 'AFTERNOON',
	night: 'NIGHT',
} as const

export type ShiftEnum = (typeof Shift)[keyof typeof Shift]
