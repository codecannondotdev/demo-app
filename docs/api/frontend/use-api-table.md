---
outline: 'deep'
---

# `useApiTable`

The `useApiTable` composable provides a type-safe way to use the `ApiTable` component
and its related components (`Column`, `ApiTableLinkButton`, `ApiTableRemoveButton`) with
proper TypeScript type inference in Column slot props.

## Problem

PrimeVue's `DataTable` component is engineered in such a way that the `Column` component
doesn't know what type the data table is. This means when you use the `Column` component
directly from PrimeVue, you don't get type inference in Column slot props (like the `body`
slot), making it difficult to work with typed data in your templates.

For example, when using PrimeVue's `Column` directly:

```vue
<template>
	<ApiTable :list-state="listState">
		<Column field="title" header="Title" />
		<Column header="Actions">
			<template #body="columnProps">
				<!-- columnProps.data is typed as 'any' - no type inference! -->
				{{ columnProps.data.title }}
			</template>
		</Column>
	</ApiTable>
</template>

<script setup lang="ts">
import ApiTable from '@/components/Table/ApiTable.vue'
import Column from 'primevue/column'
import { usePostListState } from '@/models/Post/States'

const listState = usePostListState()
</script>
```

## Solution

The `useApiTable` composable solves this by providing a properly typed `Column` component
that knows the data type used in the table. By importing components through the composable,
the data type used in the table is also enforced on the table child components.

## Function Signature

```typescript
export default function useApiTable<
	Api extends IApi<Model, ModelList>,
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model>,
>(_listState?: ListState<Api, Model, ModelList>): {
	ApiTable: typeof ApiTable<Api, Model, ModelList>
	ApiTableLinkButton: typeof ApiTableLinkButton
	ApiTableRemoveButton: typeof ApiTableRemoveButton<Api, Model, ModelList>
	Column: DefineComponent<
		ColumnProps,
		Omit<ColumnSlots, 'body'> & {
			body(
				scope: Omit<Parameters<ColumnSlots['body']>[0], 'data'> & { data: Plain<Model> },
			): VNode[]
		},
		ColumnEmits
	>
}
```

## Generic Parameters

### `Api`
- **Type**: `IApi<Model, ModelList>`
- **Details**: The API instance type that extends the generic API interface. This type
  is automatically inferred from the `listState` parameter.

### `Model`
- **Type**: `ModelType`
- **Details**: The model type representing the data item in the table. This type is
  automatically inferred from the `listState` parameter.

### `ModelList`
- **Type**: `LaravelPaginationResponse<Model>`
- **Details**: The type representing the paginated response from the API. This type is
  automatically inferred from the `listState` parameter.

## Parameters

### `listState` (optional)
- **Type**: `ListState<Api, Model, ModelList>`
- **Required**: `false`
- **Details**: An optional `ListState` instance. While not strictly required, passing
  the `listState` helps TypeScript infer the generic types (`Api`, `Model`, `ModelList`)
  automatically, ensuring type safety throughout your component.

## Return Value

The composable returns an object with the following properties:

### `ApiTable`
- **Type**: `typeof ApiTable<Api, Model, ModelList>`
- **Details**: The typed `ApiTable` component with generic parameters applied.

### `ApiTableLinkButton`
- **Type**: `typeof ApiTableLinkButton`
- **Details**: The `ApiTableLinkButton` component for creating link buttons in table rows.

### `ApiTableRemoveButton`
- **Type**: `typeof ApiTableRemoveButton<Api, Model, ModelList>`
- **Details**: The typed `ApiTableRemoveButton` component with generic parameters applied.

### `Column`
- **Type**: `DefineComponent` with typed `body` slot
- **Details**: A properly typed `Column` component where the `body` slot receives `data`
  as `Plain<Model>` instead of `any`. This provides full type inference and autocomplete
  in your templates.

## Usage Example

```vue
<template>
	<ApiTable :list-state="listState">
		<Column
			field="title"
			header="Title" />
		<Column
			field="body"
			header="Body" />
		<Column
			:style="{ maxWidth: '112px', width: '112px' }"
			header="">
			<template #body="columnProps">
				<!-- columnProps.data is now properly typed as Plain<Post>! -->
				<ApiTableLinkButton
					:to="{ name: 'posts-edit', params: { id: columnProps.data.id } }"
					icon="fal fa-pen-to-square" />
				<ApiTableRemoveButton :item="columnProps.data" />
			</template>
		</Column>
	</ApiTable>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import useApiTable from '@/components/Table/useApiTable'
import Container from '@/components/Container.vue'
import { usePostListState } from '@/models/Post/States'

const listState = usePostListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
```

## Benefits

1. **Type Safety**: The `Column` component's `body` slot receives properly typed data,
   preventing runtime errors from accessing non-existent properties.

2. **Autocomplete**: Your IDE will provide autocomplete suggestions for properties on
   `columnProps.data`, making development faster and less error-prone.

3. **Type Checking**: TypeScript will catch type errors at compile time, such as accessing
   properties that don't exist on the model.

4. **Consistency**: All table-related components (`ApiTable`, `Column`, `ApiTableLinkButton`,
   `ApiTableRemoveButton`) share the same type information, ensuring consistency across
   your component.

## See Also

- [API - `ApiTable`](/api/frontend/api-table)
- [API - `ApiTableLinkButton`](/api/frontend/api-table-link-button)
- [API - `ApiTableRemoveButton`](/api/frontend/api-table-remove-button)
- [API - `ListState`](/api/frontend/list-state)
- [Frontend - Components](/frontend/components#apitable)

