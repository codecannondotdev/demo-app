<template>
	<Header
		:list-state="listState"
		search
		title="Appointments" />
	<Container>
		<ApiTable
			:list-state="listState"
			@row-click="openDetails">
			<Column header="Appointment Date">
				<template #body="slotProps">
					{{ format(new Date(slotProps.data.appointment_date), 'yyyy-MM-dd') }}
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
import type { Appointment } from '@/models/Appointment/Model'
import { useAppointmentListState } from '@/models/Appointment/States'
import ApiTableRemoveButton from '@/components/Table/ApiTableRemoveButton.vue'
import { format } from 'date-fns'

const listState = useAppointmentListState()
const router = useRouter()

onBeforeMount(() => {
	listState.getList()
})

function openDetails(item: { data: Appointment }) {
	router.push({ name: 'appointments-edit', params: { id: item.data.id } })
}
</script>
