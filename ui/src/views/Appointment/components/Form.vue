<template>
	<FormContainer
		class="form"
		:visible
		:title="isEdit ? 'Update Appointment' : 'Create Appointment'"
		:as-dialog
		@close="emit('close')">
		<form @submit.prevent="submit">
			<FormInput
				v-if="!props.hideInputs?.includes('appointment_date')"
				:required="true"
				:error-message="formErrors.appointment_date"
				label="Appointment Date">
				<DatePicker
					:model-value="formData.appointment_date ? new Date(formData.appointment_date) : null"
					:disabled="!!props.forceValues.appointment_date"
					selection-mode="single"
					@update:model-value="formData.appointment_date = ($event as Date).toISOString()" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('appointment_time')"
				:required="true"
				:error-message="formErrors.appointment_time"
				label="Appointment Time">
				<DatePicker
					:model-value="formData.appointment_time ? new Date(formData.appointment_time) : null"
					:disabled="!!props.forceValues.appointment_time"
					:time-only="true"
					selection-mode="single"
					@update:model-value="formData.appointment_time = ($event as Date).toISOString()" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('reason_for_visit')"
				:required="true"
				:error-message="formErrors.reason_for_visit"
				label="Reason For Visit">
				<Textarea
					v-model="formData.reason_for_visit"
					:disabled="!!props.forceValues.reason_for_visit"
					rows="5"
					cols="50" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('status')"
				:required="true"
				:error-message="formErrors.status"
				label="Status">
				<Select
					v-model="formData.status"
					:options="Object.entries(Status).map(([value, title]) => ({ title, value }))"
					:show-clear="false"
					:disabled="!!props.forceValues.status"
					option-label="title"
					option-value="value" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('patient_id')"
				:required="false"
				:error-message="formErrors.patient_id"
				label="Patient">
				<PatientRelationInput
					v-model="formData.patient_id"
					:disabled="!!props.forceValues.patient_id" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('doctor_id')"
				:required="false"
				:error-message="formErrors.doctor_id"
				label="Doctor">
				<DoctorRelationInput
					v-model="formData.doctor_id"
					:disabled="!!props.forceValues.doctor_id" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('nurse_id')"
				:required="false"
				:error-message="formErrors.nurse_id"
				label="Nurse">
				<NurseRelationInput
					v-model="formData.nurse_id"
					:disabled="!!props.forceValues.nurse_id" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('department_id')"
				:required="false"
				:error-message="formErrors.department_id"
				label="Department">
				<DepartmentRelationInput
					v-model="formData.department_id"
					:disabled="!!props.forceValues.department_id" />
			</FormInput>
			<div class="form__footer-container">
				<Button
					v-if="isEdit && !props.hideRemove"
					severity="danger"
					icon="fal fa-trash"
					label="Remove"
					outlined
					:loading="loading"
					@click="remove" />
				<Button
					icon="fal fa-save"
					:loading="loading"
					:label="isEdit ? 'Update' : 'Create'"
					type="submit"
					@submit="submit" />
			</div>
		</form>
	</FormContainer>
</template>

<script setup lang="ts">
import { toRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppointmentsApi from '@/models/Appointment/Api'
import type { Appointment } from '@/models/Appointment/Model'
import { useForm } from '@/helpers/form'
import FormInput from '@/components/FormInput.vue'
import Button from 'primevue/button'
import FormContainer from '@/components/FormContainer.vue'
import DatePicker from 'primevue/datepicker'
import DepartmentRelationInput from './DepartmentRelationInput.vue'
import DoctorRelationInput from './DoctorRelationInput.vue'
import NurseRelationInput from './NurseRelationInput.vue'
import PatientRelationInput from './PatientRelationInput.vue'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import type { Department } from '@/models/Department/Model'
import type { Doctor } from '@/models/Doctor/Model'
import type { Nurse } from '@/models/Nurse/Model'
import type { Patient } from '@/models/Patient/Model'
import { Status } from '@/models/Appointment/Enums'

type FormData = {
	appointment_date: string
	appointment_time: string
	reason_for_visit: string
	status: Appointment['status']
	patient_id: Patient['id'] | null
	doctor_id: Doctor['id'] | null
	nurse_id: Nurse['id'] | null
	department_id: Department['id'] | null
}

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'close'): void
	(e: 'submit'): void
	(e: 'created', entity: Appointment | undefined): void
	(e: 'updated'): void
	(e: 'deleted'): void
}>()

const props = withDefaults(
	defineProps<{
		id?: Appointment['id']
		hideInputs?: (keyof FormData)[]
		defaultValues?: Partial<FormData>
		forceValues?: Partial<FormData>
		shouldRedirect?: boolean
		attachTo?: Record<string, { method: 'associate' | 'syncWithoutDetaching'; id: string | number }>
		asDialog?: boolean
		visible?: boolean
		hideRemove?: boolean
	}>(),
	{
		id: undefined,
		hideInputs: () => [],
		defaultValues: () => ({}),
		forceValues: () => ({}),
		shouldRedirect: true,
		attachTo: undefined,
		asDialog: false,
		visible: false,
		hideRemove: false,
	},
)

const router = useRouter()
const { formData, loading, formErrors, reset, submit, remove, isEdit } = useForm({
	api: () => new AppointmentsApi(),
	defaultData: () =>
		({
			appointment_date: '',
			appointment_time: '',
			reason_for_visit: '',
			status: Object.values(Status)[0] as Appointment['status'],
			patient_id: null,
			doctor_id: null,
			nurse_id: null,
			department_id: null,
		}) satisfies FormData as FormData,
	forceValues: () => props.forceValues,
	attachTo: () => props.attachTo,
	id: toRef(props, 'id'),
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onSubmit: () => emit('submit'),
	onCreated: (entity) => {
		if (props.shouldRedirect) {
			router.replace({ name: 'appointments-edit', params: { id: entity!.id } })
		}
		emit('created', entity)
	},
	onUpdated: () => emit('updated'),
	onDeleted: () => emit('deleted'),
})

watch(() => props.visible, reset)
</script>

<style lang="scss">
.form {
	form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;

		& > * {
			width: 100%;
		}

		.form__footer-container {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			gap: 10px;
		}

		&--edit {
			.form__footer-container {
				justify-content: space-between;
			}
		}
	}
}
</style>
