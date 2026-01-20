import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { StatusEnum, PaymentMethodEnum } from './Enums'
import type { Patient, PatientModel } from '@/models/Patient/Model'
import type { Appointment, AppointmentModel } from '@/models/Appointment/Model'

export interface BillingStorePayload {
	billing_date: string
	amount: number
	status: StatusEnum
	payment_method: PaymentMethodEnum
	patient_id?: Patient['id'] | null
	appointment_id?: Appointment['id'] | null
}

export interface BillingUpdatePayload {
	billing_date?: string
	amount?: number
	status?: StatusEnum
	payment_method?: PaymentMethodEnum
	patient_id?: Patient['id'] | null
	appointment_id?: Appointment['id'] | null
}

export type BillingModel = Model<{
	id: Column<string | number>
	billing_date: Column<string>
	amount: Column<number>
	status: Column<StatusEnum>
	payment_method: Column<PaymentMethodEnum>
	patient_id: Column<Plain<Model>['id'] | null>
	appointment_id: Column<Plain<Model>['id'] | null>
	created_at: Column<string>
	updated_at: Column<string>
	patient?: Relation<PatientModel>
	appointment?: Relation<AppointmentModel>
}>

export type Billing = Plain<BillingModel>

export const title: keyof Billing = 'billing_date'
