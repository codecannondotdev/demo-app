<template>
	<div class="appointment-relation-input ui-relation-input">
		<div
			class="appointment-relation-input__identifier-container"
			:class="{
				'appointment-relation-input__identifier-container--disabled': disabled,
				'appointment-relation-input__identifier-container--empty': !detailsState.details.value,
			}"
			@click="isRelationAddDialogActive = true">
			<template v-if="detailsState.details.value">
				<p class="appointment-relation-input__identifier">
					{{ detailsState.details.value!.reason_for_visit }}
				</p>
				<div class="appointment-relation-input__button-container">
					<Button
						v-if="!disabled"
						class="appointment-relation-input__remove-button"
						severity="secondary"
						text
						rounded
						icon="fal fa-times"
						:loading="dissociateLoading"
						@click.stop="dissociate" />
				</div>
			</template>
		</div>
		<Button
			v-if="detailsState.details.value"
			v-slot="buttonProps"
			as-child
			severity="secondary">
			<RouterLink
				class="appointment-relation-input__view-button"
				:to="{ name: 'appointments-edit', params: { id: detailsState.details.value?.id } }"
				:class="buttonProps.class">
				<i class="fal fa-arrow-up-right-from-square" />
			</RouterLink>
		</Button>
		<AppointmentRelationAddDialog
			v-model="isRelationAddDialogActive"
			:appointment-id="modelValue"
			@update="handleAddDialogUpdate" />
	</div>
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref, watch } from 'vue'
import AppointmentRelationAddDialog from './AppointmentRelationAddDialog.vue'
import Button from 'primevue/button'
import { useAppointmentDetailsState } from '@/models/Appointment/States'
import type { Appointment } from '@/models/Appointment/Model'

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'update:model-value', id: Appointment['id'] | null): void
}>()

const props = defineProps<{
	modelValue: Appointment['id'] | null
	disabled: boolean
}>()

const isRelationAddDialogActive = ref(false)
const dissociateLoading = ref(false)
const detailsState = useAppointmentDetailsState()

watch(
	() => props.modelValue,
	() => {
		if (props.modelValue) {
			detailsState.getDetails(props.modelValue)
		} else {
			detailsState.clearDetails()
		}
	},
)

onBeforeMount(() => {
	refresh()
})

async function refresh() {
	if (!props.modelValue) {
		return
	}

	try {
		emit('start-loading')
		await detailsState.getDetails(props.modelValue)
	} finally {
		emit('stop-loading')
	}
}

async function dissociate() {
	emit('update:model-value', null)
}

function handleAddDialogUpdate(appointment: Appointment) {
	emit('update:model-value', Number(appointment.id))
}
</script>

<style lang="scss" scoped>
.appointment-relation-input {
	display: flex;

	.appointment-relation-input__identifier-container {
		width: 100%;
		background: var(--p-form-field-background);
		border-radius: var(--p-form-field-border-radius) 0 0 var(--p-form-field-border-radius);
		border: solid 1px var(--p-form-field-border-color);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		cursor: pointer;
		height: 40px;
		overflow: hidden;
		color: var(--p-form-field-color);
		transition:
			background var(--p-form-field-transition-duration),
			color var(--p-form-field-transition-duration),
			border-color var(--p-form-field-transition-duration),
			outline-color var(--p-form-field-transition-duration),
			box-shadow var(--p-form-field-transition-duration);
		appearance: none;
		outline-color: transparent;
		box-shadow: var(--p-form-field-shadow);

		&--disabled {
			pointer-events: none;
		}

		&--empty {
			border-radius: var(--p-form-field-border-radius);
		}

		&:hover {
			border-color: var(--p-inputtext-hover-border-color);
		}

		.appointment-relation-input__large-button {
			width: 100%;
			height: 40px;
		}

		.appointment-relation-input__identifier {
			padding: 8px 8px 8px 12px;
		}

		.appointment-relation-input__button-container {
			display: flex;
			align-items: center;
			height: 100%;
			gap: 4px;

			.appointment-relation-input__remove-button {
				width: 30px;
				max-width: 30px;
				height: 30px;
				max-height: 30px;
				border-radius: 100%;
				margin-right: 4px;

				i {
					font-size: 12px;
				}

				&:hover {
					background: transparent;
				}
			}
		}
	}

	.appointment-relation-input__view-button {
		width: 40px;
		height: 40px;
		border-radius: 0;
		border: solid 1px var(--p-form-field-border-color);
		border-left: none;
		padding: 0;
		border-radius: 0 var(--p-form-field-border-radius) var(--p-form-field-border-radius) 0;

		&:hover {
			border: solid 1px var(--p-form-field-border-color);
			border-left: none;
		}

		i {
			font-size: 12px;
		}
	}
}
</style>
