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

const emit = defineEmits(['close'])
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

<style lang="scss">
.form-container {
	width: 100%;
	max-width: 600px;
}
</style>
