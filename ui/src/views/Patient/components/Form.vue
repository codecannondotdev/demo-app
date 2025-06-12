<template>
	<FormContainer
		class="form"
		:visible
		:title="props.isEdit ? 'Update Patient' : 'Create Patient'"
		:as-dialog
		@close="emit('close')">
		<form @submit.prevent="submit">
			<FormInput
				v-if="!props.hideInputs?.includes('first_name')"
				:required="true"
				:error-message="formErrors.first_name"
				label="First Name">
				<InputText
					v-model="formData.first_name"
					:disabled="!!props.forceValues.first_name" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('last_name')"
				:required="true"
				:error-message="formErrors.last_name"
				label="Last Name">
				<InputText
					v-model="formData.last_name"
					:disabled="!!props.forceValues.last_name" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('date_of_birth')"
				:required="true"
				:error-message="formErrors.date_of_birth"
				label="Date Of Birth">
				<DatePicker
					:model-value="formData.date_of_birth ? new Date(formData.date_of_birth) : undefined"
					:disabled="!!props.forceValues.date_of_birth"
					selectionMode="single"
					@update:model-value="formData.date_of_birth = ($event as Date).toISOString()" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('gender')"
				:required="true"
				:error-message="formErrors.gender"
				label="Gender">
				<Select
					v-model="formData.gender"
					:options="[
						{ title: 'Male', value: 'Male' },
						{ title: 'Female', value: 'Female' },
						{ title: 'Other', value: 'Other' },
					]"
					:show-clear="false"
					:disabled="!!props.forceValues.gender"
					option-label="title"
					option-value="value" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('contact_number')"
				:required="true"
				:error-message="formErrors.contact_number"
				label="Contact Number">
				<InputText
					v-model="formData.contact_number"
					:disabled="!!props.forceValues.contact_number" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('email_address')"
				:required="true"
				:error-message="formErrors.email_address"
				label="Email Address">
				<InputText
					v-model="formData.email_address"
					:disabled="!!props.forceValues.email_address" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('address')"
				:required="false"
				:error-message="formErrors.address"
				label="Address">
				<Textarea
					v-model="formData.address"
					:disabled="!!props.forceValues.address"
					rows="5"
					cols="50" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('emergency_contact_name')"
				:required="false"
				:error-message="formErrors.emergency_contact_name"
				label="Emergency Contact Name">
				<InputText
					v-model="formData.emergency_contact_name"
					:disabled="!!props.forceValues.emergency_contact_name" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('emergency_contact_number')"
				:required="false"
				:error-message="formErrors.emergency_contact_number"
				label="Emergency Contact Number">
				<InputText
					v-model="formData.emergency_contact_number"
					:disabled="!!props.forceValues.emergency_contact_number" />
			</FormInput>
			<div class="form__footer-container">
				<Button
					v-if="props.isEdit && !props.hideRemove"
					severity="danger"
					icon="fal fa-trash"
					label="Remove"
					outlined
					:loading="loading"
					@click="remove" />
				<Button
					icon="fal fa-save"
					:loading="loading"
					:label="props.isEdit ? 'Update' : 'Create'"
					type="submit"
					@submit="submit" />
			</div>
		</form>
	</FormContainer>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import PatientsApi from '@/models/Patient/Api'
import type { Patient } from '@/models/Patient/Model'
import { useForm } from '@/helpers/form'
import FormInput from '@/components/FormInput.vue'
import Button from 'primevue/button'
import FormContainer from '@/components/FormContainer.vue'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'

type FormData = {
	first_name: string
	last_name: string
	date_of_birth: string
	gender: Patient['gender']
	contact_number: string
	email_address: string
	address: string | undefined
	emergency_contact_name: string | undefined
	emergency_contact_number: string | undefined
}

const emit = defineEmits([
	'start-loading',
	'stop-loading',
	'close',
	'created',
	'updated',
	'deleted',
])

const props = withDefaults(
	defineProps<{
		isEdit?: boolean
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
const { formData, loading, formErrors, reset, submit, remove } = useForm({
	api: () => new PatientsApi(),
	defaultData: () =>
		({
			first_name: '',
			last_name: '',
			date_of_birth: '',
			gender: 'Male',
			contact_number: '',
			email_address: '',
			address: '',
			emergency_contact_name: '',
			emergency_contact_number: '',
		}) satisfies FormData as FormData,
	forceValues: () => props.forceValues,
	attachTo: () => props.attachTo,
	isEdit: () => props.isEdit,
	id: () => props.id,
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onClose: () => emit('close'),
	onCreated: (entity) => {
		if (props.shouldRedirect) {
			router.push({ name: 'patients-edit', params: { id: entity!.id } })
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
