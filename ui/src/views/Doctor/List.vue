<template>
	<Header title="Doctors">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'doctors-create' })" />
	</Header>
	<Container>
		<ListSearch
			:list-state="listState"
			placeholder="Search Doctors" />
	</Container>
	<Container>
		<ApiTable :list-state="listState">
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
				:style="{ maxWidth: '92px', width: '92px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'doctors-edit', params: { id: columnProps.data.id } }"
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
import { useDoctorListState } from '@/models/Doctor/States'

const router = useRouter()
const listState = useDoctorListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
