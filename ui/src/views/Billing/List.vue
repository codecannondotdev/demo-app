<template>
	<Header
		:list-state="listState"
		search
		title="Billings" />
	<Container>
		<ApiTable :list-state="listState">
			<Column header="Billing Date">
				<template #body="slotProps">
					{{
						slotProps.data.billing_date
							? format(new Date(slotProps.data.billing_date), 'yyyy-MM-dd')
							: ''
					}}
				</template>
			</Column>
			<Column
				field="amount"
				header="Amount" />
			<Column
				field="status"
				header="Status" />
			<Column
				field="payment_method"
				header="Payment Method" />
			<Column
				:style="{ maxWidth: '112px', width: '112px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'billings-edit', params: { id: columnProps.data.id } }"
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
import { useBillingListState } from '@/models/Billing/States'
import { format } from 'date-fns'

const listState = useBillingListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
