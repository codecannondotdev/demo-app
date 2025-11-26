<template>
	<Card class="billing-relation-widget">
		<template #title>
			<h4 class="billing-relation-widget__title">Billing</h4>
			<Button
				icon="fal fa-link"
				label="Connect"
				outlined
				severity="secondary"
				@click="isRelationAddDialogActive = true" />
			<Button
				icon="fal fa-plus"
				label="Create"
				outlined
				severity="secondary"
				@click="isFormActive = true" />
		</template>
		<template #content>
			<ApiTable
				flat
				:list-state="listState">
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
					header=""
					:style="{ maxWidth: '92px', width: '92px' }">
					<template #body="{ data }">
						<ApiTableLinkButton
							:to="{ name: 'billings-edit', params: { id: data.id } }"
							icon="fal fa-arrow-up-right-from-square" />
						<Button
							class="billing-relation-widget__table-button"
							icon="fal fa-xmark"
							severity="secondary"
							text
							rounded
							:loading="dissociateLoading === data.id"
							@click.stop.prevent="dissociate(data)" />
					</template>
				</Column>
			</ApiTable>
		</template>
	</Card>
	<BillingRelationAddDialog
		v-model="isRelationAddDialogActive"
		:appointment-id="props.appointmentId"
		@update="refresh()" />
	<BillingForm
		:as-dialog="true"
		:visible="isFormActive"
		:should-redirect="false"
		:force-values="{ appointment_id: props.appointmentId }"
		:hide-inputs="['appointment_id']"
		@submit="isFormActive = false"
		@close="isFormActive = false"
		@created="refresh()" />
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import BillingRelationAddDialog from './BillingRelationAddDialog.vue'
import BillingForm from '@/views/Billing/components/Form.vue'
import Card from 'primevue/card'
import useApiTable from '@/components/Table/useApiTable'
import Button from 'primevue/button'
import { useBillingListState } from '@/models/Billing/States'
import type { Billing } from '@/models/Billing/Model'
import type { Appointment } from '@/models/Appointment/Model'
import AppointmentsApi from '@/models/Appointment/Api'
import { format } from 'date-fns'

const props = defineProps<{
	appointmentId: Appointment['id']
}>()

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
}>()

const listState = useBillingListState()
listState.defaultParams = {
	per_page: 10,
	fromRelation: {
		model: 'App\\Models\\Appointment',
		id: props.appointmentId,
		relation: 'billing',
	},
}
const { ApiTable, Column, ApiTableLinkButton } = useApiTable(listState)

const isRelationAddDialogActive = ref(false)
const isFormActive = ref(false)
const dissociateLoading = ref(null as null | number | string)

onBeforeMount(() => {
	refresh()
})

async function refresh() {
	emit('start-loading')
	try {
		await listState.getList()
	} finally {
		emit('stop-loading')
	}
}

async function dissociate(item: Billing) {
	dissociateLoading.value = item.id
	emit('start-loading')
	try {
		await new AppointmentsApi().updateRelation(props.appointmentId, 'billing', {
			method: 'dissociate',
			params: [item.id],
		})
		dissociateLoading.value = null
		await refresh()
	} finally {
		dissociateLoading.value = null
		emit('stop-loading')
	}
}
</script>

<style lang="scss" scoped>
.billing-relation-widget {
	width: 100%;
	max-width: 600px;
	overflow: hidden;

	:deep(.p-card-body) {
		padding: 20px 0 0;

		.p-card-caption {
			padding: 0px 20px 12px;

			.p-card-title {
				display: flex;
				align-items: center;
				gap: 10px;

				.billing-relation-widget__title {
					flex: 1;
					text-align: left;
				}
			}
		}
	}

	.billing-relation-widget__table-button {
		width: 30px;
		height: 30px;
	}
}
</style>
