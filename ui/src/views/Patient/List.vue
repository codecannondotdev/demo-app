<template>
	<Header
		:list-state="listState"
		search
		title="Patients" />
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
			<Column header="Date Of Birth">
				<template #body="slotProps">
					{{ format(new Date(slotProps.data.date_of_birth), 'yyyy-MM-dd') }}
				</template>
			</Column>
			<Column
				field="gender"
				header="Gender" />
			<Column
				field="contact_number"
				header="Contact Number" />
			<Column
				field="email_address"
				header="Email Address" />
			<Column
				field="address"
				header="Address" />
			<Column
				field="emergency_contact_name"
				header="Emergency Contact Name" />
			<Column
				field="emergency_contact_number"
				header="Emergency Contact Number" />
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
import type { Patient } from '@/models/Patient/Model'
import { usePatientListState } from '@/models/Patient/States'
import ApiTableRemoveButton from '@/components/Table/ApiTableRemoveButton.vue'
import { format } from 'date-fns'

const listState = usePatientListState()
const router = useRouter()

onBeforeMount(() => {
	listState.getList()
})

function openDetails(item: { data: Patient }) {
	router.push({ name: 'patients-edit', params: { id: item.data.id } })
}
</script>
