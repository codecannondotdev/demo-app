---
outline: 'deep'
---

# Relation Widget Component

The Relation Widget component provides an interface for managing related
entities on the edit view. In this example, the widget is used to display and
manage the **Users** related to a **Post**. It allows users to view associated
ussers, dissociate existing ones, and open dialogs to either connect additional
steps or create new ones.

Let's examine an example of a generated Relation Widget component for managing
Users:

```vue
<template>
	<Card class="users-relation-widget">
		<template #title>
			<h4 class="users-relation-widget__title">Users</h4>
			<Button
				icon="fal fa-link"
				label="Connect"
				outlined
				severity="secondary"
				@click="isRelationAddDialogActive = true" />
			<Button
				icon="fal fa-plus"
				label="Create"
				outlined
				severity="secondary"
				@click="isFormActive = true" />
		</template>
		<template #content>
			<ApiTable
				flat
				:list-state="listState">
				<Column
					field="email"
					header="Email" />
				<Column
					header=""
					:style="{ maxWidth: '112px', width: '112px' }">
					<template #body="{ data }">
						<ApiTableLinkButton
							:to="{ name: 'users-edit', params: { id: data.id } }"
							icon="fal fa-pen-to-square" />
						<Button
							icon="fal fa-xmark"
							severity="secondary"
							text
							rounded
							:loading="dissociateLoading === data.id"
							@click.stop.prevent="dissociate(data)" />
					</template>
				</Column>
			</ApiTable>
		</template>
	</Card>
	<UsersRelationAddDialog
		v-model="isRelationAddDialogActive"
		:post-id="props.postId"
		@update="refresh()" />
	<UserForm
		:as-dialog="true"
		:visible="isFormActive"
		:should-redirect="false"
		:force-values="{ post_id: props.postId }"
		:hide-inputs="['post_id']"
		@close="isFormActive = false"
		@created="refresh()" />
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from 'vue'
import UsersRelationAddDialog from './UsersRelationAddDialog.vue'
import UserForm from '@/views/User/components/Form.vue'
import Card from 'primevue/card'
import useApiTable from '@/components/Table/useApiTable'
import Button from 'primevue/button'
import { useUserListState } from '@/models/User/States'
import type { User } from '@/models/User/Model'
import type { Post } from '@/models/Post/Model'
import PostsApi from '@/models/Post/Api'

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
}>()

const props = defineProps<{
	postId: Post['id']
}>()

const isRelationAddDialogActive = ref(false)
const isFormActive = ref(false)
const dissociateLoading = ref(null as null | number | string)
const listLoading = ref(false)
const listState = useUserListState()
const { ApiTable, Column, ApiTableLinkButton } = useApiTable(listState)
listState.defaultParams = {
	per_page: 10,
	fromRelation: {
		model: 'App\\Models\\Post',
		id: props.postId,
		relation: 'users',
	},
}

onBeforeMount(() => {
	refresh()
})

async function refresh() {
	listLoading.value = true
	emit('start-loading')
	try {
		await listState.getList()
	} finally {
		listLoading.value = false
		emit('stop-loading')
	}
}

async function dissociate(item: User) {
	dissociateLoading.value = item.id
	emit('start-loading')
	try {
		await new PostsApi().updateRelation(props.postId, 'users', {
			method: 'dissociate',
			params: [item.id],
		})
		dissociateLoading.value = null
		await refresh()
	} finally {
		dissociateLoading.value = null
		emit('stop-loading')
	}
}
</script>

<style lang="scss" scoped>
.users-relation-widget {
	width: 100%;
	max-width: 600px;
	overflow: hidden;

	:deep(.p-card-body) {
		padding: 20px 0 0;

		.p-card-caption {
			padding: 0px 20px 12px;

			.p-card-title {
				display: flex;
				align-items: center;
				gap: 10px;

				.users-relation-widget__title {
					flex: 1;
					text-align: left;
				}
			}
		}
	}
}
</style>
```

## Overview

The Relation Widget component offers a compact, card-based interface to manage
related entities. In this example, it displays the **Users** associated with a
**Post**, providing a table view of the related items along with options to:

- **Connect:** Open a dialog to add existing Users via a multi-select table.
- **Create:** Launch a form to create a new User, which will automatically be
assigned to the Post.
- **Dissociate:** Remove an existing User association directly from the table.

- See also
  - [Generated Files - Relation Add Dialogs](/generated-files/frontend/components/relation-add-dialogs)
  - [Frontend - ApiTable](/frontend/components#apitable)

## Key Features

- **Dynamic Card Header:**
  The header slot of the Card displays the title ("Users") along with two action
  buttons:
  - **Connect Button:** Opens the **UsersRelationAddDialog**.
  - **Create Button:** Opens the **UserForm** dialog for creating a new User.

- **Selectable Table:**
  The table (`ApiTable`) within the content slot shows the current related Users.
  Each row includes:
  - A column displaying the step's **instruction**.
  - A dissociate button in each row that allows the removal of the association.

- **Dialog Integration:**
  - **UsersRelationAddDialog:** This dialog allows users to select and add
  multiple Users.
  - **UserForm:** This dialog is used for creating a new User. It is configured
  to automatically set the `recipe_id` to the current Post.

- See also
  - [Generated Files - Relation Add Dialogs](/generated-files/frontend/components/relation-add-dialogs)
  - [Frontend - ApiTable](/frontend/components#apitable)

## State Management & Behavior

- **List State:**
  The widget uses a `listState` (from `useUserListState`) to manage the table
  data. The default query parameters ensure that only Users associated with the
  current Post are retrieved (via the `fromRelation` parameter).

- **Loading Indicators:**
  Loading states for dissociating steps and fetching the list are managed with
  reactive variables (`dissociateLoading`, `listLoading`). The component emits
  global loading events (`start-loading` and `stop-loading`) to coordinate with
  the parent view.

- **Refreshing Data:**
  The `refresh` function is called to update the list of Users whenever a
  relation is modified. This function is triggered after dissociation and when
  dialogs emit an update event.

- **Routing:**
  Clicking on the edit button navigates to the edit view for that specific User
  using Vue Router.

- See also
  - [Frontend - States](/frontend/components#states)

## Summary

The generated Relation Widget component streamlines the management of related
entities by integrating a dynamic card interface, a selectable table, and modal
dialogs for connecting or creating new relations. It provides an intuitive user
experience for viewing, adding, and removing relationships between entities.

- **See also:**
  - [Frontend - ApiTable](/frontend/components#apitable)
  - [Generated Files - RelationWidgets](/generated-files/frontend/components/relation-widgets)
  - [API - Update Relation](/api/frontend/api#update-relation)
  - [Frontend - ToggleSwitch](/frontend/components#toggleswitch)
