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
import FontAwesomeIcon from '@/components/FontAwesomeIcon.vue'
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
