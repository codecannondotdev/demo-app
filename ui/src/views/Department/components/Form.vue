<template>
	<FormContainer
		class="form"
		:as-dialog
		:title="isEdit ? 'Update Department' : 'Create Department'"
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
				v-if="!props.hideInputs?.includes('location')"
				label="Location"
				:error-message="formErrors.location"
				:required="true">
				<InputText
					v-model="formData.location"
					:disabled="!!props.forceValues.location" />
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
import DepartmentsApi from '@/models/Department/Api'
import FormContainer from '@/components/FormContainer.vue'
import FormInput from '@/components/FormInput.vue'
import InputText from 'primevue/inputtext'
import type { Department } from '@/models/Department/Model'
import { toRef, watch } from 'vue'
import { useForm } from '@/helpers/form'
import { useRouter } from 'vue-router'

type FormData = {
	name: string
	location: string
}

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'close'): void
	(e: 'submit'): void
	(e: 'created', entity: Department | undefined): void
	(e: 'updated'): void
	(e: 'deleted'): void
}>()

const props = withDefaults(
	defineProps<{
		id?: Department['id']
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
	api: () => new DepartmentsApi(),
	defaultData: () =>
		({
			name: '',
			location: '',
		}) satisfies FormData as FormData,
	forceValues: () => props.forceValues,
	attachTo: () => props.attachTo,
	id: toRef(props, 'id'),
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onSubmit: () => emit('submit'),
	onCreated: (entity) => {
		if (props.shouldRedirect) {
			router.replace({ name: 'departments-edit', params: { id: entity!.id } })
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
