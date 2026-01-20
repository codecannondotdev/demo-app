<template>
	<Header title="Treatments">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'treatments-create' })" />
	</Header>
	<Container>
		<ListSearch
			:list-state="listState"
			placeholder="Search Treatments" />
	</Container>
	<Container>
		<ApiTable :list-state="listState">
			<Column header="Treatment Date">
				<template #body="slotProps">
					{{
						slotProps.data.treatment_date
							? format(new Date(slotProps.data.treatment_date), 'yyyy-MM-dd')
							: ''
					}}
				</template>
			</Column>
			<Column
				field="description"
				header="Description" />
			<Column
				field="outcome"
				header="Outcome" />
			<Column
				field="cost"
				header="Cost" />
			<Column
				:style="{ maxWidth: '92px', width: '92px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'treatments-edit', params: { id: columnProps.data.id } }"
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
import { useTreatmentListState } from '@/models/Treatment/States'
import { format } from 'date-fns'

const router = useRouter()
const listState = useTreatmentListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
