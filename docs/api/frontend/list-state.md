---
outline: 'deep'
---

# `ListState`

The `ListState` is a state that manages a list of items. It provides methods to
fetch the list form the API, and manage pagination information and loading states.

## Class

```typescript
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
```

## Properties

### `api`

- **Type**: `Api`
- **Required**: `true`
- **Description**: The API service to use for fetching the list.

### `list`

- **Type**: `Ref<Model[]>`
- **Default**: `[]`
- **Description**: The list of items that is being managed by the state.

### `pagination`

- **Type**: `Ref<MinimalLaravelPaginationMeta>`
- **Default**:
    ```
    {
		current_page: 1,
		from: 1,
		last_page: 1,
		per_page: 0,
		to: 0,
		total: 0,
	}
    ```

### `isLoaded`

- **Type**: `Ref<boolean>`
- **Default**: `false`
- **Description**: A flag that indicates if the list has been loaded. This value
is set when the list is loaded the first time and reset when the state is reset.

### `isLoading`

- **Type**: `Ref<boolean>`
- **Default**: `false`
- **Description**: A flag that indicates if the list is being loaded.

### `defaultParams`

- **Type**: `Parameters<Api['list']>[1]`
- **Default**: `{}`
- **Description**: The default parameters to use with every request when
fetching the list.
- See also
  - [API - Api.list](/api/frontend/api#list)

## Methods

### `getList`

- **Type**: `(params?: Parameters<Api['list']>[1]) => Promise<void>`
- **Description**: A method that fetches the list from the API. The method
will set the `list` property with the fetched list.
- See also
  - [API - Api.list](/api/frontend/api#list)

### `clearList`

- **Type**: `() => void`
- **Description**: A method that clears the list (sets to an empty array), resets the loaded status,
and resets the pagination to its default state. This can be used to reset the state when
navigating away from a list view or when you need to clear the current list data.

### `query`

- **Type**: `() => ListStateQueryBuilder<Api, Model, ModelList>`
- **Description**: A method that returns a query builder that can be used to
build and save queries to the list state `defaultParams`.

## `ListStateQueryBuilder`

### `getList`

- **Type**: `() => Promise<void>`
- **Description**: A method that fetches the list from the API using the current
query parameters. The method will set the `list` property with the fetched list.
- See also
  - [API - QueryBuilder](/api/frontend/query-builder)

### `save`

- **Type**: `() => void`
- **Description**: A method that saves the current query parameters to the list
state `defaultParams`.

## Interfaces

### `makeMinimalLaravelPaginationMeta`

- **Type**: `(meta: LaravelPaginationMeta) => MinimalLaravelPaginationMeta`
- **Description**: A method that converts a Laravel pagination meta object to a
minimal version that can be used with the `ListState`.
