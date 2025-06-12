import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { DepartmentModel } from '@/models/Department/Model'
import type { AppointmentModel } from '@/models/Appointment/Model'

export interface NurseStorePayload {
	first_name: string
	last_name: string
	shift: 'MORNING' | 'AFTERNOON' | 'NIGHT'
	contact_number: string
	email_address: string
	department_id?: number
}

export interface NurseUpdatePayload {
	first_name?: string
	last_name?: string
	shift?: 'MORNING' | 'AFTERNOON' | 'NIGHT'
	contact_number?: string
	email_address?: string
	department_id?: number
}

export interface NurseModel extends Model {
	id: Column<string | number>
	first_name: Column<string>
	last_name: Column<string>
	shift: Column<'MORNING' | 'AFTERNOON' | 'NIGHT'>
	contact_number: Column<string>
	email_address: Column<string>
	department_id?: Column<number>
	created_at: Column<string>
	updated_at: Column<string>
	department?: Relation<DepartmentModel>
	appointments?: Relation<AppointmentModel>
}

export type Nurse = Plain<NurseModel>

export const title: keyof Nurse = 'first_name'
