---
outline: 'deep'
---

# `HeaderLoader`

`HeaderLoader` is a component that displays a loading indicator using an indeterminate
progress bar. It can be used standalone or as an integrated loader within the `Header`
component. The component includes a 100ms delay before appearing to prevent visual
flicker for fast operations.

- See also
  - [Frontend - HeaderLoader](/frontend/components#headerloader)
  - [API - Header](/api/frontend/header)

## Component

```vue
<template>
	<ProgressBar
		v-if="showLoader"
		mode="indeterminate"
		class="header-loader" />
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import ProgressBar from 'primevue/progressbar'

const props = defineProps<{
	isLoading?: boolean
}>()

const showLoader = ref(false)
let delayTimeout: ReturnType<typeof setTimeout> | null = null

watch(
	() => props.isLoading,
	(isLoading) => {
		if (delayTimeout) {
			clearTimeout(delayTimeout)
			delayTimeout = null
		}

		if (isLoading) {
			delayTimeout = setTimeout(() => {
				showLoader.value = true
				delayTimeout = null
			}, 100)
		} else {
			showLoader.value = false
		}
	},
	{ immediate: true },
)

onBeforeUnmount(() => {
	if (delayTimeout) {
		clearTimeout(delayTimeout)
	}
})
</script>

<style lang="scss" scoped>
.header-loader {
	height: 2px;
	min-height: 2px;
	max-height: 2px;
	margin-bottom: -2px;
	width: 100%;
	border-radius: 0;
	background: transparent;
}
</style>
```

## Props

### `isLoading`

- **Type**: `boolean`
- **Required**: `false`
- **Description**: Controls whether the loader is visible. When `true`, the loader
  appears after a 100ms delay. When `false` or `undefined`, the loader hides immediately.
  The delay prevents flicker for fast operations that complete quickly.

## Behavior

### Delayed Appearance

The loader includes a 100ms delay before appearing when `isLoading` becomes `true`.
This prevents unnecessary visual flicker for operations that complete very quickly
(under 100ms). If the loading state changes to `false` before the delay completes,
the loader will never appear.

### Immediate Hiding

When `isLoading` changes to `false`, the loader hides immediately with no delay.
This ensures users see the completion state right away.

### Styling

The loader is styled to:
- Have a height of 2px
- Use a negative bottom margin of -2px to seamlessly integrate with headers
- Take up 100% width of its container

## Integration with Header

When used within the `Header` component, the loader is positioned at the bottom of
the header using a flex column layout. The negative margin ensures it doesn't add
extra spacing to the header's fixed 64px height.

- See also
  - [API - Header](/api/frontend/header)
