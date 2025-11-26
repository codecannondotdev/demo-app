<template>
	<Card class="treatments-relation-widget">
		<template #title>
			<h4 class="treatments-relation-widget__title">Treatments</h4>
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
				<Column
					field="description"
					header="Description" />
				<Column
					header=""
					:style="{ maxWidth: '92px', width: '92px' }">
					<template #body="{ data }">
						<ApiTableLinkButton
							:to="{ name: 'treatments-edit', params: { id: data.id } }"
							icon="fal fa-arrow-up-right-from-square" />
						<Button
							class="treatments-relation-widget__table-button"
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
	<TreatmentsRelationAddDialog
		v-model="isRelationAddDialogActive"
		:patient-id="props.patientId"
		@update="refresh()" />
	<TreatmentForm
		:as-dialog="true"
		:visible="isFormActive"
		:should-redirect="false"
		:force-values="{ patient_id: props.patientId }"
		:hide-inputs="['patient_id']"
		@submit="isFormActive = false"
		@close="isFormActive = false"
		@created="refresh()" />
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import TreatmentsRelationAddDialog from './TreatmentsRelationAddDialog.vue'
import TreatmentForm from '@/views/Treatment/components/Form.vue'
import Card from 'primevue/card'
import useApiTable from '@/components/Table/useApiTable'
import Button from 'primevue/button'
import { useTreatmentListState } from '@/models/Treatment/States'
import type { Treatment } from '@/models/Treatment/Model'
import type { Patient } from '@/models/Patient/Model'
import PatientsApi from '@/models/Patient/Api'

const props = defineProps<{
	patientId: Patient['id']
}>()

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
}>()

const listState = useTreatmentListState()
listState.defaultParams = {
	per_page: 10,
	fromRelation: {
		model: 'App\\Models\\Patient',
		id: props.patientId,
		relation: 'treatments',
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

async function dissociate(item: Treatment) {
	dissociateLoading.value = item.id
	emit('start-loading')
	try {
		await new PatientsApi().updateRelation(props.patientId, 'treatments', {
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
.treatments-relation-widget {
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

				.treatments-relation-widget__title {
					flex: 1;
					text-align: left;
				}
			}
		}
	}

	.treatments-relation-widget__table-button {
		width: 30px;
		height: 30px;
	}
}
</style>
