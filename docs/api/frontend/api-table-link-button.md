---
outline: 'deep'
---

# `ApiTableLinkButton`

Creates a link button in the style of table buttons with `RouterLink`.

## Component

```vue
<template>
	<Button
		v-slot="buttonProps"
		as-child
		severity="secondary"
		text
		rounded>
		<RouterLink
			class="api-table-link-button"
			:to
			:class="buttonProps.class">
			<FontAwesomeIcon :icon />
		</RouterLink>
	</Button>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps<{
	to: InstanceType<typeof RouterLink>['$props']['to']
	icon: string
}>()
</script>
```

## Props

### `to`
- **Type:** `RouterLink>['$props']['to']`
- **Required:** `true`
- **Description:** The route you want the router link to redirect to.

## `icon`
- **Type:** `string`
- **Required:** `true`
- **Description:** The icon you want the button to display.
