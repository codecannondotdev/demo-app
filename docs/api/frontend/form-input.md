---
outline: 'deep'
---

# `FormInput`

`FormInput` is a form input wrapper component that allows you to easily add a
label and error text to a form input and mark it as required. Additionally, it
sets `for`, `id`, `aria-required`, `aria-labelledby` and `aria-describedby`
attributes automatically.

- See also
  - [Frontend - Form Input](/frontend/components#forminput)

## Component

```vue
<template>
	<div
		class="form-input"
		:class="{ 'form-input--error': errorMessage }">
		<div class="form-input__prepend-label-container">
			<slot name="prepend-label" />
		</div>
		<div
			class="form-input__label-container"
			:class="{
				'form-input__label-container--inline-input':
					$slots['prepend-input'] || $slots['append-input'],
			}">
			<div
				v-if="$slots['prepend-input']"
				ref="prependInputContainer"
				class="form-input__input-container">
				<slot name="prepend-input" />
			</div>
			<slot
				:input-id="inputId"
				name="label">
				<label :for="inputId">{{ labelText }}</label>
			</slot>
			<div
				v-if="$slots['append-input']"
				ref="appendInputContainer"
				class="form-input__input-container">
				<slot name="append-input" />
			</div>
		</div>
		<div
			v-if="$slots.default"
			ref="defaultInputContainer"
			class="form-input__input-container">
			<slot :input-id="inputId" />
		</div>
		<div class="form-input__error-message-container">
			<slot name="error-message" :error-id="errorId">
				<small
					v-if="errorMessage"
					:id="errorId"
					class="form-input__error-message"
					>{{ errorMessage }}</small
				>
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useId, watchEffect } from 'vue'

const props = defineProps<{
	errorMessage?: string
	required?: boolean
	label?: string
}>()

const prependInputContainer = ref<HTMLElement | null>(null)
const appendInputContainer = ref<HTMLElement | null>(null)
const defaultInputContainer = ref<HTMLElement | null>(null)
const inputId = useId()
const errorId = useId()

const labelText = computed(() => {
	return props.required ? `${props.label} *` : props.label
})

const updateAriaAttributes = (element: HTMLElement, isNativeInput: boolean) => {
	if (props.required) {
		element.setAttribute('aria-required', 'true')
	} else {
		element.removeAttribute('aria-required')
	}

	if (props.errorMessage) {
		element.setAttribute('aria-describedby', errorId)
	} else {
		element.removeAttribute('aria-describedby')
	}

	if (!isNativeInput) {
		element.setAttribute('aria-labelledby', inputId)
	}
}

const processInputContainer = (container: HTMLElement | null) => {
	if (!container || Array.isArray(container)) return

	// Try to find a native input element first
	const inputElement = container.querySelector('input, textarea, select')

	if (inputElement) {
		// For native input elements, set the id
		inputElement.id = inputId

		// Watch for prop changes and update aria attributes
		watchEffect(() => {
			updateAriaAttributes(inputElement as HTMLElement, true)
		})
	} else {
		// For non-native elements (like PrimeVue components without native inputs),
		// find the root component element and set aria attributes
		const componentElement = container.querySelector('[class*="p-"]')

		if (componentElement) {
			// Watch for prop changes and update aria attributes
			watchEffect(() => {
				updateAriaAttributes(componentElement as HTMLElement, false)
			})
		}
	}
}

onMounted(() => {
	// Process all input containers
	processInputContainer(prependInputContainer.value)
	processInputContainer(appendInputContainer.value)
	processInputContainer(defaultInputContainer.value)
})
</script>

<style scoped lang="scss">
.form-input {
	display: flex;
	flex-direction: column;
	gap: 5px;

	&--error {
		:deep(.form-input__input-container) {
			.p-inputtext,
			.p-cascadeselect,
			.p-checkbox-box,
			.p-colorpicker,
			.p-datepicker,
			.p-editor,
			.p-inputnumber-input,
			.p-inputotp-input,
			.p-listbox,
			.p-multiselect,
			.p-radiobutton-input,
			.p-select,
			.p-selectbutton,
			.p-textarea,
			.p-togglebutton,
			.p-toggleswitch .p-toggleswitch-slider,
			.p-treeselect {
				border: 1px solid var(--p-red-500);
			}

			.p-slider .p-slider-handle,
			.p-slider .p-slider-handle::before {
				background-color: var(--p-red-500);
			}

			.p-knob svg .p-knob-range {
				stroke: var(--p-red-500);
			}
			.p-knob svg .p-knob-text,
			.p-rating svg path {
				fill: var(--p-red-500);
			}
		}
	}

	.form-input__label-container {
		display: flex;
		justify-content: flex-start;
		gap: 5px;
		flex-direction: row;

		&--inline-input {
			gap: 10px;
		}
	}

	.form-input__input-container {
		> :not(.p-toggleswitch) {
			width: 100%;
		}

		:deep(.p-datepicker-input) {
			width: 100%;
		}
	}

	.form-input__error-message-container {
		display: flex;
		align-items: flex-start;
		gap: 5px;
		flex-direction: column;

		.form-input__error-message {
			color: var(--p-red-500);
		}
	}
}
</style>
```

## Props

### `label`
- **Type**: `string`
- **Required**: `false`
- **Description**: The label to display for the input.

### `required`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: A flag that indicates if the input is required. Will add a
`*` to the label and set `aria-required="true"` on the input.

### `errorMessage`
- **Type**: `string`
- **Default**: `null`
- **Description**: The error message to display for the input. Adds
`aria-describedby` to the input element and a custom id to error message.

## Slots

### `default`
- **Description**: The input element/component (e.g., `<input>`, `<InputText>`,
    etc.) should be placed in the default slot. It will be wrapped and styled
    by the component.
- **Slot Props**:
  - `input-id` (`string`): The generated unique ID for the input element.

### `label`
- **Description**: Customizes the label area.
- **Slot Props**:
  - `input-id` (`string`): The generated unique ID for the input element.
- **Default**: Renders a `<label>` with the provided `label` prop.

### `prepend-label`
- **Description**: Content to display before the label (e.g., an icon or text).
    Renders inside a container before the label.

### `prepend-input`
- **Description**: Slot to use to position your `input` before the `label` inline.

### `append-input`
- **Description**: Slot to use to position your `input` after the `label` inline.

### `error-message`
- **Description**: Customizes the error message area. By default, displays the
    `errorMessage` prop if present. You can override this slot to provide custom
    error content.
- **Slot Props**:
  - `error-id` (`string`): The generated unique ID for the error message element.

## Accessibility

The `FormInput` component includes built-in accessibility features that apply to
inputs in the `default`, `prepend-input`, and `append-input` slots:
- Automatically generates a unique ID for the input element and associates it
    with the label via the `for` attribute.
- Adds `aria-required="true"` to the input element when the `required` prop is
    set to `true`.
- Adds `aria-describedby` to the input element when an error message is present,
    linking it to the error message element.
- Supports `aria-labelledby` for components that require it (e.g., PrimeVue
    `Select`, `ToggleButton`, `Slider`, `Knob`, `ListBox`, `SelectButton`).
