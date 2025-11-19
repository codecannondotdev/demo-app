<template>
	<Header title="Billings">
		<Button
			icon="fal fa-plus"
			label="Create"
			@click="router.push({ name: 'billings-create' })" />
	</Header>
	<Container>
		<ListSearch
			:list-state="listState"
			placeholder="Search Billings" />
	</Container>
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
				:style="{ maxWidth: '92px', width: '92px' }"
				header="">
				<template #body="columnProps">
					<ApiTableLinkButton
						:to="{ name: 'billings-edit', params: { id: columnProps.data.id } }"
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
import { useBillingListState } from '@/models/Billing/States'
import { format } from 'date-fns'

const router = useRouter()
const listState = useBillingListState()
const { ApiTable, Column, ApiTableLinkButton, ApiTableRemoveButton } = useApiTable(listState)

onBeforeMount(() => {
	listState.getList()
})
</script>
