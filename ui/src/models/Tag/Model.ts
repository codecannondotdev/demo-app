import type { Column, Plain, Model, Relation } from '@/helpers/models/Model'
import type { MedicationModel } from '@/models/Medication/Model'

export interface TagStorePayload {
	name: string
}

export interface TagUpdatePayload {
	name?: string
}

export interface TagModel extends Model {
	id: Column<string | number>
	name: Column<string>
	created_at: Column<string>
	updated_at: Column<string>
	medications?: Relation<MedicationModel>
}

export type Tag = Plain<TagModel>

export const title: keyof Tag = 'name'
