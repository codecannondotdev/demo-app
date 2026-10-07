---
outline: 'deep'
---

# `ApiTableRemoveButton`

> **Note:** This component requires that it is used within an `ApiTable` context
so that the necessary `listState` is available. If the injection fails, an error
is thrown.

## Component

```vue
<template>
	<Button
		class="api-table-remove-button"
		icon="fal fa-trash"
		severity="secondary"
		text
		rounded
		@click.stop="remove(item.id)" />
</template>

<script
	setup
	lang="ts"
	generic="
		Api extends IApi<Model, ModelList>,
		Model extends ModelType,
		ModelList extends LaravelPaginationResponse<Model>
	">
import type { Model as ModelType, Plain, PropertyType } from '@/helpers/models/Model'
import { defineProps, inject } from 'vue'
import type { IApi } from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'
import { createInjectionKey } from './ApiTable.vue'
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'

// Create confirmation instance
const confirm = useConfirm()

// Retrieve the injection key from the ApiTable component
const dataTableInjectionKey = createInjectionKey<Api, Model, ModelList>()
const injectedProps = inject(dataTableInjectionKey)
if (!injectedProps) throw new Error('ApiTableActions must be used inside ApiTable')

// Extract listState, which provides the API instance and list refresh functionality
const listState = injectedProps.listState
if (!listState) throw new Error('ApiTableActions must be used inside ApiTable with listState')

// Define the component prop
defineProps<{
	item: Plain<Model>
}>()

/**
 * remove
 * ------
 * Opens a confirmation dialog to delete an item.
 *
 * @param id - The identifier of the model to delete.
 *
 * When the deletion is confirmed, it:
 * - Calls the API's destroy method to delete the record.
 * - Refreshes the table list by invoking listState.getList().
 */
async function remove(id: PropertyType<Model, 'id'>) {
	confirm.require({
		message: `Are you sure you want to delete the this item?`,
		header: 'Danger Zone',
		icon: 'fas fa-exclamation-triangle',
		rejectLabel: 'Cancel',
		rejectProps: {
			label: 'Cancel',
			severity: 'secondary',
			outlined: true,
		},
		acceptProps: {
			label: 'Delete',
			severity: 'danger',
		},
		accept: async () => {
			await listState!.api.destroy(id)
			listState!.getList()
		},
		reject: () => {},
	})
}
</script>
```

## Generic Parameters

### `Api`
- **Type:** `IApi<Model, ModelList>`
- **Details:**
  The API instance used by the `ApiTable` must extend the generic API interface.
  It's type will be automatically inferred from the `listState` injected prop.

### `Model`
- **Type:** `ModelType`
- **Details:**
  The model type representing the data item. It's type will be automatically
  inferred from the `listState` injected prop.

### `ModelList`
- **Type:** `LaravelPaginationResponse<Model>`
- **Details:**
  The type representing the paginated response from the API. It's type will be
  automatically inferred from the `listState` injected prop.

## Props

### `item`
- **Type:** `Model`
- **Required:** `true`
- **Description:** The model instance representing a row in the API table. The
component uses `item.id` to know which item to delete.

## Injection

### `listState`
- **Type:** `ListState<Api, Model, ModelList>`
- **Details:**
  The `listState` object provides the API instance and list refresh functionality
  required to delete an item from the table. It's injected from the `ApiTable`
  component.

- See also
  - [Frontend - States](/frontend/states)
  - [Frontend - `ApiTable`](/frontend/components#apitable)
