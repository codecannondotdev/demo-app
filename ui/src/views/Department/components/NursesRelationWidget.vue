<template>
	<Card class="nurses-relation-widget">
		<template #title>
			<h4 class="nurses-relation-widget__title">Nurses</h4>
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
					field="first_name"
					header="First Name" />
				<Column
					header=""
					:style="{ maxWidth: '92px', width: '92px' }">
					<template #body="{ data }">
						<ApiTableLinkButton
							:to="{ name: 'nurses-edit', params: { id: data.id } }"
							icon="fal fa-arrow-up-right-from-square" />
						<Button
							class="nurses-relation-widget__table-button"
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
	<NursesRelationAddDialog
		v-model="isRelationAddDialogActive"
		:department-id="props.departmentId"
		@update="refresh()" />
	<NurseForm
		:as-dialog="true"
		:visible="isFormActive"
		:should-redirect="false"
		:force-values="{ department_id: props.departmentId }"
		:hide-inputs="['department_id']"
		@submit="isFormActive = false"
		@close="isFormActive = false"
		@created="refresh()" />
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import useApiTable from '@/components/Table/useApiTable'
import { onBeforeMount, ref } from 'vue'
import NursesRelationAddDialog from './NursesRelationAddDialog.vue'
import NurseForm from '@/views/Nurse/components/Form.vue'
import { useNurseListState } from '@/models/Nurse/States'
import DepartmentsApi from '@/models/Department/Api'
import type { Department } from '@/models/Department/Model'
import type { Nurse } from '@/models/Nurse/Model'

const props = defineProps<{
	departmentId: Department['id']
}>()

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
}>()

const listState = useNurseListState()
listState.defaultParams = {
	per_page: 10,
	fromRelation: {
		model: 'App\\Models\\Department',
		id: props.departmentId,
		relation: 'nurses',
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

async function dissociate(item: Nurse) {
	dissociateLoading.value = item.id
	emit('start-loading')
	try {
		await new DepartmentsApi().updateRelation(props.departmentId, 'nurses', {
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
.nurses-relation-widget {
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

				.nurses-relation-widget__title {
					flex: 1;
					text-align: left;
				}
			}
		}
	}

	.nurses-relation-widget__table-button {
		width: 30px;
		height: 30px;
	}
}
</style>
