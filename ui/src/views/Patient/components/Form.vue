<template>
	<FormContainer
		class="form"
		:as-dialog
		:title="isEdit ? 'Update Patient' : 'Create Patient'"
		:visible
		@close="emit('close')">
		<form @submit.prevent="submit">
			<FormInput
				v-if="!props.hideInputs?.includes('first_name')"
				label="First Name"
				:error-message="formErrors.first_name"
				:required="true">
				<InputText
					v-model="formData.first_name"
					:disabled="!!props.forceValues.first_name" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('last_name')"
				label="Last Name"
				:error-message="formErrors.last_name"
				:required="true">
				<InputText
					v-model="formData.last_name"
					:disabled="!!props.forceValues.last_name" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('date_of_birth')"
				label="Date Of Birth"
				:error-message="formErrors.date_of_birth"
				:required="true">
				<DatePicker
					selection-mode="single"
					:disabled="!!props.forceValues.date_of_birth"
					:model-value="formData.date_of_birth ? new Date(formData.date_of_birth) : null"
					@update:model-value="formData.date_of_birth = ($event as Date).toISOString()" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('gender')"
				label="Gender"
				:error-message="formErrors.gender"
				:required="true">
				<Select
					v-model="formData.gender"
					option-label="title"
					option-value="value"
					:disabled="!!props.forceValues.gender"
					:options="Object.entries(Gender).map(([value, title]) => ({ title, value }))"
					:show-clear="false" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('contact_number')"
				label="Contact Number"
				:error-message="formErrors.contact_number"
				:required="true">
				<InputText
					v-model="formData.contact_number"
					:disabled="!!props.forceValues.contact_number" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('email_address')"
				label="Email Address"
				:error-message="formErrors.email_address"
				:required="true">
				<InputText
					v-model="formData.email_address"
					:disabled="!!props.forceValues.email_address" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('address')"
				label="Address"
				:error-message="formErrors.address"
				:required="false">
				<Textarea
					v-model="formData.address"
					cols="50"
					rows="5"
					:disabled="!!props.forceValues.address" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('emergency_contact_name')"
				label="Emergency Contact Name"
				:error-message="formErrors.emergency_contact_name"
				:required="false">
				<InputText
					v-model="formData.emergency_contact_name"
					:disabled="!!props.forceValues.emergency_contact_name" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('emergency_contact_number')"
				label="Emergency Contact Number"
				:error-message="formErrors.emergency_contact_number"
				:required="false">
				<InputText
					v-model="formData.emergency_contact_number"
					:disabled="!!props.forceValues.emergency_contact_number" />
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
import FormContainer from '@/components/FormContainer.vue'
import FormInput from '@/components/FormInput.vue'
import InputText from 'primevue/inputtext'
import PatientsApi from '@/models/Patient/Api'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import type { Patient } from '@/models/Patient/Model'
import { Gender } from '@/models/Patient/Enums'
import { toRef, watch } from 'vue'
import { useForm } from '@/helpers/form'
import { useRouter } from 'vue-router'

type FormData = {
	first_name: string
	last_name: string
	date_of_birth: string
	gender: Patient['gender']
	contact_number: string
	email_address: string
	address: string | null
	emergency_contact_name: string | null
	emergency_contact_number: string | null
}

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'close'): void
	(e: 'submit'): void
	(e: 'created', entity: Patient | undefined): void
	(e: 'updated'): void
	(e: 'deleted'): void
}>()

const props = withDefaults(
	defineProps<{
		id?: Patient['id']
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
	api: () => new PatientsApi(),
	defaultData: () =>
		({
			first_name: '',
			last_name: '',
			date_of_birth: '',
			gender: Object.values(Gender)[0] as Patient['gender'],
			contact_number: '',
			email_address: '',
			address: '',
			emergency_contact_name: '',
			emergency_contact_number: '',
		}) satisfies FormData as FormData,
	forceValues: () => props.forceValues,
	attachTo: () => props.attachTo,
	id: toRef(props, 'id'),
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onSubmit: () => emit('submit'),
	onCreated: (entity) => {
		if (props.shouldRedirect) {
			router.replace({ name: 'patients-edit', params: { id: entity!.id } })
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
