<template>
	<Drawer
		v-model:visible="isActive"
		position="right"
		class="treatment-doctor-add-dialog"
		header="Select Doctor">
		<div class="treatment-doctor-add-dialog__header">
			<div class="treatment-doctor-add-dialog__search-container">
				<IconField class="treatment-doctor-add-dialog__search-iconfield">
					<InputIcon class="fal fa-search" />
					<InputText
						v-model="searchString"
						class="treatment-doctor-add-dialog__search-input"
						placeholder="Search"
						@update:model-value="listState.getList({ search: searchString })"
						@keyup.enter="listState.getList({ search: searchString })"></InputText>
				</IconField>
			</div>
		</div>
		<div class="treatment-doctor-add-dialog__table-container">
			<ApiTable
				v-model:selection="selected"
				selection-mode="single"
				flat
				:list-state="listState">
				<Column
					selection-mode="single"
					header-style="width: 3rem"></Column>
				<Column
					field="last_name"
					header="Last Name" />
			</ApiTable>
		</div>
		<div class="treatment-doctor-add-dialog__add-buttton-container">
			<Button
				icon="fal fa-plus"
				label="Create Doctor"
				severity="secondary"
				outlined
				@click="isFormActive = true" />
			<Button
				class="treatment-doctor-add-dialog__add-button"
				:disabled="!selected"
				:loading="isLoading"
				:label="`Select Doctor`"
				icon="fal fa-check"
				@click="submit" />
		</div>
		<DoctorForm
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
import useApiTable from '@/components/Table/useApiTable'
import DoctorForm from '@/views/Doctor/components/Form.vue'
import InputText from 'primevue/inputtext'
import InputIcon from 'primevue/inputicon'
import IconField from 'primevue/iconfield'
import { defineModel, ref, watch } from 'vue'
import type { Doctor } from '@/models/Doctor/Model'
import { useDoctorListState } from '@/models/Doctor/States'

const props = defineProps<{
	doctorId?: Doctor['id'] | null
}>()

const emit = defineEmits<{
	(e: 'update', doctor: Doctor): void
}>()

const listState = useDoctorListState()
const { ApiTable, Column } = useApiTable(listState)

const isActive = defineModel<boolean>()
const isFormActive = ref(false)
const selected = ref<Doctor | null>()
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
			if (!props.doctorId) return
			selected.value = listState.list.value.find((doctor) => doctor.id === props.doctorId)
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

function handleFormCreated(doctor?: Doctor) {
	if (!doctor) return
	emit('update', doctor)
	isActive.value = false
}
</script>

<style lang="scss">
.treatment-doctor-add-dialog {
	width: 800px !important;

	.p-drawer-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0;
	}

	.treatment-doctor-add-dialog__header {
		padding: 10px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;

		.treatment-doctor-add-dialog__search-container {
			flex: 1;
			width: 100%;
			display: flex;
			gap: 8px;

			.treatment-doctor-add-dialog__search-iconfield {
				flex: 1;

				.treatment-doctor-add-dialog__search-input {
					width: 100%;
				}
			}
		}
	}

	.treatment-doctor-add-dialog__table-container {
		border-top: 1px solid var(--p-datatable-body-cell-border-color);
		flex: 1;
		overflow: auto;
		display: flex;

		.ui-api-table__table {
			flex: 1;
		}
	}

	.treatment-doctor-add-dialog__add-buttton-container {
		padding: 20px;
		display: flex;
		justify-content: flex-end;
		border-top: 1px solid var(--p-datatable-body-cell-border-color);
		gap: 8px;
	}
}
</style>
