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
				ref="inputContainer"
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
				ref="inputContainer"
				class="form-input__input-container">
				<slot name="append-input" />
			</div>
		</div>
		<div
			v-if="$slots.default"
			ref="inputContainer"
			class="form-input__input-container">
			<slot :input-id="inputId" />
		</div>
		<div class="form-input__error-message-container">
			<slot
				name="error-message"
				:error-id="errorId">
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

const inputContainer = ref<HTMLElement | null>(null)
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

onMounted(() => {
	if (!inputContainer.value || Array.isArray(inputContainer.value)) return

	// Try to find a native input element first
	const inputElement = inputContainer.value.querySelector('input, textarea, select')

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
		const componentElement = inputContainer.value.querySelector('[class*="p-"]')

		if (componentElement) {
			// Watch for prop changes and update aria attributes
			watchEffect(() => {
				updateAriaAttributes(componentElement as HTMLElement, false)
			})
		}
	}
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
