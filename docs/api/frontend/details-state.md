---
outline: 'deep'
---

# DetailsState

The `DetailsState` is a state that manages a single entity. It provides methods to
fetch the item form the API, update the item, and manage loading states.

## Class

```typescript
import type { IApi } from '@/helpers/models/Api'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Model as ModelType, Plain } from '@/helpers/models/Model'

export default class DetailsState<Api extends IApi<Model>, Model extends ModelType> {
	api!: Api
	isLoaded: Ref<boolean> = ref(false)
	isLoading: Ref<boolean> = ref(false)
	details: Ref<Plain<Model> | null> = ref(null)
	defaultParams: Parameters<Api['show']>[1] = {}

	async getDetails(id: Parameters<Api['show']>[0], params?: Parameters<Api['show']>[1]) {
		if (this.isLoading.value) return
		this.isLoading.value = true
		const response = await this.api.show(id, { ...this.defaultParams, ...params })
		this.details.value = response.data
		this.isLoading.value = false
		this.isLoaded.value = true
	}

	async update(params: Parameters<Api['update']>[1]) {
		if (!this.isLoaded.value || !this.details.value) return
		if (this.isLoading.value) return
		this.isLoading.value = true
		const response = await this.api.update(this.details.value.id, params)
		this.details.value = response.data
		this.isLoading.value = false
	}

	clearDetails() {
		this.details.value = null
		this.isLoaded.value = false
	}
}
```

## Properties

- See also
  - [Frontend - Details State](/frontend/states#detailsstate)

### `api`

- **Type**: `Api`
- **Required**: `true`
- **Description**: The API service to use for fetching and updating the entity.

### `isLoaded`

- **Type**: `Ref<boolean>`
- **Default**: `false`
- **Description**: A flag that indicates if the entity has been loaded. This value
is set when the entity is loaded the first time and reset when the state is reset.

### `isLoading`

- **Type**: `Ref<boolean>`
- **Default**: `false`
- **Description**: A flag that indicates if the entity is being loaded.

### `details`

- **Type**: `Ref<Model | null>`
- **Default**: `null`
- **Description**: The entity that is being managed by the state.

### `defaultParams`

- **Type**: `Parameters<Api['show']>[1]`
- **Default**: `{}`
- **Description**: The default parameters to use with every request when
fetching the entity.
- See also
  - [API - Api.show](/api/frontend/api#show)

## Methods

### `getDetails`

- **Type**: `(params?: Parameters<Api['show']>[1]) => Promise<void>`
- **Description**: A method that fetches the entity from the API. The method
will set the `details` property with the fetched entity.
- See also
  - [API - Api.show](/api/frontend/api#show)

### `updateDetails`

- **Type**: `(params: Parameters<Api['update']>[1]) => Promise<void>`
- **Description**: A method that updates the entity using the API. The method
will set the `details` property with the updated entity.
- See also
  - [API - Api.show](/api/frontend/api#update)

### `clearDetails`

- **Type**: `() => void`
- **Description**: A method that clears the details (sets to null) and resets the loaded status.
This can be used to reset the state when navigating away from a details view or when
you need to clear the current entity data.
