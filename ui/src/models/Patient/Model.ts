import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { GenderEnum } from './Enums'
import type { BillingModel } from '@/models/Billing/Model'
import type { TreatmentModel } from '@/models/Treatment/Model'
import type { AppointmentModel } from '@/models/Appointment/Model'

export interface PatientStorePayload {
	first_name: string
	last_name: string
	date_of_birth: string
	gender: GenderEnum
	contact_number: string
	email_address: string
	address?: string | null
	emergency_contact_name?: string | null
	emergency_contact_number?: string | null
}

export interface PatientUpdatePayload {
	first_name?: string
	last_name?: string
	date_of_birth?: string
	gender?: GenderEnum
	contact_number?: string
	email_address?: string
	address?: string | null
	emergency_contact_name?: string | null
	emergency_contact_number?: string | null
}

export type PatientModel = Model<{
	id: Column<string | number>
	first_name: Column<string>
	last_name: Column<string>
	date_of_birth: Column<string>
	gender: Column<GenderEnum>
	contact_number: Column<string>
	email_address: Column<string>
	address: Column<string | null>
	emergency_contact_name: Column<string | null>
	emergency_contact_number: Column<string | null>
	created_at: Column<string>
	updated_at: Column<string>
	billings?: Relation<BillingModel>
	treatments?: Relation<TreatmentModel>
	appointments?: Relation<AppointmentModel>
}>

export type Patient = Plain<PatientModel>

export const title: keyof Patient = 'first_name'
