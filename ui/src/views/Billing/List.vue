<template>
	<Header
		:list-state="listState"
		search
		title="Billings" />
	<Container>
		<ApiTable
			:list-state="listState"
			@row-click="openDetails">
			<Column header="Billing Date">
				<template #body="slotProps">
					{{ format(new Date(slotProps.data.billing_date), 'yyyy-MM-dd') }}
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
				:style="{ maxWidth: '72px', width: '72px' }"
				header="">
				<template #body="slotProps">
					<ApiTableRemoveButton :item="slotProps.data" />
				</template>
			</Column>
		</ApiTable>
	</Container>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import ApiTable from '@/components/Table/ApiTable.vue'
import Column from 'primevue/column'
import Container from '@/components/Container.vue'
import type { Billing } from '@/models/Billing/Model'
import { useBillingListState } from '@/models/Billing/States'
import ApiTableRemoveButton from '@/components/Table/ApiTableRemoveButton.vue'
import { format } from 'date-fns'

const listState = useBillingListState()
const router = useRouter()

onBeforeMount(() => {
	listState.getList()
})

function openDetails(item: { data: Billing }) {
	router.push({ name: 'billings-edit', params: { id: item.data.id } })
}
</script>
