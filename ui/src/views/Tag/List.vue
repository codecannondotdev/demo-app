<template>
	<Header title="Tags">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'tags-create' })" />
	</Header>
	<Container>
		<ListSearch
			placeholder="Search Tags"
			:list-state="listState" />
	</Container>
	<Container>
		<ApiTable :list-state="listState">
			<Column
				field="name"
				header="Name" />
			<Column
				header=""
				:style="{ maxWidth: '92px', width: '92px' }">
				<template #body="columnProps">
					<ApiTableLinkButton
						icon="fal fa-arrow-up-right-from-square"
						:to="{ name: 'tags-edit', params: { id: columnProps.data.id } }" />
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
import { useTagListState } from '@/models/Tag/States'

const router = useRouter()
const listState = useTagListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
