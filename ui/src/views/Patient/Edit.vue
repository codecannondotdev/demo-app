<template>
	<Header :title="isEdit ? 'Edit Patient' : 'Create Patient'" />
	<HeaderLoader :is-loading="loaders.size > 0" />
	<Container class="edit">
		<Form
			:id="route.params.id as string"
			@start-loading="loaders.add('form')"
			@stop-loading="loaders.delete('form')"
			@deleted="router.push({ name: 'patients-list' })" />
		<BillingsRelationWidget
			v-if="isEdit"
			:patient-id="route.params.id as string"
			@start-loading="loaders.add('Billings')"
			@stop-loading="loaders.delete('Billings')" />
		<TreatmentsRelationWidget
			v-if="isEdit"
			:patient-id="route.params.id as string"
			@start-loading="loaders.add('Treatments')"
			@stop-loading="loaders.delete('Treatments')" />
		<AppointmentsRelationWidget
			v-if="isEdit"
			:patient-id="route.params.id as string"
			@start-loading="loaders.add('Appointments')"
			@stop-loading="loaders.delete('Appointments')" />
	</Container>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Form from './components/Form.vue'
import HeaderLoader from '@/components/HeaderLoader.vue'
import Container from '@/components/Container.vue'
import BillingsRelationWidget from './components/BillingsRelationWidget.vue'
import TreatmentsRelationWidget from './components/TreatmentsRelationWidget.vue'
import AppointmentsRelationWidget from './components/AppointmentsRelationWidget.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => route.name === 'patients-edit')
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
