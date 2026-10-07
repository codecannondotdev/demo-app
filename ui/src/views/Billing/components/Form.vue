<template>
	<FormContainer
		class="form"
		:as-dialog
		:title="isEdit ? 'Update Billing' : 'Create Billing'"
		:visible
		@close="emit('close')">
		<form @submit.prevent="submit">
			<FormInput
				v-if="!props.hideInputs?.includes('billing_date')"
				label="Billing Date"
				:error-message="formErrors.billing_date"
				:required="true">
				<DatePicker
					selection-mode="single"
					:disabled="!!props.forceValues.billing_date"
					:model-value="formData.billing_date ? new Date(formData.billing_date) : null"
					@update:model-value="formData.billing_date = ($event as Date).toISOString()" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('amount')"
				label="Amount"
				:error-message="formErrors.amount"
				:required="true">
				<InputNumber
					v-model="formData.amount"
					:disabled="!!props.forceValues.amount"
					:max="10000000000"
					:max-fraction-digits="2" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('status')"
				label="Status"
				:error-message="formErrors.status"
				:required="true">
				<Select
					v-model="formData.status"
					option-label="title"
					option-value="value"
					:disabled="!!props.forceValues.status"
					:options="Object.entries(Status).map(([value, title]) => ({ title, value }))"
					:show-clear="false" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('payment_method')"
				label="Payment Method"
				:error-message="formErrors.payment_method"
				:required="true">
				<Select
					v-model="formData.payment_method"
					option-label="title"
					option-value="value"
					:disabled="!!props.forceValues.payment_method"
					:options="Object.entries(PaymentMethod).map(([value, title]) => ({ title, value }))"
					:show-clear="false" />
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
				v-if="!props.hideInputs?.includes('appointment_id')"
				label="Appointment"
				:error-message="formErrors.appointment_id"
				:required="false">
				<AppointmentRelationInput
					v-model="formData.appointment_id"
					:disabled="!!props.forceValues.appointment_id" />
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
import AppointmentRelationInput from './AppointmentRelationInput.vue'
import BillingsApi from '@/models/Billing/Api'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import FormContainer from '@/components/FormContainer.vue'
import FormInput from '@/components/FormInput.vue'
import InputNumber from 'primevue/inputnumber'
import PatientRelationInput from './PatientRelationInput.vue'
import Select from 'primevue/select'
import type { Appointment } from '@/models/Appointment/Model'
import type { Billing } from '@/models/Billing/Model'
import type { Patient } from '@/models/Patient/Model'
import { Status, PaymentMethod } from '@/models/Billing/Enums'
import { toRef, watch } from 'vue'
import { useForm } from '@/helpers/form'
import { useRouter } from 'vue-router'

type FormData = {
	billing_date: string
	amount: number
	status: Billing['status']
	payment_method: Billing['payment_method']
	patient_id: Patient['id'] | null
	appointment_id: Appointment['id'] | null
}

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'close'): void
	(e: 'submit'): void
	(e: 'created', entity: Billing | undefined): void
	(e: 'updated'): void
	(e: 'deleted'): void
}>()

const props = withDefaults(
	defineProps<{
		id?: Billing['id']
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
	api: () => new BillingsApi(),
	defaultData: () =>
		({
			billing_date: '',
			amount: 0,
			status: Object.values(Status)[0] as Billing['status'],
			payment_method: Object.values(PaymentMethod)[0] as Billing['payment_method'],
			patient_id: null,
			appointment_id: null,
		}) satisfies FormData as FormData,
	forceValues: () => props.forceValues,
	attachTo: () => props.attachTo,
	id: toRef(props, 'id'),
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onSubmit: () => emit('submit'),
	onCreated: (entity) => {
		if (props.shouldRedirect) {
			router.replace({ name: 'billings-edit', params: { id: entity!.id } })
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
