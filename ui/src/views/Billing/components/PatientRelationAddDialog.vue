<template>
	<Drawer
		v-model:visible="isActive"
		position="right"
		class="billing-patient-add-dialog"
		header="Select Patient">
		<div class="billing-patient-add-dialog__header">
			<div class="billing-patient-add-dialog__search-container">
				<IconField class="billing-patient-add-dialog__search-iconfield">
					<InputIcon class="fal fa-search" />
					<InputText
						v-model="searchString"
						class="billing-patient-add-dialog__search-input"
						placeholder="Search"
						@update:model-value="listState.getList({ search: searchString })"
						@keyup.enter="listState.getList({ search: searchString })"></InputText>
				</IconField>
			</div>
		</div>
		<div class="billing-patient-add-dialog__table-container">
			<ApiTable
				v-model:selection="selected"
				selection-mode="single"
				flat
				:list-state="listState">
				<Column
					selection-mode="single"
					header-style="width: 3rem"></Column>
				<Column
					field="first_name"
					header="First Name" />
			</ApiTable>
		</div>
		<div class="billing-patient-add-dialog__add-buttton-container">
			<Button
				icon="fal fa-plus"
				label="Create Patient"
				severity="secondary"
				outlined
				@click="isFormActive = true" />
			<Button
				class="billing-patient-add-dialog__add-button"
				:disabled="!selected"
				:loading="isLoading"
				:label="`Select Patient`"
				icon="fal fa-check"
				@click="submit" />
		</div>
		<PatientForm
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
import PatientForm from '@/views/Patient/components/Form.vue'
import { usePatientListState } from '@/models/Patient/States'
import type { Patient } from '@/models/Patient/Model'

const props = defineProps<{
	patientId?: Patient['id'] | null
}>()

const emit = defineEmits<{
	(e: 'update', patient: Patient): void
}>()

const listState = usePatientListState()
const { ApiTable, Column } = useApiTable(listState)

const isActive = defineModel<boolean>()
const isFormActive = ref(false)
const selected = ref<Patient | null>()
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
			if (!props.patientId) return
			selected.value = listState.list.value.find((patient) => patient.id === props.patientId)
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

function handleFormCreated(patient?: Patient) {
	if (!patient) return
	emit('update', patient)
	isActive.value = false
}
</script>

<style lang="scss">
.billing-patient-add-dialog {
	width: 800px !important;

	.p-drawer-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0;
	}

	.billing-patient-add-dialog__header {
		padding: 10px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;

		.billing-patient-add-dialog__search-container {
			flex: 1;
			width: 100%;
			display: flex;
			gap: 8px;

			.billing-patient-add-dialog__search-iconfield {
				flex: 1;

				.billing-patient-add-dialog__search-input {
					width: 100%;
				}
			}
		}
	}

	.billing-patient-add-dialog__table-container {
		border-top: 1px solid var(--p-datatable-body-cell-border-color);
		flex: 1;
		overflow: auto;
		display: flex;

		.ui-api-table__table {
			flex: 1;
		}
	}

	.billing-patient-add-dialog__add-buttton-container {
		padding: 20px;
		display: flex;
		justify-content: flex-end;
		border-top: 1px solid var(--p-datatable-body-cell-border-color);
		gap: 8px;
	}
}
</style>
