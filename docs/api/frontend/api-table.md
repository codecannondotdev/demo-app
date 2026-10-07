---
outline: 'deep'
---

# ApiTable Component

The `ApiTable` component is designed for displaying paginated API data. It
leverages PrimeVue components (such as `DataTable`, `Paginator`, and `Card`) to
render a fully functional table with pagination support. By providing a listState
instance, the component can manage data fetching, loading states, and pagination
interactions automatically.

## Component

```vue
<template>
	<div
		ref="apiTable"
		class="ui-api-table">
		<Card class="ui-api-table__container-card">
			<template #content>
				<DataTable
					class="ui-api-table__table"
					:class="{ 'ui-api-table__table--clickable': props.clickable }"
					:value="listState.list.value"
					v-bind="$attrs"
					:selection-mode="props.selectionMode"
					:loading="isLoading"
					@row-click="emit('row-click', $event)">
					<template #loading>
						<HeaderLoader :is-loading="isLoading" />
					</template>
					<slot></slot>
				</DataTable>
				<Paginator
					:model-value="props.listState.pagination.value.current_page"
					:rows="listState.pagination.value.per_page"
					:total-records="props.listState.pagination.value.total"
					@page="getList($event)"></Paginator>
			</template>
		</Card>
	</div>
</template>

<script lang="ts">
import DataTable, { type DataTableRowClickEvent } from 'primevue/datatable'
import Paginator from 'primevue/paginator'
import Card from 'primevue/card'
import type { Model as ModelType } from '@/helpers/models/Model'

export interface ApiTableInjectionType<
	Api extends IApi<Model, ModelList>,
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model>,
> {
	listState: ListState<Api, Model, ModelList> | undefined
	selectable: boolean
	selected: Set<Model>
	isLoading: Ref<boolean>
	selectionMode?: 'single' | 'multiple'
}

const injectionSymbol = Symbol('ApiTableInject')

export function createInjectionKey<
	Api extends IApi<Model, ModelList>,
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model>,
>() {
	return injectionSymbol as InjectionKey<ApiTableInjectionType<Api, Model, ModelList>>
}
</script>

<script
	setup
	lang="ts"
	generic="
		Api extends IApi<Model, ModelList>,
		Model extends ModelType,
		ModelList extends LaravelPaginationResponse<Model>
	">
import { computed, type InjectionKey, provide, type Ref, ref, nextTick, watch } from 'vue'
import ListState from '@/helpers/models/ListState'
import type { IApi } from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'
import HeaderLoader from '@/components/HeaderLoader.vue'

defineOptions({
	inheritAttrs: false,
})

const emit = defineEmits<{
	(e: 'get-list'): void
	(e: 'update:pagination-page', page: number): void
	(e: 'row-click', event: DataTableRowClickEvent<any>): void
}>()

const props = withDefaults(
	defineProps<{
		listState: ListState<Api, Model, ModelList>
		loading?: boolean
		selectable?: boolean
		selected?: Set<Model>
		maxHeight?: number | string
		selectionMode?: 'single' | 'multiple'
		clickable?: boolean
	}>(),
	{
		selectable: false,
		selected: () => new Set(),
		maxHeight: 'auto',
		selectionMode: undefined,
		clickable: false,
	},
)

const isLoading = computed(() => {
	return props.loading !== undefined ? props.loading : !!props.listState?.isLoading.value
})

const apiTable = ref<HTMLElement>()
const headerHeight = ref('0px')

function updateHeaderHeight() {
	nextTick(() => {
		if (!apiTable.value) return
		const thead = apiTable.value.querySelector('.p-datatable-table-container thead')
		if (thead) {
			headerHeight.value = `${(thead as HTMLElement).offsetHeight}px`
		}
	})
}

watch(
	() => isLoading.value,
	() => {
		updateHeaderHeight()
	},
	{
		immediate: true,
	},
)

function getList(page: { page: number }) {
	if (props.listState) {
		props.listState.getList({ page: page.page + 1 })
	}
	emit('update:pagination-page', page.page + 1)
}

const injectionKey = createInjectionKey<Api, Model, ModelList>()
const providedData: ApiTableInjectionType<Api, Model, ModelList> = {
	listState: props.listState,
	selectable: props.selectable,
	selected: props.selected,
	isLoading: isLoading,
}
provide(injectionKey, providedData)

const maxHeightPx = computed(() => {
	if (props.maxHeight === 'auto') {
		return 'none'
	}
	return `${props.maxHeight}px`
})
</script>
```

## Generic Parameters

### `Api`
- **Type**: `IApi<Model, ModelList>`
- **Details**
  The API instance used by the `ApiTable` must extend the generic API
  interface. It's type will be automatically inferred from the `listState` prop.


