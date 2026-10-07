---
outline: 'deep'
---

# Form Component

Frontend Forms are Vue components generated for every module to handle the
creation and updating of entities. They are built using a collection of reusable
components and a shared `useForm` composable that manages form state, validation,
submission, and loading states. The form fields and data are generated based on
your module specification, ensuring that every form is tailored to its
corresponding model.

- See also
  - [Frontend - Form utils](/frontend/form-utils)

Let's look at an example of a generated Form component for the **Plan** module:

```vue
<template>
	<FormContainer
		class="form"
		:visible
		:title="isEdit ? 'Update Plan' : 'Create Plan'"
		:as-dialog
		@close="emit('close')">
		<form @submit.prevent="submit">
			<FormInput
				v-if="!props.hideInputs?.includes('name')"
				:required="true"
				:error-message="formErrors.name"
				label="Name">
				<InputText
					v-model="formData.name"
					:disabled="!!props.forceValues.name" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('price')"
				:required="true"
				:error-message="formErrors.price"
				label="Price">
				<InputNumber
					v-model="formData.price"
					:disabled="!!props.forceValues.price"
					:max-fraction-digits="2"
					:max="10000000000" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('interval')"
				:required="false"
				:error-message="formErrors.interval"
				label="Interval">
				<Select
					v-model="formData.interval"
					:options="Object.entries(Interval).map(([key, value]) => ({ title: value, value: key }))"
					:show-clear="true"
					:disabled="!!props.forceValues.interval"
					option-label="title"
					option-value="value" />
			</FormInput>
			<FormInput
				v-if="!props.hideInputs?.includes('stripe_price_id')"
				:required="true"
				:error-message="formErrors.stripe_price_id"
				label="Stripe Price Id">
				<InputText
					v-model="formData.stripe_price_id"
					:disabled="!!props.forceValues.stripe_price_id" />
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
import PlansApi from '@/models/Plan/Api'
import type { Plan } from '@/models/Plan/Model'
import { Interval } from '@/models/Plan/Enums'
import { useForm } from '@/helpers/form'
import FormInput from '@/components/FormInput.vue'
import Button from 'primevue/button'
import FormContainer from '@/components/FormContainer.vue'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

type FormData = {
	name: string
	price: number
	interval: Plan['interval'] | null
	stripe_price_id: string
}

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'close'): void
	(e: 'created', entity: Plan | undefined): void
	(e: 'updated'): void
	(e: 'deleted'): void
}>()

const props = withDefaults(
	defineProps<{
		id?: Plan['id']
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
	api: () => new PlansApi(),
	defaultData: () =>
		({
			name: '',
			price: 0,
			interval: null,
			stripe_price_id: '',
		}) satisfies FormData as FormData,
	forceValues: () => props.forceValues,
	attachTo: () => props.attachTo,
	id: toRef(props, 'id'),
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onSubmit: () => emit('submit'),
	onCreated: (entity) => {
		if (props.shouldRedirect) {
			router.replace({ name: 'plans-edit', params: { id: entity!.id } })
		}
		emit('created', entity)
	},
	onUpdated: () => emit('updated'),
	onDeleted: () => emit('deleted'),
})

watch(
	() => props.visible,
	(val) => {
		if (!val) reset()
	},
)
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
```

## Overview

The Form component provides a unified interface for both creating new entities
and editing existing ones. It is automatically generated based on your module's
configuration, ensuring that all necessary fields and validations are included.
The component leverages shared components—such as `FormContainer`, `FormInput`,
and various input controls (e.g., `InputText`, `InputNumber`, `Select`)—to
maintain a consistent look and behavior across your application.

- See also
  - [Frontend - FormContainer](/frontend/components#formcontainer)
  - [Frontend - FormInput](/frontend/components#forminput)

## Form Container & Visibility

- **FormContainer:**
  The entire form is wrapped in a `FormContainer` component, which:
  - Provides a consistent layout and styling.
  - Can be rendered as a dialog (using the `:as-dialog` prop).
  - Displays a dynamic title based on the form mode (edit or create), determined
    by the `isEdit` computed property from `useForm`.
  - Emits a `close` event when the container is closed.

- **Visibility:**
  The container is controlled via the `visible` prop. A watcher resets the form
  whenever the form is hidden, ensuring that the form starts in a clean state
  when reopened.

- See also
  - [Frontend - FormContainer](/frontend/components#formcontainer)

## Dynamic Form Fields

The form fields are generated based on the module specification. For each field
defined in your model, a corresponding `FormInput` is rendered. Key points include:

- **Conditional Rendering:**
  Fields can be hidden by passing their names in the `hideInputs` prop.

- **Data Binding:**
  Each input component is bound to the reactive `formData` object using `v-model`.

- **Error Handling:**
  Dynamic error messages are displayed using the `formErrors` object for each field.

- **Force Values:**
  Inputs can be disabled if a forced value is provided through the `forceValues` prop.

In this example, the form includes fields for **Name**, **Price**, **Interval**,
and **Stripe Price Id**. The exact fields will vary based on your module's
configuration.

- See also
  - [Frontend - FormInput](/frontend/components#forminput)
  - [Frontend - Form utils](/frontend/form-utils)

## Submission & Button Actions

The form includes a footer with action buttons:

- **Remove Button:**
  Displayed only in edit mode (when `id` is set, and if not explicitly hidden
  via `hideRemove`), this button allows the deletion of the entity.

- **Save Button:**
  The primary button triggers form submission and adapts its label to "Update"
  or "Create" based on the form mode, determined by the `isEdit` computed property
  from `useForm`.

Both buttons are wired to event handlers provided by the `useForm` composable.

- See also
  - [Frontend - Form Utils](/frontend/form-utils)

## State Management with useForm

The `useForm` composable handles all aspects of form state management, including:

- **formData:**
  A reactive object containing the current values of the form fields.

- **loading:**
  A flag indicating if the form is processing an action (submission, deletion, etc.).

- **formErrors:**
  An object that holds validation error messages for each field.

- **Methods:**
  The composable exposes `reset`, `submit`, and `remove` methods to control form
  behavior. It also provides an `isDirty` flag to track changes.

- **Event Callbacks:**
  Callbacks such as `onStartLoading`, `onStopLoading`, `onSubmit`, `onCreated`,
  `onUpdated`, and `onDeleted` allow the form to integrate seamlessly with your
  application’s workflow.

- See also
  - [Frontend - Form Utils](/frontend/form-utils)
  - [API - `useForm`](/api/frontend/use-form)

## Reset Behavior

A watcher on the `visible` prop automatically resets the form when it becomes
hidden. This ensures that when the form is reopened, it does not retain stale
data from previous interactions.

## Summary

The generated Form component streamlines entity management by:
- Automatically generating form fields and validations based on module specifications.
- Leveraging shared components and a unified `useForm` composable for consistent
state management.
- Providing flexible configuration through props such as `asDialog`, `hideInputs`,
`forceValues`, and `id`. Edit mode is automatically determined based on whether
the `id` prop is set.

- See also:
  - [Generated Files - Form](/generated-files/frontend/components/form)
  - [Frontend - FormInput](/frontend/components#forminput)
  - [Generated Files - FormContainer](/frontend/components#formcontainer)
  - [API - `useForm`](/api/frontend/use-form)
