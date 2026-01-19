<template>
	<Header title="Appointments">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'appointments-create' })" />
	</Header>
	<Container>
		<ListSearch
			:list-state="listState"
			placeholder="Search Appointments" />
	</Container>
	<Container>
		<ApiTable :list-state="listState">
			<Column header="Appointment Date">
				<template #body="slotProps">
					{{
						slotProps.data.appointment_date
							? format(new Date(slotProps.data.appointment_date), 'yyyy-MM-dd')
							: ''
					}}
				</template>
			</Column>
			<Column
				field="appointment_time"
				header="Appointment Time" />
			<Column
				field="reason_for_visit"
				header="Reason For Visit" />
			<Column
				field="status"
				header="Status" />
			<Column
				:style="{ maxWidth: '92px', width: '92px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'appointments-edit', params: { id: columnProps.data.id } }"
						icon="fal fa-arrow-up-right-from-square" />
					<ApiTableRemoveButton :item="columnProps.data" />
				</template>
			</Column>
		</ApiTable>
	</Container>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Container from '@/components/Container.vue'
import ListSearch from '@/components/ListSearch.vue'
import Button from 'primevue/button'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import useApiTable from '@/components/Table/useApiTable'
import { useAppointmentListState } from '@/models/Appointment/States'
import { format } from 'date-fns'

const router = useRouter()
const listState = useAppointmentListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
