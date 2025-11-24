<template>
	<FormContainer
		class="form"
		:visible
		:title="isEdit ? 'Update Treatment' : 'Create Treatment'"
		:as-dialog
		@close="emit('close')">
		<form @submit.prevent="submit">
			<FormInput
				v-if="!props.hideInputs?.includes('treatment_date')"
				:required="true"
				:error-message="formErrors.treatment_date"
				label="Treatment Date">
				<DatePicker
					:model-value="formData.treatment_date ? new Date(formData.treatment_date) : null"
					:disabled="!!props.forceValues.treatment_date"
					selection-mode="single"
					@update:model-value="formData.treatment_date = ($event as Date).toISOString()" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('description')"
				:required="true"
				:error-message="formErrors.description"
				label="Description">
				<Textarea
					v-model="formData.description"
					:disabled="!!props.forceValues.description"
					rows="5"
					cols="50" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('outcome')"
				:required="false"
				:error-message="formErrors.outcome"
				label="Outcome">
				<Textarea
					v-model="formData.outcome"
					:disabled="!!props.forceValues.outcome"
					rows="5"
					cols="50" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('cost')"
				:required="true"
				:error-message="formErrors.cost"
				label="Cost">
				<InputNumber
					v-model="formData.cost"
					:disabled="!!props.forceValues.cost"
					:max-fraction-digits="2"
					:max="10000000000" />
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
import TreatmentsApi from '@/models/Treatment/Api'
import type { Treatment } from '@/models/Treatment/Model'
import { useForm } from '@/helpers/form'
import FormInput from '@/components/FormInput.vue'
import Button from 'primevue/button'
import FormContainer from '@/components/FormContainer.vue'
import DatePicker from 'primevue/datepicker'
import DoctorRelationInput from './DoctorRelationInput.vue'
import InputNumber from 'primevue/inputnumber'
import PatientRelationInput from './PatientRelationInput.vue'
import Textarea from 'primevue/textarea'
import type { Doctor } from '@/models/Doctor/Model'
import type { Patient } from '@/models/Patient/Model'

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
