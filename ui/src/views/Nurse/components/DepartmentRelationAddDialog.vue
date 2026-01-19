<template>
	<Drawer
		v-model:visible="isActive"
		position="right"
		class="nurse-department-add-dialog"
		header="Select Department">
		<div class="nurse-department-add-dialog__header">
			<div class="nurse-department-add-dialog__search-container">
				<IconField class="nurse-department-add-dialog__search-iconfield">
					<InputIcon class="fal fa-search" />
					<InputText
						v-model="searchString"
						class="nurse-department-add-dialog__search-input"
						placeholder="Search"
						@update:model-value="listState.getList({ search: searchString })"
						@keyup.enter="listState.getList({ search: searchString })"></InputText>
				</IconField>
			</div>
		</div>
		<div class="nurse-department-add-dialog__table-container">
			<ApiTable
				v-model:selection="selected"
				selection-mode="single"
				flat
				:list-state="listState">
				<Column
					selection-mode="single"
					header-style="width: 3rem"></Column>
				<Column
					field="name"
					header="Name" />
			</ApiTable>
		</div>
		<div class="nurse-department-add-dialog__add-buttton-container">
			<Button
				icon="fal fa-plus"
				label="Create Department"
				severity="secondary"
				outlined
				@click="isFormActive = true" />
			<Button
				class="nurse-department-add-dialog__add-button"
				:disabled="!selected"
				:loading="isLoading"
				:label="`Select Department`"
				icon="fal fa-check"
				@click="submit" />
		</div>
		<DepartmentForm
			:as-dialog="true"
			:visible="isFormActive"
			:should-redirect="false"
			@close="isFormActive = false"
			@created="handleFormCreated" />
	</Drawer>
</template>

<script setup lang="ts">
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputIcon from 'primevue/inputicon'
import IconField from 'primevue/iconfield'
import useApiTable from '@/components/Table/useApiTable'
import { ref, watch } from 'vue'
import DepartmentForm from '@/views/Department/components/Form.vue'
import { useDepartmentListState } from '@/models/Department/States'
import type { Department } from '@/models/Department/Model'

const props = defineProps<{
	departmentId?: Department['id'] | null
}>()

const emit = defineEmits<{
	(e: 'update', department: Department): void
}>()

const listState = useDepartmentListState()
const { ApiTable, Column } = useApiTable(listState)

const isActive = defineModel<boolean>()
const isFormActive = ref(false)
const selected = ref<Department | null>()
const isLoading = ref(false)
const searchString = ref('')

watch(
	isActive,
	async () => {
		if (!isActive.value) {
			searchString.value = ''
			selected.value = null
			listState.clearList()
		} else {
			await listState.getList()
			if (!props.departmentId) return
			selected.value = listState.list.value.find(
				(department) => department.id === props.departmentId,
			)
		}
	},
	{ immediate: true },
)

async function submit() {
	if (!selected.value) {
		return
	}
	emit('update', selected.value)
	isActive.value = false
}

function handleFormCreated(department?: Department) {
	if (!department) return
	emit('update', department)
	isActive.value = false
}
</script>

<style lang="scss">
.nurse-department-add-dialog {
	width: 800px !important;

	.p-drawer-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0;
	}

	.nurse-department-add-dialog__header {
		padding: 10px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;

		.nurse-department-add-dialog__search-container {
			flex: 1;
			width: 100%;
			display: flex;
			gap: 8px;

			.nurse-department-add-dialog__search-iconfield {
				flex: 1;

				.nurse-department-add-dialog__search-input {
					width: 100%;
				}
			}
		}
	}

	.nurse-department-add-dialog__table-container {
		border-top: 1px solid var(--p-datatable-body-cell-border-color);
		flex: 1;
		overflow: auto;
		display: flex;

		.ui-api-table__table {
			flex: 1;
		}
	}

	.nurse-department-add-dialog__add-buttton-container {
		padding: 20px;
		display: flex;
		justify-content: flex-end;
		border-top: 1px solid var(--p-datatable-body-cell-border-color);
		gap: 8px;
	}
}
</style>
