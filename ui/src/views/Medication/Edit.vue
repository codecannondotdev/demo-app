<template>
	<Header
		:title="isEdit ? 'Edit Medication' : 'Create Medication'"
		:is-loading="loaders.size > 0" />
	<Container class="edit">
		<Form
			:id="route.params.id as string"
			@start-loading="loaders.add('form')"
			@stop-loading="loaders.delete('form')"
			@deleted="router.push({ name: 'medications-list' })" />
		<TagsRelationWidget
			v-if="isEdit"
			:medication-id="route.params.id as string"
			@start-loading="loaders.add('Tags')"
			@stop-loading="loaders.delete('Tags')" />
		<TreatmentsRelationWidget
			v-if="isEdit"
			:medication-id="route.params.id as string"
			@start-loading="loaders.add('Treatments')"
			@stop-loading="loaders.delete('Treatments')" />
	</Container>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Container from '@/components/Container.vue'
import Form from './components/Form.vue'
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TagsRelationWidget from './components/TagsRelationWidget.vue'
import TreatmentsRelationWidget from './components/TreatmentsRelationWidget.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => route.name === 'medications-edit')
const loaders = reactive(new Set<string>())
</script>

<style lang="scss" scoped>
.edit {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
	gap: 20px;
	justify-items: center;
	align-items: start;
}
</style>
