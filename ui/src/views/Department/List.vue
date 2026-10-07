<template>
	<Header title="Departments">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'departments-create' })" />
	</Header>
	<Container>
		<ListSearch
			placeholder="Search Departments"
			:list-state="listState" />
	</Container>
	<Container>
		<ApiTable :list-state="listState">
			<Column
				field="name"
				header="Name" />
			<Column
				field="location"
				header="Location" />
			<Column
				header=""
				:style="{ maxWidth: '92px', width: '92px' }">
				<template #body="columnProps">
					<ApiTableLinkButton
						icon="fal fa-arrow-up-right-from-square"
						:to="{ name: 'departments-edit', params: { id: columnProps.data.id } }" />
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
import { useDepartmentListState } from '@/models/Department/States'

const router = useRouter()
const listState = useDepartmentListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
