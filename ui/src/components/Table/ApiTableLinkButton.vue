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

<style lang="scss" scoped>
.api-table-link-button {
	width: 30px;
	height: 30px;
	border-radius: 100%;
}
</style>
