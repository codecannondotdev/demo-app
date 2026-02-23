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
							:loading="detachLoading === data.id"
							@click.stop.prevent="detach(data)" />
					</template>
				</Column>
			</ApiTable>
		</template>
	</Card>
	<TreatmentsRelationAddDialog
		v-model="isRelationAddDialogActive"
		:medication-id="props.medicationId"
		@update="refresh()" />
	<TreatmentForm
		:as-dialog="true"
		:visible="isFormActive"
		:should-redirect="false"
		:attach-to="{ medications: { method: 'syncWithoutDetaching', id: props.medicationId } }"
		@submit="isFormActive = false"
		@close="isFormActive = false"
		@created="refresh()" />
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import useApiTable from '@/components/Table/useApiTable'
import { onBeforeMount, ref } from 'vue'
import TreatmentsRelationAddDialog from './TreatmentsRelationAddDialog.vue'
import TreatmentForm from '@/views/Treatment/components/Form.vue'
import { useTreatmentListState } from '@/models/Treatment/States'
import MedicationsApi from '@/models/Medication/Api'
import type { Medication } from '@/models/Medication/Model'
import type { Treatment } from '@/models/Treatment/Model'

const props = defineProps<{
	medicationId: Medication['id']
}>()

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
}>()

const listState = useTreatmentListState()
listState.defaultParams = {
	per_page: 10,
	fromRelation: {
		model: 'App\\Models\\Medication',
		id: props.medicationId,
		relation: 'treatments',
	},
}
const { ApiTable, Column, ApiTableLinkButton } = useApiTable(listState)

const isRelationAddDialogActive = ref(false)
const isFormActive = ref(false)
const detachLoading = ref(null as null | number | string)

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

async function detach(item: Treatment) {
	detachLoading.value = item.id
	emit('start-loading')
	try {
		await new MedicationsApi().updateRelation(props.medicationId, 'treatments', {
			method: 'detach',
			params: [item.id],
		})
		detachLoading.value = null
		await refresh()
	} finally {
		detachLoading.value = null
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
