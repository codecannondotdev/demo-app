import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { DoctorModel } from '@/models/Doctor/Model'
import type { NurseModel } from '@/models/Nurse/Model'
import type { AppointmentModel } from '@/models/Appointment/Model'

export interface DepartmentStorePayload {
	name: string
	location: string
}

export interface DepartmentUpdatePayload {
	name?: string
	location?: string
}

export interface DepartmentModel extends Model {
	id: Column<string | number>
	name: Column<string>
	location: Column<string>
	created_at: Column<string>
	updated_at: Column<string>
	doctors?: Relation<DoctorModel>
	nurses?: Relation<NurseModel>
	appointments?: Relation<AppointmentModel>
}

export type Department = Plain<DepartmentModel>

export const title: keyof Department = 'name'
