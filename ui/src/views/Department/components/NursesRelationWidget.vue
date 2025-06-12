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
				:list-state="listState"
				@row-click="openDetails">
				<Column
					field="first_name"
					header="First Name" />
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
	<NursesRelationAddDialog
		v-model="isRelationAddDialogActive"
		:department-id="props.departmentId"
		@update="refresh()" />
	<NurseForm
		:as-dialog="true"
		:visible="isFormActive"
		:should-redirect="false"
		:force-values="{ department_id: Number(props.departmentId) }"
		:hide-inputs="['department_id']"
		@close="isFormActive = false"
		@created="refresh()" />
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from 'vue'
import NursesRelationAddDialog from './NursesRelationAddDialog.vue'
import NurseForm from '@/views/Nurse/components/Form.vue'
import Card from 'primevue/card'
import ApiTable from '@/components/Table/ApiTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import { useNurseListState } from '@/models/Nurse/States'
import type { Nurse } from '@/models/Nurse/Model'
import type { Department } from '@/models/Department/Model'
import DepartmentsApi from '@/models/Department/Api'

const emit = defineEmits(['start-loading', 'stop-loading'])

const props = defineProps<{
	departmentId: Department['id']
}>()

const router = useRouter()
const isRelationAddDialogActive = ref(false)
const isFormActive = ref(false)
const dissociateLoading = ref(null as null | number | string)
const listLoading = ref(false)
const listState = useNurseListState()
listState.defaultParams = {
	per_page: 10,
	fromRelation: {
		model: 'App\\Models\\Department',
		id: props.departmentId,
		relation: 'nurses',
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

function openDetails(item: { data: Nurse }) {
	router.push({ name: 'nurses-edit', params: { id: item.data.id } })
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
}
</style>
