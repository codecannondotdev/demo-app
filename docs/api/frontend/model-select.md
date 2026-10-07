---
outline: 'deep'
---

# `ModelSelect`

`ModelSelect` is a component that allows the user to select a entity from a list
of entities for a particular model. The list of models is fetched from the server.

- See also
  - [Frontend - Model Select](/frontend/components#modelselect)
  - [PrimeVue - Select](https://primevue.org/select/)

## Component

```vue
<template>
	<Select
		v-model="model as any"
		option-value="id"
		:loading
		filter
		:options
		show-clear
		:virtual-scroller-options="{
			lazy: true,
			onLazyLoad: fetchItems,
			itemSize: 38,
			showLoader: true,
			loading: loading,
		}">
	</Select>
</template>

<script
	setup
	lang="ts"
	generic="Model extends ModelType, ModelList extends LaravelPaginationResponse<Model>">
import type { IApi } from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'
import { onBeforeMount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import Select from 'primevue/select'
import QueryBuilder from '@/helpers/models/QueryBuilder'
import type { ModelColumnKey, Model as ModelType, Plain } from '@/helpers/models/Model'

const model = defineModel<number | string | undefined>({ required: true })

const props = defineProps<{
	api: IApi<Model, ModelList>
	disabled?: boolean
}>()

const loading = ref(false)
const options = ref([]) as Ref<Plain<Model>[]>
const page = ref(1)
const lastPage = ref(2)

watch(() => model.value, fetchSelected)

const fetchItems = async () => {
	if (loading.value) return
	if (page.value > lastPage.value) return
	loading.value = true
	const data = (await props.api.list({ page: page.value })).data
	lastPage.value = data.last_page
	data.data.forEach((item: any) => {
		if (options.value.find((i) => i.id === item.id)) return
		options.value.push(item)
	})
	page.value += 1
	loading.value = false
}

async function fetchSelected() {
	if (!model.value) return
	if (options.value.some((m) => m.id === model.value)) return
	const selected = (
		await props.api.list({
			filters: [
				new QueryBuilder<Model>()
					.where('id' as ModelColumnKey<Model>, '=', model.value)
					.getFilter(),
			],
		})
	).data
	if (selected.data.length) options.value.unshift(selected.data[0] as any)
}

onBeforeMount(async () => {
	await fetchItems()
	fetchSelected()
})
</script>
```

## Props

### `api`

- **Type**: `Api`
- **Required**: `true`
- **Description**: The API service to use for fetching the list of entities.

### `disabled`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: A flag that indicates if the select is disabled.
