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
				:list-state="listState"
				@row-click="openDetails">
				<Column header="Billing Date">
					<template #body="slotProps">
						{{ format(new Date(slotProps.data.billing_date), 'yyyy-MM-dd') }}
					</template>
				</Column>
				<Column
					header=""
					:style="{ maxWidth: '72px', width: '72px' }">
					<template #body="slotProps">
						<Button
							severity="secondary"
							outlined
							rounded
							icon="fal fa-times"
							:loading="dissociateLoading === slotProps.data.id"
							@click.stop.prevent="dissociate(slotProps.data)" />
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
		:force-values="{ appointment_id: Number(props.appointmentId) }"
		:hide-inputs="['appointment_id']"
		@close="isFormActive = false"
		@created="refresh()" />
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from 'vue'
import BillingRelationAddDialog from './BillingRelationAddDialog.vue'
import BillingForm from '@/views/Billing/components/Form.vue'
import Card from 'primevue/card'
import ApiTable from '@/components/Table/ApiTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import { useBillingListState } from '@/models/Billing/States'
import type { Billing } from '@/models/Billing/Model'
import type { Appointment } from '@/models/Appointment/Model'
import AppointmentsApi from '@/models/Appointment/Api'
import { format } from 'date-fns'

const emit = defineEmits(['start-loading', 'stop-loading'])

const props = defineProps<{
	appointmentId: Appointment['id']
}>()

const router = useRouter()
const isRelationAddDialogActive = ref(false)
const isFormActive = ref(false)
const dissociateLoading = ref(null as null | number | string)
const listLoading = ref(false)
const listState = useBillingListState()
listState.defaultParams = {
	per_page: 10,
	fromRelation: {
		model: 'App\\Models\\Appointment',
		id: props.appointmentId,
		relation: 'billing',
	},
}

onBeforeMount(() => {
	refresh()
})

async function refresh() {
	listLoading.value = true
	emit('start-loading')
	try {
		await listState.getList()
	} finally {
		listLoading.value = false
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

function openDetails(item: { data: Billing }) {
	router.push({ name: 'billings-edit', params: { id: item.data.id } })
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
}
</style>
