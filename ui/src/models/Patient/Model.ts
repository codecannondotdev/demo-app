import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { AppointmentModel } from '@/models/Appointment/Model'
import type { TreatmentModel } from '@/models/Treatment/Model'
import type { BillingModel } from '@/models/Billing/Model'

export interface PatientStorePayload {
	first_name: string
	last_name: string
	date_of_birth: string
	gender: 'Male' | 'Female' | 'Other'
	contact_number: string
	email_address: string
	address?: string
	emergency_contact_name?: string
	emergency_contact_number?: string
}

export interface PatientUpdatePayload {
	first_name?: string
	last_name?: string
	date_of_birth?: string
	gender?: 'Male' | 'Female' | 'Other'
	contact_number?: string
	email_address?: string
	address?: string
	emergency_contact_name?: string
	emergency_contact_number?: string
}

export interface PatientModel extends Model {
	id: Column<string | number>
	first_name: Column<string>
	last_name: Column<string>
	date_of_birth: Column<string>
	gender: Column<'Male' | 'Female' | 'Other'>
	contact_number: Column<string>
	email_address: Column<string>
	address?: Column<string>
	emergency_contact_name?: Column<string>
	emergency_contact_number?: Column<string>
	created_at: Column<string>
	updated_at: Column<string>
	appointments?: Relation<AppointmentModel>
	treatments?: Relation<TreatmentModel>
	billings?: Relation<BillingModel>
}

export type Patient = Plain<PatientModel>

export const title: keyof Patient = 'last_name'
