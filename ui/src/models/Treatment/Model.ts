import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { Patient, PatientModel } from '@/models/Patient/Model'
import type { Doctor, DoctorModel } from '@/models/Doctor/Model'
import type { MedicationModel } from '@/models/Medication/Model'

export interface TreatmentStorePayload {
	treatment_date: string
	description: string
	outcome?: string | null
	cost: number
	patient_id?: Patient['id'] | null
	doctor_id?: Doctor['id'] | null
}

export interface TreatmentUpdatePayload {
	treatment_date?: string
	description?: string
	outcome?: string | null
	cost?: number
	patient_id?: Patient['id'] | null
	doctor_id?: Doctor['id'] | null
}

export type TreatmentModel = Model<{
	id: Column<string | number>
	treatment_date: Column<string>
	description: Column<string>
	outcome: Column<string | null>
	cost: Column<number>
	patient_id: Column<Plain<Model>['id'] | null>
	doctor_id: Column<Plain<Model>['id'] | null>
	created_at: Column<string>
	updated_at: Column<string>
	doctor?: Relation<DoctorModel>
	patient?: Relation<PatientModel>
	medications?: Relation<MedicationModel>
}>

export type Treatment = Plain<TreatmentModel>

export const title: keyof Treatment = 'description'
