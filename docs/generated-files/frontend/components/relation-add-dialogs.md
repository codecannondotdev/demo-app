---
outline: 'deep'
---

# Relation Add Dialog

The Relation Add Dialog is a generated Vue component that enables users to add
related entities (for example, assigning multiple Steps to a Recipe) using a
slide-out drawer interface. It combines a searchable, selectable table with a
toggle filter to control which related items are displayed, and provides an easy
way to associate multiple entities at once.

Let's look at an example of a generated Relation Add Dialog for adding **Steps**
to a **Recipe**:

```vue
<template>
	<Drawer
		v-model:visible="isActive"
		position="right"
		class="recipe-steps-add-dialog"
		header="Add Step">
		<div class="recipe-steps-add-dialog__header">
			<div class="recipe-steps-add-dialog__assigned-filter-container">
				<div class="recipe-steps-add-dialog__assigned-filter-label-container">
					<label>Show all Steps</label>
					<label>
						<small>
							Assigning Steps to this Recipe will change their current assignment
						</small>
					</label>
				</div>
				<ToggleSwitch v-model="withAssigned" />
			</div>
			<div class="recipe-steps-add-dialog__search-container">
				<IconField>
					<InputIcon class="fal fa-search" />
					<InputText
						v-model="searchString"
						class="recipe-steps-add-dialog__search-input"
						placeholder="Search"
						@update:model-value="listState.getList({ search: searchString })"
						@keyup.enter="listState.getList({ search: searchString })" />
				</IconField>
			</div>
		</div>
		<div class="recipe-steps-add-dialog__table-container">
			<ApiTable
				v-model:selection="selected"
				selection-mode="multiple"
				flat
				:list-state="listState">
				<Column
					selection-mode="multiple"
					header-style="width: 3rem"></Column>
				<Column
					field="instruction"
					header="Instruction" />
			</ApiTable>
		</div>
		<div class="recipe-steps-add-dialog__add-buttton-container">
			<Button
				class="recipe-steps-add-dialog__add-button"
				:disabled="selected.length === 0"
				:loading="isLoading"
				:label="`Add ${selected.length} Steps`"
				icon="fal fa-plus"
				@click="submit" />
		</div>
	</Drawer>
</template>

<script setup lang="ts">
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import useApiTable from '@/components/Table/useApiTable'
import InputText from 'primevue/inputtext'
import InputIcon from 'primevue/inputicon'
import IconField from 'primevue/iconfield'
import ToggleSwitch from 'primevue/toggleswitch'
import type { Recipe } from '@/models/Recipe/Model'
import { ref, watch } from 'vue'
import type { Step } from '@/models/Step/Model'
import { useStepListState } from '@/models/Step/States'
import RecipesApi from '@/models/Recipe/Api'

const emit = defineEmits<{
	(e: 'update'): void
}>()

const isActive = defineModel<boolean>()

const props = defineProps<{
	recipeId: Recipe['id']
}>()

const selected = ref<Step[]>([])
const isLoading = ref(false)
const searchString = ref('')
const withAssigned = ref(false)

const listState = useStepListState()
const { ApiTable, Column } = useApiTable(listState)
listState.defaultParams = {
	notFromRelation: {
		model: 'App\\Models\\Recipe',
		id: props.recipeId,
		relation: 'steps',
	},
}

watch(
	withAssigned,
	() => {
		if (withAssigned.value) {
			listState.query().save()
		} else {
			listState.query().whereDoesntHave('recipe').save()
		}
		if (isActive.value) {
			listState.getList()
		}
	},
	{ immediate: true },
)

watch(
	isActive,
	() => {
		if (!isActive.value) {
			withAssigned.value = false
			searchString.value = ''
			selected.value = []
			listState.clearList()
		} else {
			listState.getList()
		}
	},
	{ immediate: true },
)

async function submit() {
	isLoading.value = true
	try {
		await new RecipesApi().updateRelation(props.recipeId, 'steps', {
			method: 'associate',
			params: selected.value.map((item) => item.id),
		})
		isActive.value = false
		emit('update')
		selected.value = []
	} finally {
		isLoading.value = false
	}
}
</script>

<style lang="scss">
.recipe-steps-add-dialog {
	width: 800px !important;

	.p-drawer-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0;
	}

	.recipe-steps-add-dialog__header {
		padding: 10px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;

		.recipe-steps-add-dialog__search-container {
			flex: 1;
			width: 100%;

			.recipe-steps-add-dialog__search-input {
				width: 100%;
			}
		}

		.recipe-steps-add-dialog__assigned-filter-container {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 10px;

			.recipe-steps-add-dialog__assigned-filter-label-container {
				display: flex;
				flex-direction: column;

				& > label {
					line-height: 1.2;
					text-align: right;

					small {
						opacity: 0.5;
					}
				}
			}
		}
	}

	.recipe-steps-add-dialog__table-container {
		border-top: 1px solid var(--p-datatable-body-cell-border-color);
		flex: 1;
		overflow: auto;
		display: flex;

		.ui-api-table__table {
			flex: 1;
		}
	}

	.recipe-steps-add-dialog__add-buttton-container {
		padding: 20px;
		display: flex;
		justify-content: flex-end;
		border-top: 1px solid var(--p-datatable-body-cell-border-color);

		.recipe-steps-add-dialog__add-button {
			min-height: 39px;
		}
	}
}
</style>
```

