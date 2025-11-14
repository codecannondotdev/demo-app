import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { Patient } from '@/models/Patient/Model'
import type { Doctor } from '@/models/Doctor/Model'
import type { Nurse } from '@/models/Nurse/Model'
import type { Department } from '@/models/Department/Model'
import type { NurseModel } from '@/models/Nurse/Model'
import type { DoctorModel } from '@/models/Doctor/Model'
import type { BillingModel } from '@/models/Billing/Model'
import type { PatientModel } from '@/models/Patient/Model'
import type { DepartmentModel } from '@/models/Department/Model'

export interface AppointmentStorePayload {
	appointment_date: string
	appointment_time: string
	reason_for_visit: string
	status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
	patient_id?: Patient['id'] | null
	doctor_id?: Doctor['id'] | null
	nurse_id?: Nurse['id'] | null
	department_id?: Department['id'] | null
}

export interface AppointmentUpdatePayload {
	appointment_date?: string
	appointment_time?: string
	reason_for_visit?: string
	status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
	patient_id?: Patient['id'] | null
	doctor_id?: Doctor['id'] | null
	nurse_id?: Nurse['id'] | null
	department_id?: Department['id'] | null
}

export type AppointmentModel = Model<{
	id: Column<string | number>
	appointment_date: Column<string>
	appointment_time: Column<string>
	reason_for_visit: Column<string>
	status: Column<'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>
	patient_id: Column<Plain<Model>['id'] | null>
	doctor_id: Column<Plain<Model>['id'] | null>
	nurse_id: Column<Plain<Model>['id'] | null>
	department_id: Column<Plain<Model>['id'] | null>
	created_at: Column<string>
	updated_at: Column<string>
	nurse?: Relation<NurseModel>
	doctor?: Relation<DoctorModel>
	billing?: Relation<BillingModel>
	patient?: Relation<PatientModel>
	department?: Relation<DepartmentModel>
}>

export type Appointment = Plain<AppointmentModel>

export const title: keyof Appointment = 'reason_for_visit'
