<template>
	<FormContainer
		class="form"
		:as-dialog
		:title="isEdit ? 'Update User' : 'Create User'"
		:visible
		@close="emit('close')">
		<form @submit.prevent="submit">
			<FormInput
				v-if="!props.hideInputs?.includes('name')"
				label="Name"
				:error-message="formErrors.name"
				:required="true">
				<InputText
					v-model="formData.name"
					:disabled="!!props.forceValues.name" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('email')"
				label="Email"
				:error-message="formErrors.email"
				:required="true">
				<InputText
					v-model="formData.email"
					:disabled="!!props.forceValues.email" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('role')"
				label="Role"
				:error-message="formErrors.role"
				:required="true">
				<Select
					v-model="formData.role"
					option-label="title"
					option-value="value"
					:disabled="!!props.forceValues.role"
					:options="[
						{ title: 'admin', value: 'admin' },
						{ title: 'user', value: 'user' },
					]"
					:show-clear="false" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('password')"
				label="Password"
				:error-message="formErrors.password"
				:required="true">
				<InputText
					v-model="formData.password"
					type="password"
					:disabled="!!props.forceValues.password"
					:placeholder="isEdit ? 'Keep current password' : ''" />
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
import { toRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import UsersApi from '@/models/User/Api'
import type { User } from '@/models/User/Model'
import { useForm } from '@/helpers/form'
import FormInput from '@/components/FormInput.vue'
import Button from 'primevue/button'
import FormContainer from '@/components/FormContainer.vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

type FormData = {
	name: string
	email: string
	role: User['role']
	password: string | undefined
}

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'close'): void
	(e: 'submit'): void
	(e: 'created', entity: User | undefined): void
	(e: 'updated'): void
	(e: 'deleted'): void
}>()

const props = withDefaults(
	defineProps<{
		id?: User['id']
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
	api: () => new UsersApi(),
	defaultData: () =>
		({
			name: '',
			email: '',
			role: 'admin',
			password: '',
		}) satisfies FormData as FormData,
	forceValues: () => props.forceValues,
	attachTo: () => props.attachTo,
	id: toRef(props, 'id'),
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onSubmit: () => emit('submit'),
	onCreated: (entity) => {
		if (props.shouldRedirect) {
			router.replace({ name: 'users-edit', params: { id: entity!.id } })
		}
		emit('created', entity)
	},
	onUpdated: () => emit('updated'),
	onDeleted: () => emit('deleted'),
	formatOnUpdate: (params) => {
		if (params.password === '') {
			params.password = undefined
		}
		return params
	},
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
