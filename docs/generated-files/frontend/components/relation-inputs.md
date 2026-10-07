---
outline: 'deep'
---

# Relation Input Component

The Relation Input component provides a form field interface for selecting a single
related entity (belongsTo relationships). It displays the selected entity's
identifier, allows users to change or remove the association, and provides quick
navigation to the related entity's edit page. In this example, the input is used
to select a **Post** for a **User** entity.

We generate a separate component as opposed to using `ModelSelect` for this, so
you can further customize the component to your use-case and to your liking, but
if you want a simple select, you can replace the form input with `ModelSelect`
with just a few lines of changes.

Let's examine an example of a generated Relation Input component for managing a
Post relationship:

```vue
<template>
	<div class="some-post-relation-input ui-relation-input">
		<div
			class="some-post-relation-input__identifier-container"
			:class="{
				'some-post-relation-input__identifier-container--disabled': disabled,
				'some-post-relation-input__identifier-container--empty': !detailsState.details.value,
			}"
			@click="isRelationAddDialogActive = true">
			<template v-if="detailsState.details.value">
				<p class="some-post-relation-input__identifier">
					{{ detailsState.details.value!.title }}
				</p>
				<div class="some-post-relation-input__button-container">
					<Button
						v-if="!disabled"
						class="some-post-relation-input__remove-button"
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
				class="some-post-relation-input__view-button"
				:to="{ name: 'posts-edit', params: { id: detailsState.details.value?.id } }"
				:class="buttonProps.class">
				<FontAwesomeIcon icon="fal fa-arrow-up-right-from-square" />
			</RouterLink>
		</Button>
		<SomePostRelationAddDialog
			v-model="isRelationAddDialogActive"
			:some-post-id="modelValue"
			@update="handleAddDialogUpdate" />
	</div>
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref, watch } from 'vue'
import SomePostRelationAddDialog from './SomePostRelationAddDialog.vue'
import Button from 'primevue/button'
import { usePostDetailsState } from '@/models/Post/States'
import type { Post } from '@/models/Post/Model'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits<{
	(e: 'start-loading'): void
	(e: 'stop-loading'): void
	(e: 'update:model-value', id: Post['id'] | null): void
}>()

const props = defineProps<{
	modelValue: Post['id'] | null
	disabled: boolean
}>()

const isRelationAddDialogActive = ref(false)
const dissociateLoading = ref(false)
const detailsState = usePostDetailsState()

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

function handleAddDialogUpdate(somePost: Post) {
	emit('update:model-value', Number(somePost.id))
}
</script>

<style lang="scss" scoped>
.some-post-relation-input {
	display: flex;

	.some-post-relation-input__identifier-container {
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

		.some-post-relation-input__large-button {
			width: 100%;
			height: 40px;
		}

		.some-post-relation-input__identifier {
			padding: 8px 8px 8px 12px;
		}

		.some-post-relation-input__button-container {
			display: flex;
			align-items: center;
			height: 100%;
			gap: 4px;

			.some-post-relation-input__remove-button {
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

	.some-post-relation-input__view-button {
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
```

## Overview

The Relation Input component provides a clean, form-field-like interface for
selecting and managing a single related entity (belongsTo relationship). In this
example, the component allows users to select a **Post** for a **User**. It
displays the selected Post's title, enables changing or removing the association,
and provides quick navigation to the Post's edit page.

## Key Features

- **Clickable Identifier Container:**
  The main container displays the selected entity's identifier (in this case, the
  Post's title). When clicked, it opens the Relation Add Dialog to allow selecting
  or changing the related entity. The container adapts its styling based on whether
  an entity is selected (empty state) or if the input is disabled.

- **Remove Button:**
  When an entity is selected, a remove button appears inside the identifier
  container. Clicking it (while preventing event propagation) dissociates the
  current relation by emitting `null` as the model value.

- **View Button:**
  A separate button appears to the right of the identifier container, allowing
  quick navigation to the related entity's edit page. This button is only visible
  when an entity is selected.

- **Relation Add Dialog Integration:**
  The component integrates with a generated Relation Add Dialog component that
  allows users to search and select from available entities. The dialog is
  controlled via the `isRelationAddDialogActive` reactive reference.

- **Easy customizability:**
  If displaying the title column of the related entity is not enough for you,
  you can easily customise the display section of this component to display
  additional data, or present the data in a more use-case appropriate way.

- See also
  - [Generated Files - Relation Add Dialogs](/generated-files/frontend/components/relation-add-dialogs)

## State Management & Behavior

- **Details State:**
  The component uses a `detailsState` (from `usePostDetailsState`) to fetch and
  manage the selected entity's details. A watcher on `modelValue` automatically
  fetches the details when a value is set or clears them when the value becomes
  `null`.

- **Loading Indicators:**
  The component emits global loading events (`start-loading` and `stop-loading`)
  when fetching entity details. This allows parent components (such as forms) to
  coordinate loading states across multiple inputs.

- **Refreshing Data:**
  The `refresh` function is called on component mount to ensure the entity details
  are loaded if a `modelValue` is already set. This is particularly useful when
  editing existing entities.

- **Dissociating Relations:**
  The `dissociate` function simply emits `null` as the model value, allowing the
  parent component (typically a form) to handle the actual API call to remove the
  relation.

- **Dialog Updates:**
  When the Relation Add Dialog emits an update event (after a user selects an
  entity), the `handleAddDialogUpdate` function is called, which updates the
  model value with the selected entity's ID.

- See also
  - [Frontend - States](/frontend/components#states)

## Props

- **modelValue (Post['id'] | null):**
  The ID of the currently selected related entity. When this changes, the component
  automatically fetches and displays the entity's details. Use `null` to represent
  an unset or cleared relation.

- **disabled (boolean):**
  When `true`, the identifier container is disabled and the remove button is hidden,
  preventing user interaction.

## Events

- **update:model-value:**
  Emitted when the selected entity changes (either a new entity is selected or the
  relation is dissociated). The parent component should handle updating the form
  data and persisting the change.

- **start-loading:**
  Emitted when the component begins fetching entity details.

- **stop-loading:**
  Emitted when the component finishes fetching entity details.

## Styling

The component uses PrimeVue's CSS variables for consistent styling with other form
fields:
- Form field background, border, and color variables
- Border radius matching standard form fields
- Hover states that match input field interactions
- A two-part layout: the identifier container and the view button, creating a
  seamless form field appearance

## Summary

The generated Relation Input component streamlines the selection of single related
entities within forms. By combining a clickable identifier display, remove
functionality, quick navigation, and dialog integration, it provides an intuitive
user experience for managing belongsTo relationships.

- **See also:**
  - [Generated Files - Relation Add Dialogs](/generated-files/frontend/components/relation-add-dialogs)
  - [Generated Files - Relation Widgets](/generated-files/frontend/components/relation-widgets)
  - [Frontend - States](/frontend/components#states)
  - [Generated Files - Form](/generated-files/frontend/components/form)