## Overview

The Relation Add Dialog component provides a user interface for associating
related entities with a parent entity. In this example, the dialog is used to
add **Steps** to a **Recipe**. It uses a sliding drawer for a modern and
unobtrusive experience.

## Key Features

- **Drawer Interface:**
  The component uses a `Drawer` to slide in from the right. The drawer displays
  a header, a searchable and selectable table of related items, and an action
  button to confirm the association.

- **Toggle Filter for Assigned Items:**
  A toggle switch (`ToggleSwitch`) lets users choose whether to include items
  that are already assigned. This allows you to decide whether to display all
  items or only those unassigned.

- **Searchable List:**
  An input field (`InputText`) paired with an icon (`InputIcon`) provides search
  functionality. As the user types or presses Enter, the list is refreshed via
  the `listState.getList` method with the current search string.

- **Selectable Table:**
  The `ApiTable` component displays a list of related items (Steps). It supports
  multiple selection mode, allowing the user to select several items at once.
  A selection column is provided, along with columns for relevant data (in this
  case, the Step instruction).

- **Action Button:**
  A button at the bottom of the dialog confirms the addition of the selected
  items. It shows a dynamic label (e.g., "Add 3 Steps") and is disabled when no
  items are selected.

- See also
  - [Frontend - Drawer](/frontend/components#drawer)
  - [Frontend - ApiTable](/frontend/components#apitable)

## State Management & Behavior

- **Reactive Visibility:**
  The dialog's visibility is controlled via the `isActive` model. Watchers are
  set up on `isActive` to clear the selection, search string, and list when the
  dialog is closed, and to fetch the list when it is opened.

- **Dynamic Querying:**
  The `withAssigned` toggle and `searchString` are used to adjust the query
  parameters on `listState`. A watcher on `withAssigned` updates the query to
  either include all items or only those without an existing relation, and then
  fetches the list.

- **Submitting Selections:**
  When the user clicks the add button, the `submit` function is executed. It
  calls the `updateRelation` method of the Recipes API to associate the selected
  steps with the recipe, then resets the dialog state and emits an update event.

- See also
  - [Frontend - States](/frontend/components#states)
  - [Frontend - QueryBuilder](/frontend/components#querybuilder)
  - [Frontend - Apis](/frontend/apis)
  - [API - Update Relation](/api/frontend/api#update-relation)

## Summary

The generated Relation Add Dialog component streamlines the process of
associating related entities with a parent entity. By combining a drawer
interface, dynamic filtering, and a selectable table, it offers a powerful yet
user-friendly way to update relations within your application.

- **See also:**
  - [Frontend - ApiTable](/frontend/components#apitable)
  - [Frontend - States](/frontend/components#states)
  - [Frontend - QueryBuilder](/frontend/components#querybuilder)
  - [Generated Files - RelationWidgets](/generated-files/frontend/components/relation-widgets)
  - [API - Update Relation](/api/frontend/api#update-relation)
