---
outline: 'deep'
---

# `FormContainer`

The `FormContainer` component is a wrapper component that adds forms the ability
to be rendered either as a card or as a dialog.

- See also
  - [Frontend - Form Container](/frontend/components#formcontainer)

## Component

```vue
<template>
	<Dialog
		v-if="asDialog"
		:visible="visible"
		modal
		class="form-container"
		:header="title"
		@update:visible="emit('close')">
		<slot />
	</Dialog>
	<Card
		v-else
		border
		class="form-container">
		<template #title>
			{{ title }}
		</template>
		<template #content>
			<slot />
		</template>
	</Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'

const emit = defineEmits<{
	(e: 'close'): void
}>()

withDefaults(
	defineProps<{
		asDialog?: boolean
		visible?: boolean
		title: string
	}>(),
	{
		asDialog: false,
		visible: false,
	},
)
</script>
```

## Props

### `asDialog`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether to render the form as a dialog or as a card.

### `visible`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether the dialog is visible when used as a dialog.

### `title`

- **Type**: `string`
- **Required**: `true`
- **Description**: The title to display for the form.
