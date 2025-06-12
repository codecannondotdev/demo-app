<template>
	<Button
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
import type { Model as ModelType, PropertyType } from '@/helpers/models/Model'
import { defineProps, inject, type PropType } from 'vue'
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
defineProps({
	item: {
		type: Object as PropType<Model>,
		required: true,
	} as any,
})

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
		icon: 'fa fa-exclamation-triangle',
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
