---
outline: 'deep'
---

# `useForm`

The `useForm` composable provides a comprehensive solution for managing form
state in your Vue application. It handles creating, updating, and deleting
models via a provided API, tracks loading and error states, and even protects
against unwanted redirects when there are unsaved changes.

> **Note:** This composable makes use of several Vue composition API features
as well as PrimeVue's confirmation dialog.

## Overview

The `useForm` composable is designed to simplify common form-handling tasks:

- **Dirty Checking:** It determines if the form has been modified using the
`isFormDirty` helper.
- **Loading State & Errors:** Manages loading indicators and form error messages.
- **CRUD Operations:** Supports create, update, and delete operations using your
provided API.
- **Redirect Protection:** Warns users if they attempt to navigate away from the
page with unsaved changes.
- **Relation Attachments:** Optionally attaches related models after creation or
update.

## isFormDirty

```typescript
export function isFormDirty(
	original: Record<string, any>,
	current: Record<string, any>
): boolean {
	for (const key in original) {
		if (original[key] !== current[key]) {
			return true
		}
	}
	return false
}
```

The `isFormDirty` function compares two objects—the original form data and the
current form data—to determine if any field has been modified.

### Parameters

- **`original`**
  - **Type:** `Record<string, any>`
  - **Description:** The initial state of the form data.
- **`current`**
  - **Type:** `Record<string, any>`
  - **Description:** The current state of the form data.

### Returns

- **Type:** `boolean`
- **Description:** Returns `true` if at least one value in the form has changed;
otherwise, returns `false`.

## FormOptions Interface

```typescript
export interface FormOptions<
	FormApi extends Api<FormModel>,
	FormData extends Parameters<FormApi['store']>[0] | Parameters<FormApi['update']>[1],
	FormModel extends Model = FormApi extends Api<infer M> ? M : never,
> {
	redirectProtection?: () => boolean | undefined
	defaultData: () => FormData
	api: () => FormApi
	forceValues?: () => Record<string, any> | undefined
	populateForm?: (data: Partial<FormData> | Plain<FormModel>) => void
	attachTo?: () =>
		| Record<string, { method: 'associate' | 'syncWithoutDetaching'; id: string | number }>
		| undefined
	id?: Ref<PropertyType<FormModel, 'id'> | undefined | null>
	onStartLoading?: () => void
	onStopLoading?: () => void
	onSubmit?: () => void
	onSubmitError?: (error: unknown) => void
	onCreated?: (entity: Plain<FormModel>) => void
	onUpdated?: () => void
	onDeleted?: () => void
	formatOnCreate?: (data: FormData) => Parameters<FormApi['store']>[0]
	formatOnUpdate?: (data: FormData) => Parameters<FormApi['update']>[1]
}
```

The `FormOptions` interface defines the configuration for the `useForm` composable.

### Options

- **`redirectProtection`**
  - **Type:** `() => boolean | undefined`
  - **Default:** `() => true`
  - **Optional:** `true`
  - **Details:** When enabled, the composable will warn users about unsaved
  changes if they attempt to navigate away.

- **`defaultData`**
  - **Type:** `() => FormData`
  - **Details:** Function that returns the default form data used to initialize
  the form.

- **`api`**
  - **Type:** `() => FormApi`
  - **Details:** An API instance (extending the default CRUD API) used to
  communicate with your backend.

- **`forceValues`**
  - **Type:** `() => Record<string, any> | undefined`
  - **Optional:** `true`
  - **Details:** Additional values to merge with the form data on submit.

- **`populateForm`**
  - **Type:** `(data: Partial<FormData> | Plain<FormModel>) => void`
  - **Details:** A callback used to populate the form with data (typically when
  editing). If not provided, a default implementation will clone and update the
  form state.

- **`attachTo`**
  - **Type:** `() => Record<string, { method: 'associate' | 'syncWithoutDetaching'; id: string | number }> | undefined`
  - **Optional:** `true`
  - **Details:** Defines any relations to attach after a successful create or
  update operation. The key represents the relation name, and the value includes
  the relation method and the related model's identifier.

- **`id`**
  - **Type:** `Ref<PropertyType<FormModel, 'id'> | undefined | null>`
  - **Optional:** `true`
  - **Details:** A reactive reference to the identifier of the model being edited.
  If `id` is set (not `undefined` or `null`), the form will be in edit mode and
  will load the entity data when initialized. Use `toRef(props, 'id')` to create
  a reactive reference from a prop.

- **`onStartLoading`**
  - **Type:** `() => void | undefined`
  - **Details:** Callback fired before a loading operation begins.

- **`onStopLoading`**
  - **Type:** `() => void | undefined`
  - **Details:** Callback fired after a loading operation ends.

- **`onSubmit`**
  - **Type:** `() => void | undefined`
  - **Details:** Callback invoked after a successful create or update submission.

- **`onSubmitError`**
  - **Type:** `(error: unknown) => void`
  - **Optional:** `true`
  - **Details:** Receives the original error when a create or update submission
  fails, including validation, server, network, and relation-attachment errors.
  Use it to display a form-level message. Validation errors still populate
  `formErrors`. This callback does not handle initial loading or deletion errors.

- **`onCreated`**
  - **Type:** `(entity: Plain<FormModel>) => void | undefined`
  - **Details:** Callback invoked after a successful create operation.

- **`onUpdated`**
  - **Type:** `() => void | undefined`
  - **Details:** Callback invoked after a successful update operation.

