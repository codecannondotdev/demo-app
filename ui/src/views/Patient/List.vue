<template>
	<Header title="Patients">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'patients-create' })" />
	</Header>
	<Container>
		<ListSearch
			:list-state="listState"
			placeholder="Search Patients" />
	</Container>
	<Container>
		<ApiTable :list-state="listState">
			<Column
				field="first_name"
				header="First Name" />
			<Column
				field="last_name"
				header="Last Name" />
			<Column header="Date Of Birth">
				<template #body="slotProps">
					{{
						slotProps.data.date_of_birth
							? format(new Date(slotProps.data.date_of_birth), 'yyyy-MM-dd')
							: ''
					}}
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
				:style="{ maxWidth: '92px', width: '92px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'patients-edit', params: { id: columnProps.data.id } }"
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
import { usePatientListState } from '@/models/Patient/States'
import { format } from 'date-fns'

const router = useRouter()
const listState = usePatientListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
