<template>
	<FormContainer
		class="form"
		:visible
		:title="props.isEdit ? 'Update Doctor' : 'Create Doctor'"
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
				v-if="!props.hideInputs?.includes('specialty')"
				:required="true"
				:error-message="formErrors.specialty"
				label="Specialty">
				<InputText
					v-model="formData.specialty"
					:disabled="!!props.forceValues.specialty" />
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
				v-if="!props.hideInputs?.includes('consultation_fee')"
				:required="true"
				:error-message="formErrors.consultation_fee"
				label="Consultation Fee">
				<InputNumber
					v-model="formData.consultation_fee"
					:disabled="!!props.forceValues.consultation_fee"
					:max-fraction-digits="2"
					:max="10000000000" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('department_id')"
				:required="false"
				:error-message="formErrors.department_id"
				label="Department">
				<ModelSelect
					v-model="formData.department_id"
					:api="new DepartmentsApi()"
					:disabled="!!props.forceValues.department_id"
					option-label="name" />
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
import DoctorsApi from '@/models/Doctor/Api'
import type { Doctor } from '@/models/Doctor/Model'
import { useForm } from '@/helpers/form'
import FormInput from '@/components/FormInput.vue'
import Button from 'primevue/button'
import FormContainer from '@/components/FormContainer.vue'
import DepartmentsApi from '@/models/Department/Api'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import ModelSelect from '@/components/ModelSelect.vue'

type FormData = {
	first_name: string
	last_name: string
	specialty: string
	contact_number: string
	email_address: string
	consultation_fee: number
	department_id: number | undefined
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
		id?: Doctor['id']
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
	api: () => new DoctorsApi(),
	defaultData: () =>
		({
			first_name: '',
			last_name: '',
			specialty: '',
			contact_number: '',
			email_address: '',
			consultation_fee: 0,
			department_id: undefined,
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
			router.push({ name: 'doctors-edit', params: { id: entity!.id } })
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