### `Model`
- **Type**: `ModelType`
- **Details**
  The model type representing the data item. It's type will be automatically
  inferred from the `listState` prop.

### `ModelList`
- **Type**: `LaravelPaginationResponse<Model>`
- **Details**
  The type representing the paginated response from the API. It's type will be
  automatically inferred from the `listState` prop.

## Props

### `listState`
- **Type:** `ListState<Api, Model, ModelList>`
- **Required:** `true`
- **Details:**
  The central state and methods for managing the list data and pagination. This
  is usually defined in the parent component and passed down to the `ApiTable`,
  allowing you to control the list of entities in the table from the parent
  component.

### `loading`
- **Type:** `Boolean`
- **Required:** `false`
- **Default:** `undefined`
- **Details:**
  A boolean value indicating whether the table is in a loading state. When set
  to `true`, the table displays a loading indicator. When `undefined`, the component
  automatically uses the loading state from the `listState` prop. The loading indicator
  is displayed using the `HeaderLoader` component in the `#loading` slot, positioned
  automatically under the table header row.

### `selectable`
- **Type:** `Boolean`
- **Default:** `false`
- **Details:**
  A boolean value indicating whether the table rows are selectable. When set to
  `true`, the table displays checkboxes for selecting rows.

### `selected`
- **Type:** `Set<Model>`
- **Default:** `new Set()`
- **Details:**
  A reactive set holding the selected items in the table. This prop is used to
  manage the selected items in the table and can be read or updated from the
  parent component.

### `maxHeight`
- **Type:** `Number | String`
- **Default:** `'auto'`
- **Details:**
  The maximum height of the table. If set to `'auto'`, the table will expand to
  fit its content. Otherwise, the table will have a fixed height in px based on
  the provided numeric value. The `maxHeight` is injected into the table's styles.

### `selectionMode`
- **Type:** `'single' | 'multiple'`
- **Default:** `undefined`
- **Details:**
  The selection mode for the table rows. When set to `'single'`, only one row can
  be selected at a time. When set to `'multiple'`, multiple rows can be selected.

### `clickable`
- **Type:** `Boolean`
- **Default:** `false`
- **Details:**
  A boolean value indicating whether the table rows are clickable. When set to
  `true`, the rows will have a pointer cursor and emit a `row-click` event when
  clicked.

### Provide/Inject

The component uses an injection key to provide common state and methods to its
child components (such as the `ApiTableRemoveButton` component):

- See also
  - [Frontend - `ApiTableRemoveButton`](/frontend/components#apitableremovebutton)
  - [API - `ApiTableRemoveButton`](/api/frontend/api-table-remove-button)

#### `listState`
- **Type:** `ListState<Api, Model, ModelList> | undefined`
- **Details:**
  The central state and methods for managing the list data and pagination. This
  is usually defined in the parent component and passed down to the `ApiTable`,
  allowing you to control the list of entities in the table from the parent
  component.

#### `selectable`
- **Type:** `boolean`
- **Details:**
  A boolean value indicating whether the table rows are selectable.

#### `selected`
- **Type:** `Set<Model>`
- **Details:**
  A reactive set holding the selected items in the table.

#### `isLoading`
- **Type:** `Ref<boolean>`
- **Details:**
  A reactive reference to a boolean value indicating whether the table is in a
  loading state.

## Loading Indicator

The `ApiTable` component automatically displays a loading indicator when data is being fetched.
The loading indicator uses the `HeaderLoader` component and is positioned directly under the
table header row. The component automatically measures the header height and positions the
2px-high loader accordingly.

The loading state is determined by:
- The `loading` prop, if explicitly provided
- Otherwise, the `listState.isLoading.value` from the `ListState` instance

The loader is displayed in PrimeVue's `#loading` slot and styled to appear as a thin line
under the table header using CSS `v-bind` to dynamically position it based on the measured
header height.

The `HeaderLoader` component includes a 100ms delay before appearing, so fast requests
(completing in less than 100ms) won't trigger the loader. This prevents unnecessary visual
flicker for quick operations. Once loading stops, the loader hides immediately with no delay.

## Usage Example

The `ApiTable` component is typically used in a few auto generated components.

> **Note:** For proper TypeScript type inference in Column slot props, use the [`useApiTable`](/api/frontend/use-api-table) composable instead of importing components directly. This ensures that `columnProps.data` is properly typed in your templates.

- See also
  - [API - `useApiTable`](/api/frontend/use-api-table) - For type-safe table components
  - [Generated Files - List](/generated-files/frontend/views/list)
  - [Generated Files - Relation Widgets](/generated-files/frontend/components/relation-widgets)
  - [Generated Files - Relation Add Dialogs](/generated-files/frontend/components/relation-add-dialogs)
