<template>
	<Header title="Users">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'users-create' })" />
	</Header>
	<Container>
		<ListSearch
			:list-state="listState"
			placeholder="Search Users" />
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
				:style="{ maxWidth: '92px', width: '92px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'users-edit', params: { id: columnProps.data.id } }"
						icon="fal fa-arrow-up-right-from-square" />
					<ApiTableRemoveButton :item="columnProps.data" />
				</template>
			</Column>
		</ApiTable>
	</Container>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import useApiTable from '@/components/Table/useApiTable'
import Container from '@/components/Container.vue'
import ListSearch from '@/components/ListSearch.vue'
import Button from 'primevue/button'
import { useUserListState } from '@/models/User/States'

const router = useRouter()
const listState = useUserListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
