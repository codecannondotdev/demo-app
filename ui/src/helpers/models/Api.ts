import type { AxiosResponse } from 'axios'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'
import type { Filter } from '@/interfaces/models/Filter'
import axios from 'axios'
import type {
	Model as ModelType,
	Plain,
	PropertyType,
	WithParameterRelations,
} from '@/helpers/models/Model'

const apiUrl = import.meta.env.VITE_API_URL

export interface UpdateRelationPayload {
	method:
		| 'attach'
		| 'detach'
		| 'associate'
		| 'dissociate'
		| 'sync'
		| 'toggle'
		| 'syncWithoutDetaching'
	params: Array<string | number>
}

export interface IApi<
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model> = any,
	ModelStorePayload = any,
	ModelUpdatePayload = any,
> {
	list: (
		params: {
			page?: number
			per_page?: number
			search?: string
			filters?: Filter[]
			orderBy?: keyof Model
			order?: 'asc' | 'desc'
			with?: WithParameterRelations<Model>[]
			fromRelation?: {
				model: string
				id: number | string
				relation: string
			}
			notFromRelation?: {
				model: string
				id: number | string
				relation: string
			}
		},
		options?: { signal?: AbortSignal },
	) => Promise<AxiosResponse<ModelList>>

	show: (
		id: PropertyType<Model, 'id'>,
		params?: { with?: WithParameterRelations<Model>[] },
		options?: { signal?: AbortSignal },
	) => Promise<AxiosResponse<Plain<Model>>>

	store: (params: ModelStorePayload) => Promise<AxiosResponse<Plain<Model>>>

	update: (
		id: PropertyType<Model, 'id'>,
		params: ModelUpdatePayload,
	) => Promise<AxiosResponse<Plain<Model>>>

	updateRelation: (
		id: PropertyType<Model, 'id'>,
		relation: string,
		params: UpdateRelationPayload,
	) => Promise<AxiosResponse<Plain<Model>>>

	destroy: (id: PropertyType<Model, 'id'>) => Promise<AxiosResponse<void>>
}

export default class Api<
	Model extends ModelType = ModelType,
	ModelList extends LaravelPaginationResponse<Model> = LaravelPaginationResponse<Model>,
	ModelStorePayload = Record<string, any>,
	ModelUpdatePayload = Record<string, any>,
> implements IApi<Model, ModelList, ModelStorePayload, ModelUpdatePayload>
{
	route: string = ''

	async list(
		params: {
			page?: number
			per_page?: number
			search?: string
			filters?: Filter[]
			orderBy?: keyof Model
			order?: 'asc' | 'desc'
			with?: WithParameterRelations<Model>[]
			fromRelation?: {
				model: string
				id: number | string
				relation: string
			}
			notFromRelation?: {
				model: string
				id: number | string
				relation: string
			}
		},
		options?: { signal?: AbortSignal },
	): Promise<AxiosResponse<ModelList>> {
		return await axios.post(`${apiUrl}${this.route}/list`, params, { signal: options?.signal })
	}

	async show(
		id: PropertyType<Model, 'id'>,
		params?: {
			with?: WithParameterRelations<Model>[]
		},
		options?: { signal?: AbortSignal },
	): Promise<AxiosResponse<Plain<Model>>> {
		return await axios.get(`${apiUrl}${this.route}/${id}`, { params, signal: options?.signal })
	}

	async store(params: ModelStorePayload): Promise<AxiosResponse<Plain<Model>>> {
		return await axios.post(`${apiUrl}${this.route}`, params)
	}

	async update(
		id: PropertyType<Model, 'id'>,
		params: ModelUpdatePayload,
	): Promise<AxiosResponse<Plain<Model>>> {
		return await axios.put(`${apiUrl}${this.route}/${id}`, params)
	}

	async updateRelation(
		id: PropertyType<Model, 'id'>,
		relation: string,
		params: UpdateRelationPayload,
	): Promise<AxiosResponse<Plain<Model>>> {
		return await axios.put(`${apiUrl}${this.route}/${id}/${relation}`, params)
	}

	async destroy(id: PropertyType<Model, 'id'>): Promise<AxiosResponse<void>> {
		return await axios.delete(`${apiUrl}${this.route}/${id}`)
	}
}
