<template>
	<Header title="Users" />
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
				:style="{ maxWidth: '112px', width: '112px' }">
				<template #body="columnProps">
					<ApiTableLinkButton
						icon="fal fa-pen-to-square"
						:to="{ name: 'users-edit', params: { id: columnProps.data.id } }" />
					<ApiTableRemoveButton :item="columnProps.data" />
				</template>
			</Column>
		</ApiTable>
	</Container>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { onBeforeMount } from 'vue'
import useApiTable from '@/components/Table/useApiTable'
import Container from '@/components/Container.vue'
import { useUserListState } from '@/models/User/States'

const listState = useUserListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
