<template>
	<FormContainer
		class="form"
		:as-dialog
		:title="isEdit ? 'Update Medication' : 'Create Medication'"
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
				v-if="!props.hideInputs?.includes('description')"
				label="Description"
				:error-message="formErrors.description"
				:required="false">
				<Textarea
					v-model="formData.description"
					cols="50"
					rows="5"
					:disabled="!!props.forceValues.description" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('dosage_form')"
				label="Dosage Form"
				:error-message="formErrors.dosage_form"
				:required="true">
				<Select
					v-model="formData.dosage_form"
					option-label="title"
					option-value="value"
					:disabled="!!props.forceValues.dosage_form"
					:options="Object.entries(DosageForm).map(([value, title]) => ({ title, value }))"
					:show-clear="false" />
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
import FormContainer from '@/components/FormContainer.vue'
import FormInput from '@/components/FormInput.vue'
import InputText from 'primevue/inputtext'
import MedicationsApi from '@/models/Medication/Api'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import type { Medication } from '@/models/Medication/Model'
import { DosageForm } from '@/models/Medication/Enums'
import { toRef, watch } from 'vue'
import { useForm } from '@/helpers/form'
import { useRouter } from 'vue-router'

type FormData = {
	name: string
	description: string | null
	dosage_form: Medication['dosage_form']
}

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'close'): void
	(e: 'submit'): void
	(e: 'created', entity: Medication | undefined): void
	(e: 'updated'): void
	(e: 'deleted'): void
}>()

const props = withDefaults(
	defineProps<{
		id?: Medication['id']
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
	api: () => new MedicationsApi(),
	defaultData: () =>
		({
			name: '',
			description: '',
			dosage_form: Object.values(DosageForm)[0] as Medication['dosage_form'],
		}) satisfies FormData as FormData,
	forceValues: () => props.forceValues,
	attachTo: () => props.attachTo,
	id: toRef(props, 'id'),
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onSubmit: () => emit('submit'),
	onCreated: (entity) => {
		if (props.shouldRedirect) {
			router.replace({ name: 'medications-edit', params: { id: entity!.id } })
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
