import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { TreatmentModel } from '@/models/Treatment/Model'
import type { TagModel } from '@/models/Tag/Model'

export interface MedicationStorePayload {
	name: string
	description?: string
	dosage_form: 'TABLET' | 'CAPSULE' | 'INJECTION' | 'SYRUP'
}

export interface MedicationUpdatePayload {
	name?: string
	description?: string
	dosage_form?: 'TABLET' | 'CAPSULE' | 'INJECTION' | 'SYRUP'
}

export interface MedicationModel extends Model {
	id: Column<string | number>
	name: Column<string>
	description?: Column<string>
	dosage_form: Column<'TABLET' | 'CAPSULE' | 'INJECTION' | 'SYRUP'>
	created_at: Column<string>
	updated_at: Column<string>
	treatments?: Relation<TreatmentModel>
	tags?: Relation<TagModel>
}

export type Medication = Plain<MedicationModel>

export const title: keyof Medication = 'name'
