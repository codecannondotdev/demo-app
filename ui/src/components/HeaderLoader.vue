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
