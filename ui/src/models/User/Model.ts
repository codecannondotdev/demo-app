import type { Column, Plain, Model, Attribute } from '@/helpers/models/Model'

export interface UserStorePayload {
	name: string
	email: string
	role?: 'admin' | 'user' | null
	password?: string | null
}

export interface UserUpdatePayload {
	name?: string
	email?: string
	role?: 'admin' | 'user' | null
	password?: string | null
}

export type UserModel = Model<{
	id: Column<string | number>
	name: Column<string>
	email: Column<string>
	role: Column<'admin' | 'user' | null>
	verified: Attribute<boolean>
	created_at: Column<string>
	updated_at: Column<string>
}>

export type User = Plain<UserModel>

export const title: keyof User = 'name'
