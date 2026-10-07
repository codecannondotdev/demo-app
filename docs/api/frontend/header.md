---
outline: 'deep'
---

# `Header`

`Header` is a component that provides a standardized header bar for views. It displays
a title, includes a mobile navigation menu button, and provides a slot for action
buttons. The component is sticky and provides consistent styling across all views.

- See also
  - [Frontend - Header](/frontend/components#header)

## Component

```vue
<template>
	<div class="header">
		<div class="header__content">
			<Button
				class="header__menu-button"
				icon="fal fa-bars"
				severity="secondary"
				@click="openNav" />
			<h2>{{ title }}</h2>
			<slot />
		</div>
		<HeaderLoader
			class="header__loader"
			:is-loading="isLoading" />
	</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { useNavigationStore } from '@/stores/Navigation'
import HeaderLoader from '@/components/HeaderLoader.vue'

defineProps<{
	title: string
	isLoading?: boolean
}>()

const navigation = useNavigationStore()

function openNav() {
	if (window.matchMedia('(max-width: 1500px)').matches) {
		navigation.open()
	}
}
</script>

<style scoped lang="scss">
.header {
	background: var(--p-surface-0);
	position: sticky;
	top: 0;
	z-index: 1000;
	border-left: 0;
	border-top: 0;
	border-right: 0;
	border-bottom: 1px solid var(--p-surface-200);
	display: flex;
	flex-direction: column;
	height: 64px;

	.header__content {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 10px 16px;
		height: 100%;
		width: 100%;
	}

	min-height: 64px;
	max-height: 64px;
	width: 100%;

	@media (prefers-color-scheme: dark) {
		background: var(--p-surface-950);
		border-bottom-color: var(--p-surface-900);
	}

	.header__menu-button {
		display: none;
	}

	@media (max-width: 1500px) {
		.header__menu-button {
			display: inline-flex;
		}
	}

	h2 {
		font-size: 22px;
		flex: 1;
	}
}
</style>
```

## Props

### `title`

- **Type**: `string`
- **Required**: `true`
- **Description**: The title text to display in the header. This is rendered as
  an `<h2>` element and takes up the available flex space.

### `isLoading`

- **Type**: `boolean`
- **Required**: `false`
- **Description**: Controls whether the integrated loading indicator is visible.
  When `true`, a progress bar appears at the bottom of the header. When `false`
  or `undefined`, the loader is hidden. The loader includes a 100ms delay before
  appearing to prevent flicker for fast operations.

## Slots

### `default`

- **Description**: The default slot allows you to place action buttons or other
  content in the header. This is commonly used for "Create" buttons in list views.
  The slot content appears after the title, aligned to the right side of the header.

## Behavior

### Sticky Positioning

The header is positioned as `sticky` at the top of the viewport (`top: 0`). This
means it remains visible when scrolling the page content. The header has a
`z-index` of 1000 to ensure it appears above other content.

### Mobile Menu Button

The header includes a hamburger menu button (`fal fa-bars` icon) that is hidden
by default on larger screens. On screens with a maximum width of 1500px, the
button becomes visible.

When clicked, the button opens the navigation overlay by calling
`navigation.open()` from the `NavigationStore`. This only happens on screens
smaller than 1500px, matching the breakpoint where the navigation becomes an
overlay.

## Usage Examples

### List View

```vue
<template>
	<Header title="Posts">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'posts-create' })" />
	</Header>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
```

### Edit View

```vue
<template>
	<Header
		:title="isEdit ? 'Edit Post' : 'Create Post'"
		:is-loading="loaders.size > 0" />
	<Container class="edit">
		<Form
			:id="route.params.id as string"
			@start-loading="loaders.add('form')"
			@stop-loading="loaders.delete('form')" />
	</Container>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import Container from '@/components/Container.vue'
import Form from './components/Form.vue'

const route = useRoute()
const isEdit = computed(() => route.name === 'posts-edit')
const loaders = reactive(new Set<string>())
</script>
```
