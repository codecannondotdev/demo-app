<template>
	<div class="nurse-relation-input ui-relation-input">
		<div
			class="nurse-relation-input__identifier-container"
			:class="{
				'nurse-relation-input__identifier-container--disabled': disabled,
				'nurse-relation-input__identifier-container--empty': !detailsState.details.value,
			}"
			@click="isRelationAddDialogActive = true">
			<template v-if="detailsState.details.value">
				<p class="nurse-relation-input__identifier">
					{{ detailsState.details.value!.first_name }}
				</p>
				<div class="nurse-relation-input__button-container">
					<Button
						v-if="!disabled"
						class="nurse-relation-input__remove-button"
						severity="secondary"
						text
						rounded
						icon="fal fa-xmark"
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
				class="nurse-relation-input__view-button"
				:to="{ name: 'nurses-edit', params: { id: detailsState.details.value?.id } }"
				:class="buttonProps.class">
				<FontAwesomeIcon icon="fal fa-arrow-up-right-from-square" />
			</RouterLink>
		</Button>
		<NurseRelationAddDialog
			v-model="isRelationAddDialogActive"
			:nurse-id="modelValue"
			@update="handleAddDialogUpdate" />
	</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import FontAwesomeIcon from '@/components/FontAwesomeIcon.vue'
import { onBeforeMount, ref, watch } from 'vue'
import NurseRelationAddDialog from './NurseRelationAddDialog.vue'
import { useNurseDetailsState } from '@/models/Nurse/States'
import type { Nurse } from '@/models/Nurse/Model'

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'update:model-value', id: Nurse['id'] | null): void
}>()

const props = defineProps<{
	modelValue: Nurse['id'] | null
	disabled: boolean
}>()

const isRelationAddDialogActive = ref(false)
const dissociateLoading = ref(false)
const detailsState = useNurseDetailsState()

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

function handleAddDialogUpdate(nurse: Nurse) {
	emit('update:model-value', Number(nurse.id))
}
</script>

<style lang="scss" scoped>
.nurse-relation-input {
	display: flex;

	.nurse-relation-input__identifier-container {
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

		.nurse-relation-input__large-button {
			width: 100%;
			height: 40px;
		}

		.nurse-relation-input__identifier {
			padding: 8px 8px 8px 12px;
		}

		.nurse-relation-input__button-container {
			display: flex;
			align-items: center;
			height: 100%;
			gap: 4px;

			.nurse-relation-input__remove-button {
				width: 30px;
				max-width: 30px;
				height: 30px;
				max-height: 30px;
				border-radius: 100%;
				margin-right: 4px;

				&:hover {
					background: transparent;
				}
			}
		}
	}

	.nurse-relation-input__view-button {
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

		svg {
			font-size: 14px;
		}
	}
}
</style>
