---
outline: 'deep'
---

# List View

Frontend List Views are Vue components generated for every module to display a
paginated table of entities. These views integrate with module-specific state
management to fetch data from your API and provide built-in functionality such
as search, deletion, and navigation.

Let's look at an example of a generated List View for the **Post** module:

```vue
<template>
	<Header title="Posts">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'posts-create' })" />
	</Header>
	<Container>
		<ListSearch
			:list-state="listState"
			placeholder="Search Posts" />
	</Container>
	<Container>
		<ApiTable :list-state="listState">
			<Column
				field="title"
				header="Title" />
			<Column
				field="description"
				header="Description" />
			<Column
				:style="{ maxWidth: '92px', width: '92px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'posts-edit', params: { id: columnProps.data.id } }"
						icon="fal fa-arrow-up-right-from-square" />
					<ApiTableRemoveButton :item="columnProps.data" />
				</template>
			</Column>
		</ApiTable>
	</Container>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import useApiTable from '@/components/Table/useApiTable'
import Container from '@/components/Container.vue'
import ListSearch from '@/components/ListSearch.vue'
import Button from 'primevue/button'
import { usePostListState } from '@/models/Post/States'

const router = useRouter()
const listState = usePostListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
```

The List View component is built using a collection of reusable pieces, which
you can customize as needed.

## Data Fetching

The view leverages the module-specific state (in this case, `usePostListState`)
to manage its data. The call to `listState.getList()` is executed during the
`onBeforeMount` lifecycle hook to ensure data is loaded as soon as the component
is about to render:

```typescript
onBeforeMount(() => {
	listState.getList()
})
```

## Table Rendering & Interaction

The `ApiTable` component is at the heart of the List View. It receives the
`listState` prop—containing data, loading, and pagination details—and handles
the rendering of rows and columns. Each row also has a delete and edit action
buttons.

## Reusable Components

The List View utilizes several shared components that standardize the UI across
all modules:

- **Header**
  Displays the module title and provides a slot for action buttons (such as a
  "Create" button). The header is sticky and includes a mobile menu button for
  navigation on smaller screens.

- **ListSearch**
  Provides a search input with debounced search functionality. The component
  automatically queries the `listState` when the user types, with a 300ms debounce
  to reduce API calls. It includes a clear button to reset the search.

- **Container**
  Provides layout structure and spacing to ensure consistency between different
  views.

- **ApiTable**
  Renders a table using the data provided by the `listState` and emits events
  like `row-click` for further interactions.

- **ApiTableRemoveButton**
  Adds a delete button for the record.

- **ApiTableLinkButton**
  Adds a link to the edit page for a record.

- See also
  - [Frontend - ApiTable](/frontend/components#apitable)
  - [Frontend - Header](/frontend/components#header)
  - [Frontend - ListSearch](/frontend/components#listsearch)
  - [Frontend - ApiTableRemoveButton](/frontend/components#apitableremovebutton)
  - [Frontend - Container](/frontend/components#container)
  - [API - `ApiTable`](/api/frontend/api-table)
  - [API - `ApiTableRemoveButton`](/api/frontend/api-table-remove-button)
