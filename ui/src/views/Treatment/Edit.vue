<template>
	<Header
		:title="isEdit ? 'Edit Treatment' : 'Create Treatment'"
		:is-loading="loaders.size > 0" />
	<Container class="edit">
		<Form
			:id="route.params.id as string"
			@start-loading="loaders.add('form')"
			@stop-loading="loaders.delete('form')"
			@deleted="router.push({ name: 'treatments-list' })" />
		<MedicationsRelationWidget
			v-if="isEdit"
			:treatment-id="route.params.id as string"
			@start-loading="loaders.add('Medications')"
			@stop-loading="loaders.delete('Medications')" />
	</Container>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Form from './components/Form.vue'
import Container from '@/components/Container.vue'
import MedicationsRelationWidget from './components/MedicationsRelationWidget.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => route.name === 'treatments-edit')
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
