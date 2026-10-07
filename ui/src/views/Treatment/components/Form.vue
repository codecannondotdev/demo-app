<template>
	<FormContainer
		class="form"
		:as-dialog
		:title="isEdit ? 'Update Treatment' : 'Create Treatment'"
		:visible
		@close="emit('close')">
		<form @submit.prevent="submit">
			<FormInput
				v-if="!props.hideInputs?.includes('treatment_date')"
				label="Treatment Date"
				:error-message="formErrors.treatment_date"
				:required="true">
				<DatePicker
					selection-mode="single"
					:disabled="!!props.forceValues.treatment_date"
					:model-value="formData.treatment_date ? new Date(formData.treatment_date) : null"
					@update:model-value="formData.treatment_date = ($event as Date).toISOString()" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('description')"
				label="Description"
				:error-message="formErrors.description"
				:required="true">
				<Textarea
					v-model="formData.description"
					cols="50"
					rows="5"
					:disabled="!!props.forceValues.description" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('outcome')"
				label="Outcome"
				:error-message="formErrors.outcome"
				:required="false">
				<Textarea
					v-model="formData.outcome"
					cols="50"
					rows="5"
					:disabled="!!props.forceValues.outcome" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('cost')"
				label="Cost"
				:error-message="formErrors.cost"
				:required="true">
				<InputNumber
					v-model="formData.cost"
					:disabled="!!props.forceValues.cost"
					:max="10000000000"
					:max-fraction-digits="2" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('patient_id')"
				label="Patient"
				:error-message="formErrors.patient_id"
				:required="false">
				<PatientRelationInput
					v-model="formData.patient_id"
					:disabled="!!props.forceValues.patient_id" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('doctor_id')"
				label="Doctor"
				:error-message="formErrors.doctor_id"
				:required="false">
				<DoctorRelationInput
					v-model="formData.doctor_id"
					:disabled="!!props.forceValues.doctor_id" />
			</FormInput>
			<div class="form__footer-container">
				<Button
					v-if="isEdit && !props.hideRemove"
					icon="fal fa-trash"
					label="Remove"
					outlined
					severity="danger"
					:loading="loading"
					@click="remove" />
				<Button
					icon="fal fa-save"
					type="submit"
					:label="isEdit ? 'Update' : 'Create'"
					:loading="loading"
					@submit="submit" />
			</div>
		</form>
	</FormContainer>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import DoctorRelationInput from './DoctorRelationInput.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormInput from '@/components/FormInput.vue'
import InputNumber from 'primevue/inputnumber'
import PatientRelationInput from './PatientRelationInput.vue'
import Textarea from 'primevue/textarea'
import TreatmentsApi from '@/models/Treatment/Api'
import type { Doctor } from '@/models/Doctor/Model'
import type { Patient } from '@/models/Patient/Model'
import type { Treatment } from '@/models/Treatment/Model'
import { toRef, watch } from 'vue'
import { useForm } from '@/helpers/form'
import { useRouter } from 'vue-router'

type FormData = {
	treatment_date: string
	description: string
	outcome: string | null
	cost: number
	patient_id: Patient['id'] | null
	doctor_id: Doctor['id'] | null
}

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'close'): void
	(e: 'submit'): void
	(e: 'created', entity: Treatment | undefined): void
	(e: 'updated'): void
	(e: 'deleted'): void
}>()

const props = withDefaults(
	defineProps<{
		id?: Treatment['id']
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
	api: () => new TreatmentsApi(),
	defaultData: () =>
		({
			treatment_date: '',
			description: '',
			outcome: '',
			cost: 0,
			patient_id: null,
			doctor_id: null,
		}) satisfies FormData as FormData,
	forceValues: () => props.forceValues,
	attachTo: () => props.attachTo,
	id: toRef(props, 'id'),
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onSubmit: () => emit('submit'),
	onCreated: (entity) => {
		if (props.shouldRedirect) {
			router.replace({ name: 'treatments-edit', params: { id: entity!.id } })
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
