<template>
	<Header title="Users">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'users-create' })" />
	</Header>
	<Container>
		<ListSearch
			placeholder="Search Users"
			:list-state="listState" />
	</Container>
	<Container>
		<ApiTable :list-state="listState">
			<Column
				field="name"
				header="Name" />
			<Column
				field="email"
				header="Email" />
			<Column
				field="role"
				header="Role" />
			<Column
				header=""
				:style="{ maxWidth: '92px', width: '92px' }">
				<template #body="columnProps">
					<ApiTableLinkButton
						icon="fal fa-arrow-up-right-from-square"
						:to="{ name: 'users-edit', params: { id: columnProps.data.id } }" />
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
import { useUserListState } from '@/models/User/States'

const router = useRouter()
const listState = useUserListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
