import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { Patient } from '@/models/Patient/Model'
import type { Appointment } from '@/models/Appointment/Model'
import type { PatientModel } from '@/models/Patient/Model'
import type { AppointmentModel } from '@/models/Appointment/Model'

export interface BillingStorePayload {
	billing_date: string
	amount: number
	status: 'PENDING' | 'PAID' | 'OVERDUE'
	payment_method: 'CASH' | 'CREDIT CARD' | 'INSURANCE'
	patient_id?: Patient['id'] | null
	appointment_id?: Appointment['id'] | null
}

export interface BillingUpdatePayload {
	billing_date?: string
	amount?: number
	status?: 'PENDING' | 'PAID' | 'OVERDUE'
	payment_method?: 'CASH' | 'CREDIT CARD' | 'INSURANCE'
	patient_id?: Patient['id'] | null
	appointment_id?: Appointment['id'] | null
}

export type BillingModel = Model<{
	id: Column<string | number>
	billing_date: Column<string>
	amount: Column<number>
	status: Column<'PENDING' | 'PAID' | 'OVERDUE'>
	payment_method: Column<'CASH' | 'CREDIT CARD' | 'INSURANCE'>
	patient_id: Column<Plain<Model>['id'] | null>
	appointment_id: Column<Plain<Model>['id'] | null>
	created_at: Column<string>
	updated_at: Column<string>
	patient?: Relation<PatientModel>
	appointment?: Relation<AppointmentModel>
}>

export type Billing = Plain<BillingModel>

export const title: keyof Billing = 'billing_date'
