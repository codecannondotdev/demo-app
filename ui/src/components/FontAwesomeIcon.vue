<template>
	<span
		:key="icon"
		class="fa-icon">
		<i :class="icon" />
	</span>
</template>

<script setup lang="ts">
defineProps<{
	icon: string
}>()
</script>

<style scoped>
.fa-icon {
	display: contents;
}
</style>
