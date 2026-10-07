---
outline: 'deep'
---

# `useDataTable`

The `useDataTable` composable provides a type-safe way to use PrimeVue's `DataTable` and
`Column` components with proper TypeScript type inference in Column slot props.

## Problem

PrimeVue's `DataTable` component is engineered in such a way that the `Column` component
doesn't know what type the data table is. This means when you use the `Column` component
directly from PrimeVue, you don't get type inference in Column slot props (like the `body`
slot), making it difficult to work with typed data in your templates.

For example, when using PrimeVue's `Column` directly:

```vue
<template>
	<DataTable :value="items">
		<Column field="name" header="Name" />
		<Column header="Actions">
			<template #body="columnProps">
				<!-- columnProps.data is typed as 'any' - no type inference! -->
				{{ columnProps.data.name }}
			</template>
		</Column>
	</DataTable>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

interface User {
	id: number
	name: string
	email: string
}

const items = ref<User[]>([
	{ id: 1, name: 'John Doe', email: 'john@example.com' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com' },
])
</script>
```

## Solution

The `useDataTable` composable solves this by providing a properly typed `Column` component
that knows the data type used in the table. By importing components through the composable,
the data type used in the table is also enforced on the table child components.

## Function Signature

```typescript
export default function useDataTable<T>(): {
	DataTable: typeof DataTable
	Column: DefineComponent<
		ColumnProps,
		Omit<ColumnSlots, 'body'> & {
			body(scope: Omit<Parameters<ColumnSlots['body']>[0], 'data'> & { data: T }): VNode[]
		},
		ColumnEmits
	>
}
```

## Generic Parameters

### `T`
- **Type**: Any type
- **Details**: The type of the data items in the table. This should match the type of
  the array passed to the `DataTable` component's `value` prop.

## Return Value

The composable returns an object with the following properties:

### `DataTable`
- **Type**: `typeof DataTable`
- **Details**: The PrimeVue `DataTable` component (untyped, as it doesn't need type
  modifications).

### `Column`
- **Type**: `DefineComponent` with typed `body` slot
- **Details**: A properly typed `Column` component where the `body` slot receives `data`
  as type `T` instead of `any`. This provides full type inference and autocomplete in
  your templates.

## Usage Example

```vue
<template>
	<DataTable :value="items">
		<Column
			field="name"
			header="Name" />
		<Column
			field="email"
			header="Email" />
		<Column header="Actions">
			<template #body="columnProps">
				<!-- columnProps.data is now properly typed as User! -->
				<Button
					@click="editUser(columnProps.data.id)"
					label="Edit" />
			</template>
		</Column>
	</DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useDataTable from '@/components/primevue/useDataTable'
import Button from 'primevue/button'

interface User {
	id: number
	name: string
	email: string
}

const items = ref<User>([
	{ id: 1, name: 'John Doe', email: 'john@example.com' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com' },
])

const { DataTable, Column } = useDataTable<User>()

function editUser(id: number) {
	// Handle edit
}
</script>
```

## When to Use

Use `useDataTable` when:

- You're working with a standard PrimeVue `DataTable` (not `ApiTable`)
- You have local data or data that doesn't come from a `ListState`
- You want type safety in your Column slot props
- You need autocomplete and type checking for your table data

For API-backed tables that use `ListState`, prefer [`useApiTable`](/api/frontend/use-api-table)
instead, as it provides additional type safety and integrates with the API layer.

## Benefits

1. **Type Safety**: The `Column` component's `body` slot receives properly typed data,
   preventing runtime errors from accessing non-existent properties.

2. **Autocomplete**: Your IDE will provide autocomplete suggestions for properties on
   `columnProps.data`, making development faster and less error-prone.

3. **Type Checking**: TypeScript will catch type errors at compile time, such as accessing
   properties that don't exist on the data type.

4. **Simplicity**: Works with any data type, making it easy to use with local data or
   custom data structures.

## See Also

- [API - `useApiTable`](/api/frontend/use-api-table) - For API-backed tables with `ListState`
- [Frontend - Components](/frontend/components#apitable)

