import type { Column, Model, Plain } from '@/helpers/models/Model'

export interface UserStorePayload {
	name: string
	email: string
	role: 'user' | 'admin'
	password: string
}

export interface UserUpdatePayload {
	name?: string
	email?: string
	role?: 'user' | 'admin'
	password?: string
}

export interface UserModel extends Model {
	id: Column<number>
	name: Column<string>
	email: Column<string>
	role: Column<'user' | 'admin'>
	verified: Column<boolean>
	created_at: Column<string>
	updated_at: Column<string>
}

export type User = Plain<UserModel>

export const title: keyof User = 'name'
