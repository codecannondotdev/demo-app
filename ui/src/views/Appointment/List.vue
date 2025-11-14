<template>
	<Header
		:list-state="listState"
		search
		title="Appointments" />
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
				:style="{ maxWidth: '112px', width: '112px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'appointments-edit', params: { id: columnProps.data.id } }"
						icon="fal fa-pen-to-square" />
					<ApiTableRemoveButton :item="columnProps.data" />
				</template>
			</Column>
		</ApiTable>
	</Container>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import { onBeforeMount } from 'vue'
import useApiTable from '@/components/Table/useApiTable'
import Container from '@/components/Container.vue'
import { useAppointmentListState } from '@/models/Appointment/States'
import { format } from 'date-fns'

const listState = useAppointmentListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
