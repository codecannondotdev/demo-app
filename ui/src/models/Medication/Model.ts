import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { TagModel } from '@/models/Tag/Model'
import type { TreatmentModel } from '@/models/Treatment/Model'

export interface MedicationStorePayload {
	name: string
	description?: string | null
	dosage_form: 'TABLET' | 'CAPSULE' | 'INJECTION' | 'SYRUP'
}

export interface MedicationUpdatePayload {
	name?: string
	description?: string | null
	dosage_form?: 'TABLET' | 'CAPSULE' | 'INJECTION' | 'SYRUP'
}

export type MedicationModel = Model<{
	id: Column<string | number>
	name: Column<string>
	description: Column<string | null>
	dosage_form: Column<'TABLET' | 'CAPSULE' | 'INJECTION' | 'SYRUP'>
	created_at: Column<string>
	updated_at: Column<string>
	tags?: Relation<TagModel>
	treatments?: Relation<TreatmentModel>
}>

export type Medication = Plain<MedicationModel>

export const title: keyof Medication = 'name'
