import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { PatientModel } from '@/models/Patient/Model'
import type { DoctorModel } from '@/models/Doctor/Model'
import type { NurseModel } from '@/models/Nurse/Model'
import type { DepartmentModel } from '@/models/Department/Model'
import type { BillingModel } from '@/models/Billing/Model'

export interface AppointmentStorePayload {
	appointment_date: string
	appointment_time: string
	reason_for_visit?: string
	department_id?: number
	status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
	nurse_id?: number
	doctor_id?: number
	patient_id?: number
}

export interface AppointmentUpdatePayload {
	appointment_date?: string
	appointment_time?: string
	reason_for_visit?: string
	department_id?: number
	status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
	nurse_id?: number
	doctor_id?: number
	patient_id?: number
}

export interface AppointmentModel extends Model {
	id: Column<string | number>
	appointment_date: Column<string>
	appointment_time: Column<string>
	reason_for_visit?: Column<string>
	department_id?: Column<number>
	status: Column<'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>
	nurse_id?: Column<number>
	doctor_id?: Column<number>
	patient_id?: Column<number>
	created_at: Column<string>
	updated_at: Column<string>
	patient?: Relation<PatientModel>
	doctor?: Relation<DoctorModel>
	nurse?: Relation<NurseModel>
	department?: Relation<DepartmentModel>
	billing?: Relation<BillingModel>
}

export type Appointment = Plain<AppointmentModel>

export const title: keyof Appointment = 'reason_for_visit'
