<template>
	<FormContainer
		class="form"
		:visible
		:title="isEdit ? 'Update Nurse' : 'Create Nurse'"
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
				v-if="!props.hideInputs?.includes('shift')"
				:required="true"
				:error-message="formErrors.shift"
				label="Shift">
				<Select
					v-model="formData.shift"
					:options="Object.entries(Shift).map(([value, title]) => ({ title, value }))"
					:show-clear="false"
					:disabled="!!props.forceValues.shift"
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
import NursesApi from '@/models/Nurse/Api'
import type { Nurse } from '@/models/Nurse/Model'
import { useForm } from '@/helpers/form'
import FormInput from '@/components/FormInput.vue'
import Button from 'primevue/button'
import FormContainer from '@/components/FormContainer.vue'
import DepartmentRelationInput from './DepartmentRelationInput.vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type { Department } from '@/models/Department/Model'
import { Shift } from '@/models/Nurse/Enums'

type FormData = {
	first_name: string
	last_name: string
	shift: Nurse['shift']
	contact_number: string
	email_address: string
	department_id: Department['id'] | null
}

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'close'): void
	(e: 'submit'): void
	(e: 'created', entity: Nurse | undefined): void
	(e: 'updated'): void
	(e: 'deleted'): void
}>()

const props = withDefaults(
	defineProps<{
		id?: Nurse['id']
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
	api: () => new NursesApi(),
	defaultData: () =>
		({
			first_name: '',
			last_name: '',
			shift: Object.values(Shift)[0] as Nurse['shift'],
			contact_number: '',
			email_address: '',
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
			router.replace({ name: 'nurses-edit', params: { id: entity!.id } })
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
