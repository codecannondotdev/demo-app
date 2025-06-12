import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { PatientModel } from '@/models/Patient/Model'
import type { DoctorModel } from '@/models/Doctor/Model'
import type { MedicationModel } from '@/models/Medication/Model'

export interface TreatmentStorePayload {
	treatment_date: string
	description: string
	outcome?: string
	cost: number
	doctor_id?: number
	patient_id?: number
}

export interface TreatmentUpdatePayload {
	treatment_date?: string
	description?: string
	outcome?: string
	cost?: number
	doctor_id?: number
	patient_id?: number
}

export interface TreatmentModel extends Model {
	id: Column<string | number>
	treatment_date: Column<string>
	description: Column<string>
	outcome?: Column<string>
	cost: Column<number>
	doctor_id?: Column<number>
	patient_id?: Column<number>
	created_at: Column<string>
	updated_at: Column<string>
	patient?: Relation<PatientModel>
	doctor?: Relation<DoctorModel>
	medications?: Relation<MedicationModel>
}

export type Treatment = Plain<TreatmentModel>

export const title: keyof Treatment = 'description'
