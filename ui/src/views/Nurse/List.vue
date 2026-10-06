<template>
	<Header title="Nurses">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'nurses-create' })" />
	</Header>
	<Container>
		<ListSearch
			placeholder="Search Nurses"
			:list-state="listState" />
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
				field="shift"
				header="Shift" />
			<Column
				field="contact_number"
				header="Contact Number" />
			<Column
				field="email_address"
				header="Email Address" />
			<Column
				header=""
				:style="{ maxWidth: '92px', width: '92px' }">
				<template #body="columnProps">
					<ApiTableLinkButton
						icon="fal fa-arrow-up-right-from-square"
						:to="{ name: 'nurses-edit', params: { id: columnProps.data.id } }" />
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
import { useNurseListState } from '@/models/Nurse/States'

const router = useRouter()
const listState = useNurseListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
