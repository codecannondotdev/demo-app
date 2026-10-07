<template>
	<Header
		:is-loading="loaders.size > 0"
		:title="isEdit ? 'Edit Nurse' : 'Create Nurse'" />
	<Container class="edit">
		<Form
			:id="route.params.id as string"
			@deleted="router.push({ name: 'nurses-list' })"
			@start-loading="loaders.add('form')"
			@stop-loading="loaders.delete('form')" />
		<AppointmentsRelationWidget
			v-if="isEdit"
			:nurse-id="route.params.id as string"
			@start-loading="loaders.add('Appointments')"
			@stop-loading="loaders.delete('Appointments')" />
	</Container>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Container from '@/components/Container.vue'
import Form from './components/Form.vue'
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppointmentsRelationWidget from './components/AppointmentsRelationWidget.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => route.name === 'nurses-edit')
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
