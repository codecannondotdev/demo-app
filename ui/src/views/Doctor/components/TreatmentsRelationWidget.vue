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
		:doctor-id="props.doctorId"
		@update="refresh()" />
	<TreatmentForm
		:as-dialog="true"
		:visible="isFormActive"
		:should-redirect="false"
		:force-values="{ doctor_id: props.doctorId }"
		:hide-inputs="['doctor_id']"
		@close="isFormActive = false"
		@created="refresh()" />
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from 'vue'
import TreatmentsRelationAddDialog from './TreatmentsRelationAddDialog.vue'
import TreatmentForm from '@/views/Treatment/components/Form.vue'
import Card from 'primevue/card'
import useApiTable from '@/components/Table/useApiTable'
import Button from 'primevue/button'
import { useTreatmentListState } from '@/models/Treatment/States'
import type { Treatment } from '@/models/Treatment/Model'
import type { Doctor } from '@/models/Doctor/Model'
import DoctorsApi from '@/models/Doctor/Api'

const props = defineProps<{
	doctorId: Doctor['id']
}>()

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
}>()

const listState = useTreatmentListState()
listState.defaultParams = {
	per_page: 10,
	fromRelation: {
		model: 'App\\Models\\Doctor',
		id: props.doctorId,
		relation: 'treatments',
	},
}
const { ApiTable, Column, ApiTableLinkButton } = useApiTable(listState)

const isRelationAddDialogActive = ref(false)
const isFormActive = ref(false)
const dissociateLoading = ref(null as null | number | string)
const listLoading = ref(false)

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

async function dissociate(item: Treatment) {
	dissociateLoading.value = item.id
	emit('start-loading')
	try {
		await new DoctorsApi().updateRelation(props.doctorId, 'treatments', {
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
