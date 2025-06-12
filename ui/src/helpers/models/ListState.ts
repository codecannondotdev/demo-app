import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'
import { ref } from 'vue'
import type { Ref } from 'vue'
import QueryBuilder from './QueryBuilder'
import type { IApi } from './Api'
import type {
	FullLaravelPaginationMeta,
	MinimalLaravelPaginationMeta,
} from '@/interfaces/models/Laravel'
import type { Model as ModelType, Plain } from '@/helpers/models/Model'

export default class ListState<
	Api extends IApi<Model, ModelList>,
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model>,
> {
	api!: Api
	list: Ref<Array<Plain<Model>>> = ref([])
	pagination = ref(makeMinimalLaravelPaginationMeta())
	isLoaded: Ref<boolean> = ref(false)
	isLoading: Ref<boolean> = ref(false)
	defaultParams: Parameters<Api['list']>[0] = {}

	query() {
		return new ListStateQueryBuilder<Api, Model, ModelList>(this)
	}

	async getList(
		params: Parameters<Api['list']>[0] = {
			page: this.pagination.value.current_page,
		},
	) {
		if (this.isLoading.value) return
		params = { ...this.defaultParams, ...params }
		if (params.page === undefined) {
			params.page = this.pagination.value.current_page
		}
		this.isLoading.value = true
		try {
			const response = await this.api.list(params)
			this.list.value = response.data.data as Array<Plain<Model>>
			this.pagination.value = makeMinimalLaravelPaginationMeta(response.data)
			this.isLoaded.value = true
		} finally {
			this.isLoading.value = false
		}
	}

	clearList() {
		this.list.value = []
		this.isLoaded.value = false
		this.pagination.value = makeMinimalLaravelPaginationMeta()
	}
}

export function makeMinimalLaravelPaginationMeta(
	meta?: Partial<FullLaravelPaginationMeta>,
): MinimalLaravelPaginationMeta {
	return {
		current_page: meta?.current_page ?? 1,
		from: meta?.from ?? 1,
		last_page: meta?.last_page ?? 1,
		per_page: meta?.per_page ?? 0,
		to: meta?.to ?? 0,
		total: meta?.total ?? 0,
	}
}

class ListStateQueryBuilder<
	Api extends IApi<Model, ModelList>,
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model>,
> extends QueryBuilder<Model> {
	constructor(private listState: ListState<Api, Model, ModelList>) {
		super()
	}

	getList(params: Parameters<(typeof this.listState)['getList']>[0]) {
		return this.listState.getList({ filters: [this.getFilter()], ...params })
	}

	save() {
		this.listState.defaultParams.filters = [this.getFilter()]
	}
}
