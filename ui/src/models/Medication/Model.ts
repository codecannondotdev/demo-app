import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { DosageFormEnum } from './Enums'
import type { TagModel } from '@/models/Tag/Model'
import type { TreatmentModel } from '@/models/Treatment/Model'

export interface MedicationStorePayload {
	name: string
	description?: string | null
	dosage_form: DosageFormEnum
}

export interface MedicationUpdatePayload {
	name?: string
	description?: string | null
	dosage_form?: DosageFormEnum
}

export type MedicationModel = Model<{
	id: Column<string | number>
	name: Column<string>
	description: Column<string | null>
	dosage_form: Column<DosageFormEnum>
	created_at: Column<string>
	updated_at: Column<string>
	tags?: Relation<TagModel>
	treatments?: Relation<TreatmentModel>
}>

export type Medication = Plain<MedicationModel>

export const title: keyof Medication = 'name'
