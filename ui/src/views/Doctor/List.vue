<template>
	<Header
		:list-state="listState"
		search
		title="Doctors" />
	<Container>
		<ApiTable
			:list-state="listState"
			@row-click="openDetails">
			<Column
				field="first_name"
				header="First Name" />
			<Column
				field="last_name"
				header="Last Name" />
			<Column
				field="specialty"
				header="Specialty" />
			<Column
				field="contact_number"
				header="Contact Number" />
			<Column
				field="email_address"
				header="Email Address" />
			<Column
				field="consultation_fee"
				header="Consultation Fee" />
			<Column
				:style="{ maxWidth: '72px', width: '72px' }"
				header="">
				<template #body="slotProps">
					<ApiTableRemoveButton :item="slotProps.data" />
				</template>
			</Column>
		</ApiTable>
	</Container>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import ApiTable from '@/components/Table/ApiTable.vue'
import Column from 'primevue/column'
import Container from '@/components/Container.vue'
import type { Doctor } from '@/models/Doctor/Model'
import { useDoctorListState } from '@/models/Doctor/States'
import ApiTableRemoveButton from '@/components/Table/ApiTableRemoveButton.vue'

const listState = useDoctorListState()
const router = useRouter()

onBeforeMount(() => {
	listState.getList()
})

function openDetails(item: { data: Doctor }) {
	router.push({ name: 'doctors-edit', params: { id: item.data.id } })
}
</script>
