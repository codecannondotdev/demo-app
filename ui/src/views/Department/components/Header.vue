<template>
	<div class="header-toolbar">
		<Button
			v-if="!isList"
			icon="fas fa-chevron-left"
			severity="secondary"
			@click="router.push({ name: 'departments-list' })" />
		<h2>{{ props.title }}</h2>
		<InputText
			v-if="props.search && listState"
			v-model="searchString"
			class="header-toolbar__search"
			@update:model-value="listState.getList({ search: searchString })"
			@keyup.enter="listState.getList({ search: searchString })"></InputText>
		<Button
			v-if="isList"
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'departments-create' })" />
	</div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, type PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListState from '@/helpers/models/ListState'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	search: {
		type: Boolean,
		default: false,
	},
	listState: {
		type: Object as PropType<ListState<any, any, any>>,
		default: null,
	},
})

const route = useRoute()
const router = useRouter()
const isList = computed(() => route.name === 'departments-list')
const searchString = ref('')
</script>

<style scoped lang="scss">
.header-toolbar {
	background: var(--p-surface-0);
	position: sticky;
	top: 0;
	z-index: 1000;
	border-left: 0;
	border-top: 0;
	border-right: 0;
	border-bottom: 1px solid var(--p-surface-200);
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 10px;
	min-height: 64px;
	width: 100%;

	h2 {
		font-weight: 400;
	}

	@media (prefers-color-scheme: dark) {
		background: var(--p-surface-950);
		border-bottom-color: var(--p-surface-900);
	}

	.header-toolbar__search {
		flex: 1;
	}
}
</style>
