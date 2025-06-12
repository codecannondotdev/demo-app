import type { Model, Plain } from '@/helpers/models/Model'

export interface LaravelPaginationResponse<T> extends FullLaravelPaginationMeta {
	data: T extends Model ? Plain<Model>[] : T[]
}

export interface MinimalLaravelPaginationMeta {
	current_page: number
	from: number
	last_page: number
	per_page: number
	to: number
	total: number
}

export interface FullLaravelPaginationMeta extends MinimalLaravelPaginationMeta {
	links: Array<{
		url: string | null
		label: string
		active: boolean
	}>
	path: string
}
