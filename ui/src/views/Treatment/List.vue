<template>
	<Header
		:list-state="listState"
		search
		title="Treatments" />
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
				:style="{ maxWidth: '112px', width: '112px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'treatments-edit', params: { id: columnProps.data.id } }"
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
import { useTreatmentListState } from '@/models/Treatment/States'
import { format } from 'date-fns'

const listState = useTreatmentListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