- **`onDeleted`**
  - **Type:** `() => void | undefined`
  - **Details:** Callback invoked after a successful deletion.

- **`formatOnCreate`**
  - **Type:** `(data: FormData) => Parameters<FormApi['store']>[0]`
  - **Optional:** `true`
  - **Details:** A function that transforms the form data before it is sent to the
  API's `store` method. This is useful for custom data formatting, such as removing
  empty fields or transforming values. If not provided, the form data is sent as-is.

- **`formatOnUpdate`**
  - **Type:** `(data: FormData) => Parameters<FormApi['update']>[1]`
  - **Optional:** `true`
  - **Details:** A function that transforms the form data before it is sent to the
  API's `update` method. This is useful for custom data formatting, such as removing
  empty password fields when updating a user. If not provided, the form data is sent as-is.

## useForm Function

```typescript
export function useForm<
	FormApi extends Api<FormModel>,
	FormData extends Parameters<FormApi['store']>[0] | Parameters<FormApi['update']>[1],
	FormModel extends Model = FormApi extends Api<infer M> ? M : never,
>({
	redirectProtection = () => true,
	defaultData,
	api,
	id,
	forceValues,
	populateForm,
	attachTo,
	onStartLoading,
	onStopLoading,
	onSubmit,
	onSubmitError,
	onCreated,
	onUpdated,
	onDeleted,
	formatOnCreate,
	formatOnUpdate,
}: FormOptions<FormApi, FormData, FormModel>): {
	formData: Ref<FormData>
	loading: Ref<boolean>
	formErrors: Ref<Record<string, string>>
	reset: () => void
	submit: () => Promise<void>
	remove: () => Promise<void>
	isDirty: Ref<boolean>
	isEdit: Ref<boolean>
} { ... }
```

The `useForm` composable encapsulates the state and logic for handling forms. It
provides reactive references for the form data, loading state, and error messages,
along with functions to reset, submit, and remove records.

### Returned Properties and Methods

#### `formData`

- **Type:** `Ref<FormData>`
- **Details:** Holds the current state of the form. This reactive reference can
be used directly in your template for two-way binding.

#### `loading`

- **Type:** `Ref<boolean>`
- **Details:** Indicates whether a request (fetch, submit, or delete) is
currently in progress.

#### `formErrors`

- **Type:** `Ref<Record<string, string>>`
- **Details:** An object that maps field names to validation error messages.

#### `reset()`

- **Type:** `() => void`
- **Details:** Resets the form state:
  - In edit mode (when `id` is set), it fetches the latest details from the API.
  - Otherwise, it resets the form to the default state provided by `defaultData`.

#### `submit()`

- **Type:** `() => Promise<void>`
- **Details:** Submits the form data:
  - If in edit mode, it sends an update request.
  - Otherwise, it creates a new record.
  - After a successful operation, any defined callbacks (`onCreated`, `onUpdated`,
  `onSubmit`) are executed, and relations defined in `attachTo` are updated.
  - Submission errors are caught and passed to `onSubmitError` when provided.
  `onSubmit` is not called for a failed submission. A resolved `submit()` promise
  alone does not indicate success.

#### `remove()`

- **Type:** `() => Promise<void>`
- **Details:** Deletes the current record:
  - Prompts the user with a confirmation dialog before deletion.
  - On successful deletion, the `onDeleted` callback is executed.

#### `isDirty`

- **Type:** `Ref<boolean>`
- **Details:** A computed reference that returns `true` if the current form data
differs from the original (initial) form data.

#### `isEdit`

- **Type:** `Ref<boolean>`
- **Details:** A computed reference that returns `true` if the form is in edit
mode (i.e., when `id` is set and not `undefined` or `null`). This is automatically
computed based on whether the `id` option was provided.

## Internal Workings

The composable also defines several helper functions and lifecycle hooks to
manage its behavior:

### Lifecycle Hooks

- **`onBeforeMount`**
  - Adds a `beforeunload` event listener to warn users of unsaved changes (if
  redirect protection is enabled).
  - Calls `reset()` to initialize the form state.

- **`onUnmounted`**
  - Removes the `beforeunload` event listener.

- **`onBeforeRouteUpdate`**
  - Uses the `beforeRedirect` function to display a confirmation dialog if the
  form is dirty and redirect protection is enabled.

### Internal Functions

#### `beforeRedirect(next: () => void)`

- **Details:**
  Checks if the form has unsaved changes before allowing navigation. If changes
  exist, it uses a confirmation dialog (via PrimeVue’s `useConfirm`) to either
  allow or cancel the route change.

#### `getDetails()`

- **Returns:** A promise that resolves to the current model data.
- **Details:**
  Fetches the details for the record from the API when in edit mode, updating
  the loading state and calling any loading callbacks.

#### `create()`

- **Returns:** A promise that resolves to the newly created entity.
- **Details:**
  Sends a POST request using the API's `store` method. It merges any forced
  values with the current form data, applies the `formatOnCreate` function if
  provided, handles validation errors by populating `formErrors`, and calls the
  `onCreated` callback.

#### `update()`

- **Returns:** A promise that resolves to the updated entity.
- **Details:**
  Sends a PUT request using the API's `update` method. Similar to `create()`,
  it merges forced values, applies the `formatOnUpdate` function if provided,
  handles validation errors, and calls the `onUpdated` callback when successful.

#### `attachToAll(id: PropertyType<FormModel, 'id'>)`

- **Details:**
  If the `attachTo` option is provided, this function iterates over the related
  models to attach, calling the API’s `updateRelation` method for each.
