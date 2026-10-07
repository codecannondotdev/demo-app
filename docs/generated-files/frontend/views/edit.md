---
outline: 'deep'
---

# Edit View

Frontend Edit Views are Vue components generated for every module to display a
form and relation widgets for editing or creating entities. They integrate with
module-specific state management to handle data loading, submission, and
dynamic UI behavior based on whether you are editing an existing entity or
creating a new one.

Let's look at an example of a generated Edit View for the **Recipe** module:

```vue
<template>
	<Header
		:title="isEdit ? 'Edit Recipe' : 'Create Recipe'"
		:is-loading="loaders.size > 0" />
	<Container class="edit">
		<Form
			:id="route.params.id as string"
			@start-loading="loaders.add('form')"
			@stop-loading="loaders.delete('form')"
			@deleted="router.push({ name: 'recipes-list' })" />
		<StepsRelationWidget
			v-if="isEdit"
			:recipe-id="route.params.id as string"
			@start-loading="loaders.add('Steps')"
			@stop-loading="loaders.delete('Steps')" />
	</Container>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Form from './components/Form.vue'
import Container from '@/components/Container.vue'
import StepsRelationWidget from './components/StepsRelationWidget.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => route.name === 'recipes-edit')
const loaders = reactive(new Set<string>())
</script>

<style lang="scss" scoped>
.edit {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
	gap: 20px;
	justify-items: center;
	align-items: start;
}
</style>
```

- See also
  - [Frontend - States](/frontend/states)
  - [Frontend - Container](/frontend/components#container)
  - [Frontend - Header](/frontend/components#header)
  - [Generated Files - Form](/generated-files/frontend/components/form)
  - [Generated Files - RelationWidgets](/generated-files/frontend/components/relation-widgets)

## Dynamic Title & Header

The `<Header>` component displays a dynamic title that changes based on the
view mode. It shows **"Edit Recipe"** when the component is in edit mode,
and **"Create Recipe"** otherwise. The mode is determined by the computed
`isEdit` property, which inspects the current route name.

- See also
  - [Frontend - Header](/frontend/components#header)

## Progress Indicator

The `<Header>` component includes an integrated loading indicator that is controlled
by the `isLoading` prop. The reactive `loaders` set tracks the loading state for
different components (e.g., form submission or relation updates). As long as
`loaders.size` is greater than zero, the header loader appears to provide visual
feedback to the user. The loader includes a 100ms delay before appearing to prevent
flicker for fast operations.

## Form & Relation Widgets

Within a `<Container>`, the view renders two main components:

- **Form:**
  This component is responsible for both creating new recipes and editing
  existing ones. It receives:
  - The recipe ID (when editing) via the `:id` prop. The form automatically
    determines if it's in edit mode based on whether the `id` prop is set.

  It also emits events for managing loading states:
  - `@start-loading` and `@stop-loading` to add or remove loading flags (e.g., for the form).
  - `@deleted` to redirect the user back to the recipes list after deletion.

- **RelationWidget:**
  Rendered only when editing an existing recipe (`v-if="isEdit"`), this widget
  manages related data—in this case, the steps associated with the recipe. It
  also utilizes loading events to integrate with the overall loading state.

- See also
  - [Frontend - Container](/frontend/components#container)
  - [Generated Files - Form](/generated-files/frontend/components/form)
  - [Generated Files - RelationWidgets](/generated-files/frontend/components/relation-widgets)

## State Management

The component uses Vue’s Composition API for state management:
- **Route & Navigation:**
  The `useRoute` and `useRouter` hooks provide access to route parameters and
  navigation methods.
- **Mode Detection:**
  The `isEdit` computed property determines if the current route corresponds to
  an edit view (i.e., `recipes-edit`), otherwise the form is in create mode.
- **Loading State:**
  A reactive `loaders` set tracks different loading states within the view.
  This approach allows multiple components to contribute to the global loading
  indicator seamlessly.

## Summary

This generated Edit View component provides a powerful yet streamlined interface
for managing entity data. With dynamic headers, integrated progress indicators,
and modular components for form and relation management, it enables
developers to focus on business logic while maintaining a consistent and
robust UI.

- See also:
  - [Frontend - Header](/frontend/components#header)
  - [Frontend - Form](/frontend/components#form)
  - [Frontend - Container](/frontend/components#container)
  - [Frontend - StepsRelationWidget](/frontend/components#stepsrelationwidget)
