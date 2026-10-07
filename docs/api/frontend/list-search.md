---
outline: 'deep'
---

# `ListSearch`

`ListSearch` is a search input component designed for use with `ListState` instances.
It provides a debounced search functionality that automatically queries the list state
when the user types, with a clear button to reset the search.

- See also
  - [Frontend - ListSearch](/frontend/components#listsearch)
  - [API - `ListState`](/api/frontend/list-state)

## Component

```vue
<template>
	<div class="list-search">
		<IconField>
			<InputIcon class="fal fa-search" />
			<InputText
				v-model="searchString"
				class="list-search__input"
				:placeholder
				@update:model-value="debouncedUpdateSearch"
				@keyup.enter="handleSearch" />
			<button
				v-if="searchString"
				class="list-search__clear"
				type="button"
				@click="clearSearch">
				<FontAwesomeIcon icon="fal fa-xmark" />
			</button>
		</IconField>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import InputIcon from 'primevue/inputicon'
import IconField from 'primevue/iconfield'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ListState from '@/helpers/models/ListState'

const props = defineProps<{
	listState: ListState<any, any, any>
	placeholder?: string
}>()

const searchString = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

function debouncedUpdateSearch() {
	if (searchTimer) clearTimeout(searchTimer)
	searchTimer = setTimeout(() => {
		handleSearch()
	}, 300)
}

function handleSearch() {
	if (searchTimer) clearTimeout(searchTimer)
	props.listState.getList({ search: searchString.value || undefined, page: 1 })
}

function clearSearch() {
	searchString.value = ''
	props.listState.getList({ search: undefined, page: 1 })
}
</script>

<style scoped lang="scss">
.list-search {
	width: 100%;

	:deep(.p-icon-field) {
		position: relative;
		width: 100%;
	}

	.list-search__input {
		width: 100%;
	}

	.list-search__clear {
		position: absolute;
		right: 8px;
		top: 50%;
		transform: translateY(-50%);
		background: transparent;
		border: none;
		color: var(--p-text-secondary-color);
		cursor: pointer;
		padding: 4px;
		z-index: 1;
	}
}
</style>
```

## Props

### `listState`

- **Type**: `ListState<any, any, any>`
- **Required**: `true`
- **Description**: The list state instance to search. The component will call
  `listState.getList()` with the search parameter when the user types. The search
  is debounced by 300ms to reduce unnecessary API calls.

### `placeholder`

- **Type**: `string`
- **Default**: `undefined`
- **Description**: The placeholder text to display in the search input.

## Behavior

### Debounced Search

The component implements a 300ms debounce on search input. When the user types,
the search is delayed until they stop typing for 300ms. This reduces the number
of API calls made while the user is actively typing.

### Enter Key Support

Users can press the Enter key to immediately trigger the search without waiting
for the debounce timer. This provides a responsive experience for users who want
to search immediately.

### Clear Button

When there's text in the search input, a clear button (X icon) appears on the
right side of the input. Clicking this button will:
- Clear the search input
- Reset the search by calling `listState.getList()` with `search: undefined`
- Reset pagination to page 1

### Automatic Pagination Reset

When searching (either through debounced input or Enter key), the component
automatically resets pagination to page 1. This ensures users see results from
the beginning of the filtered list.

### Search Parameter

The component passes the search string to `listState.getList()` as the `search`
parameter. If the search string is empty, it passes `undefined` to clear the
search filter.
