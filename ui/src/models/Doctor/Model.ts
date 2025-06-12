import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { DepartmentModel } from '@/models/Department/Model'
import type { AppointmentModel } from '@/models/Appointment/Model'
import type { TreatmentModel } from '@/models/Treatment/Model'

export interface DoctorStorePayload {
	first_name: string
	last_name: string
	specialty: string
	contact_number: string
	email_address: string
	consultation_fee: number
	department_id?: number
}

export interface DoctorUpdatePayload {
	first_name?: string
	last_name?: string
	specialty?: string
	contact_number?: string
	email_address?: string
	consultation_fee?: number
	department_id?: number
}

export interface DoctorModel extends Model {
	id: Column<string | number>
	first_name: Column<string>
	last_name: Column<string>
	specialty: Column<string>
	contact_number: Column<string>
	email_address: Column<string>
	consultation_fee: Column<number>
	department_id?: Column<number>
	created_at: Column<string>
	updated_at: Column<string>
	department?: Relation<DepartmentModel>
	appointments?: Relation<AppointmentModel>
	treatments?: Relation<TreatmentModel>
}

export type Doctor = Plain<DoctorModel>

export const title: keyof Doctor = 'last_name'
