---
outline: 'deep'
---

# Form utils

codecannon apps ship with some helpers to help you build forms more easily.

## `useForm`

The `useForm` hook is a helper that helps you manage form state and validation.

For useForm, we won't go into the complete implementation here as it's quite
complex, but we'll show you how to use it.

You can always find the complete composable in `ui/src/helpers/form.ts`

### Basic usage

Minimal usage example of the useForm composable:

```typescript
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const { formData, loading } = useForm({
	api: () => new UsersApi(),
	defaultData: () => ({
		email: '',
	}),
})
```

The `useForm` hook takes an object with the following properties:

- `api`: The API class that the form will use to submit data.
- `defaultData`: A function that returns the default form data.

The `useForm` composable returns an object with the following properties:

- `formData`: The form data object.
- `loading`: A boolean that indicates if the form is currently submitting.

- See also
  - [API - api](/api/frontend/use-form#api)
  - [API - defaultData](/api/frontend/use-form#defaultdata)
  - [API - formData](/api/frontend/use-form#formdata)
  - [API - loading](/api/frontend/use-form#loading)

### Editing

If you're editing an existing resource, you can pass the `id` property to the
`useForm` composable. The composable will automatically determine if the form
is in edit mode based on whether `id` is set. Doing so will load the entity
when the form is created, and will allow you to update the entity using the
submit function.

```typescript
import { toRef } from 'vue'
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const props = defineProps<{
    id?: number
}>()

const { formData, loading, isEdit } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
    }),
    id: toRef(props, 'id'),
})
```

- See also
  - [API - isEdit](/api/frontend/use-form#isedit)
  - [API - id](/api/frontend/use-form#id)

### Submitting

To submit the form, you can call the `submit` function that the `useForm`
composable returns. The function will automatically determine whether to create
or update the entity based on whether an `id` was provided (edit mode) or not
(create mode).

```typescript
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const { formData, loading, submit } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
    }),
})

const handleSubmit = async () => {
    await submit()
}
```

- See also
  - [API - submit](/api/frontend/use-form#submit)

### Validation

The `useForm` composable automatically works with Laravel backend validation.

If the backend returns validation errors, the `formErrors` object will be
populated with the errors. The keys in the `formErrors` object correspond to
the form fields, while the value will be the first field error.

You can pass the form errors to the `FormInput` commponent to display the
errors.

```typescript
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const { formData, loading, formErrors, submit } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
    }),
})

const handleSubmit = async () => {
    await submit()
    if (Object.keys(formErrors).length > 0) {
        console.log('Form has errors')
    }
}
```

- See also
  - [FormInput Documentation](/frontend/components#forminput)
  - [API - formErrors](/api/frontend/use-form#formerrors)

### Submission errors

Use `onSubmitError` to display a message when a create or update submission fails.
It receives the original error, including network and server errors that do not
produce field-level validation messages.

```typescript
import { ref } from 'vue'
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const saveError = ref('')

const { formData, loading, formErrors, submit } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
    }),
    onSubmit: () => {
        saveError.value = ''
    },
    onSubmitError: () => {
        saveError.value = 'Could not save. Please try again.'
    },
})
```

Render `saveError` in your form and keep using `formErrors` for field validation.
`submit()` catches submission errors, so a resolved promise does not guarantee
that the save succeeded. Use `onSubmit` for success and `onSubmitError` for failure.
The error hook does not handle initial loading or deletion failures.

### Resetting

You can reset the form data by calling the `reset` function that the `useForm`
composable returns.

If the form is in edit mode, the form data will be reset to the original entity
data. If the form is not in edit mode, the form data will be reset to the default
data defined in the `defaultData` property.

```typescript
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const { formData, loading, reset } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
    }),
})

const handleReset = () => {
    reset()
}
```

- See also
  - [API - reset](/api/frontend/use-form#reset)

### Removing

If you want to remove an entity, you can call the `remove` function that the
`useForm` composable returns.

The user will be prompted to confirm the removal, and if they confirm, the
entity will be removed.

```typescript
import { toRef } from 'vue'
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const props = defineProps<{
    id?: number
}>()

const { formData, loading, remove } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
    }),
    id: toRef(props, 'id'),
})

const handleRemove = async () => {
    await remove()
}
```

- See also
  - [API - remove](/api/frontend/use-form#remove)

### Redirect protection

If you want to protect the user from accidentally navigating away from the form
when they have unsaved changes, you can use the `redirectProtection` option.
It accepts a function that returns a boolean (`true` is the default).

When redirect protection is enabled, the user will be prompted to confirm if
they want to navigate away from the form when they have unsaved changes.

```typescript
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const { formData, loading } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
    }),
    redirectProtection: () => true, // default, can be omitted
})
```

To conditionally disable redirect protection:

```typescript
const shouldProtect = ref(true)

const { formData, loading } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
    }),
    redirectProtection: () => shouldProtect.value,
})
```

- See also
  - [API - redirectProtection](/api/frontend/use-form#redirectprotection)

### Attaching to other entities

If you want to attach the form to another entity, when the form is submitted
you can pass the `attachTo` property to the `useForm` composable.

```typescript
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const { formData, loading } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
    }),
    attachTo: () => ({
      post: { method: 'associate', id: 1 },
    }},
})
```

- See also
  - [API - attachTo](/api/frontend/use-form#attachto)

### Forcing Values

If you want to force a value for a field, you can pass the `forceValues` property
to the `useForm` composable.

This is useful when you want to set a value for a field that is not in the form
or hidden in the form.

```typescript
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const { formData, loading } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
    }),
    forceValues: () => ({
      apartment_id: 1,
    }),
})
```

- See also
  - [API - forceValues](/api/frontend/use-form#forcevalues)

### Custom Form Population

If you need custom logic when populating the form (e.g., when loading entity data
for editing), you can pass the `populateForm` option. The composable will
automatically track the original form state after your callback runs, so
dirty-checking continues to work correctly.

```typescript
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const { formData, loading } = useForm({
    api: () => new UsersApi(),
    defaultData: () => ({
        email: '',
        displayName: '',
    }),
    populateForm: (data) => {
        formData.value.email = data.email ?? ''
        formData.value.displayName = `${data.first_name} ${data.last_name}`
    },
})
```

If `populateForm` is not provided, the default behavior clones the incoming data
into `formData`, only setting keys that already exist in the default data.

- See also
  - [API - populateForm](/api/frontend/use-form#populateform)

### Formatting Form Data

You can customize how form data is formatted before it's sent to the API using the
`formatOnCreate` and `formatOnUpdate` options. This is particularly useful for
handling special cases like password fields where empty values should be removed.

```typescript
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const { formData, loading, submit } = useForm({
	api: () => new UsersApi(),
	defaultData: () => ({
		email: '',
		password: '',
	}),
	formatOnUpdate: (params) => {
		// Remove empty password field so it's not sent to the API
		if (params.password === '') {
			params.password = undefined
		}
		return params
	},
})
```

The `formatOnCreate` function is called before creating a new entity, while
`formatOnUpdate` is called before updating an existing entity. Both functions
receive the form data as a parameter and should return the formatted data.

- See also
  - [API - formatOnCreate](/api/frontend/use-form#formatoncreate)
  - [API - formatOnUpdate](/api/frontend/use-form#formatonupdate)

### Hooks

The `useForm` composable also provides hooks that you can use to perform actions
when certain events occur.

Hooks available are:
- `onStartLoading` - Called when the form enters the loading state.
- `onStopLoading` - Called when the form finishes the loading state.
- `onSubmit` - Called after a successful create or update submission.
- `onSubmitError` - Called with the original error when a submission fails.
- `onCreated` - Called when the form creates a new entity.
- `onUpdated` - Called when the form updates an entity.
- `onDeleted` - Called when the form removes an entity.

```typescript
import UsersApi from '@/models/User/Api'
import { useForm } from '@/helpers/form'

const { formData, loading, submit } = useForm({
	api: () => new UsersApi(),
	defaultData: () => ({
		email: '',
	}),
	onStartLoading: () => {
		console.log('Form is loading')
	},
	onStopLoading: () => {
		console.log('Form has stopped loading')
	},
	onSubmit: () => {
		console.log('Form has been submitted')
	},
	onSubmitError: (error) => {
		console.error('Form submission failed', error)
	},
	onCreated: () => {
		console.log('Entity has been created')
	},
	onUpdated: () => {
		console.log('Entity has been updated')
	},
	onDeleted: () => {
		console.log('Entity has been deleted')
	},
})
```

- See also
  - [API - onStartLoading](/api/frontend/use-form#onstartloading)
  - [API - onStopLoading](/api/frontend/use-form#onstoploading)
  - [API - onSubmit](/api/frontend/use-form#onsubmit)
  - [API - onSubmitError](/api/frontend/use-form#onsubmiterror)
  - [API - onCreated](/api/frontend/use-form#oncreated)
  - [API - onUpdated](/api/frontend/use-form#onupdated)
  - [API - onDeleted](/api/frontend/use-form#ondeleted)
