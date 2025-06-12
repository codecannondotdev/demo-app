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
				:list-state="listState"
				@row-click="openDetails">
				<Column
					field="description"
					header="Description" />
				<Column
					header=""
					:style="{ maxWidth: '72px', width: '72px' }">
					<template #body="slotProps">
						<Button
							severity="secondary"
							outlined
							rounded
							icon="fal fa-times"
							:loading="detachLoading === slotProps.data.id"
							@click.stop.prevent="detach(slotProps.data)" />
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
		@close="isFormActive = false"
		@created="refresh()" />
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from 'vue'
import TreatmentsRelationAddDialog from './TreatmentsRelationAddDialog.vue'
import TreatmentForm from '@/views/Treatment/components/Form.vue'
import Card from 'primevue/card'
import ApiTable from '@/components/Table/ApiTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import { useTreatmentListState } from '@/models/Treatment/States'
import type { Treatment } from '@/models/Treatment/Model'
import type { Medication } from '@/models/Medication/Model'
import MedicationsApi from '@/models/Medication/Api'

const emit = defineEmits(['start-loading', 'stop-loading'])

const props = defineProps<{
	medicationId: Medication['id']
}>()

const router = useRouter()
const isRelationAddDialogActive = ref(false)
const isFormActive = ref(false)
const detachLoading = ref(null as null | number | string)
const listLoading = ref(false)
const listState = useTreatmentListState()
listState.defaultParams = {
	per_page: 10,
	fromRelation: {
		model: 'App\\Models\\Medication',
		id: props.medicationId,
		relation: 'treatments',
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

function openDetails(item: { data: Treatment }) {
	router.push({ name: 'treatments-edit', params: { id: item.data.id } })
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
}
</style>
