<template>
	<Header
		:list-state="listState"
		search
		title="Nurses" />
	<Container>
		<ApiTable :list-state="listState">
			<Column
				field="first_name"
				header="First Name" />
			<Column
				field="last_name"
				header="Last Name" />
			<Column
				field="shift"
				header="Shift" />
			<Column
				field="contact_number"
				header="Contact Number" />
			<Column
				field="email_address"
				header="Email Address" />
			<Column
				:style="{ maxWidth: '112px', width: '112px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'nurses-edit', params: { id: columnProps.data.id } }"
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
import { useNurseListState } from '@/models/Nurse/States'

const listState = useNurseListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
