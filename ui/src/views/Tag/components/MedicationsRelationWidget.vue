<template>
	<Card class="medications-relation-widget">
		<template #title>
			<h4 class="medications-relation-widget__title">Medications</h4>
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
					field="name"
					header="Name" />
				<Column
					header=""
					:style="{ maxWidth: '92px', width: '92px' }">
					<template #body="{ data }">
						<ApiTableLinkButton
							:to="{ name: 'medications-edit', params: { id: data.id } }"
							icon="fal fa-arrow-up-right-from-square" />
						<Button
							class="medications-relation-widget__table-button"
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
	<MedicationsRelationAddDialog
		v-model="isRelationAddDialogActive"
		:tag-id="props.tagId"
		@update="refresh()" />
	<MedicationForm
		:as-dialog="true"
		:visible="isFormActive"
		:should-redirect="false"
		:attach-to="{ tags: { method: 'syncWithoutDetaching', id: props.tagId } }"
		@close="isFormActive = false"
		@created="refresh()" />
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from 'vue'
import MedicationsRelationAddDialog from './MedicationsRelationAddDialog.vue'
import MedicationForm from '@/views/Medication/components/Form.vue'
import Card from 'primevue/card'
import useApiTable from '@/components/Table/useApiTable'
import Button from 'primevue/button'
import { useMedicationListState } from '@/models/Medication/States'
import type { Medication } from '@/models/Medication/Model'
import type { Tag } from '@/models/Tag/Model'
import TagsApi from '@/models/Tag/Api'

const props = defineProps<{
	tagId: Tag['id']
}>()

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
}>()

const listState = useMedicationListState()
listState.defaultParams = {
	per_page: 10,
	fromRelation: {
		model: 'App\\Models\\Tag',
		id: props.tagId,
		relation: 'medications',
	},
}
const { ApiTable, Column, ApiTableLinkButton } = useApiTable(listState)

const isRelationAddDialogActive = ref(false)
const isFormActive = ref(false)
const detachLoading = ref(null as null | number | string)
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

async function detach(item: Medication) {
	detachLoading.value = item.id
	emit('start-loading')
	try {
		await new TagsApi().updateRelation(props.tagId, 'medications', {
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
.medications-relation-widget {
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

				.medications-relation-widget__title {
					flex: 1;
					text-align: left;
				}
			}
		}
	}

	.medications-relation-widget__table-button {
		width: 30px;
		height: 30px;
	}
}
</style>
