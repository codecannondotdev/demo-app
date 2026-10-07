---
outline: 'deep'
---

# Architecture

We designed the architecture of codecannon apps to be as simple as possible, while
still providing all the flexibilty you need to build your app.

The goal of codecannon apps is to get you started and accelerate you development
and get you to ship your app as fast as possible. We want you to focus on the
features that provide value to your users, and offer you reusable and extandable
components to do so.

We ship all the code used in codecannon apps, directly in the repository so you
can always customize and don't need to rely on obscure proprietary packages.
Nothing is hidden, everything is documented to the best of our ability.

## Frontend

The frontend is separated along these 3 main parts:
- Views
- Reusable Components
- Business Logic

### Views

codecannon apps are split into Modules (e.g. User, Post, Comment, etc.). Each module
is further split into 2 views.

#### List
The list view is used to display a list of entities from the module. It's
a simple table view with pagination and a create form to create new entities

- See also
    - [Frontend - List View](/generated-files/frontend/views/list)

#### Edit
The edit view is used to edit individual entities from the module. It contains
a form to edit the entity properties, and relation widgets to edit the entity
relations

- See also
    - [Frontend - Edit View](/generated-files/frontend/views/edit)

### Reusable Components

Depending on the module specification, the modules ship with a number reusable
components.

Reusable components are designed to be used accross the app, and are self contained
to the extent it makes sense for them to be so.

Most of the configuration can be done via props, in general, these components
are tied to a specific module or relation. This design allows us to keep the
components consistent and reusable, while enabling comples modifications in special
cases on the level of individual components.

Let's take a look at each of these individually.

#### Form

Each mdoule ships with a form component, that is used to create and edit entities
from the module. The form component is generated based on the model definition.

It's tipically used on the List and Edit views, but you can use it anywhere
you like.

It's designed to be used as a form widget, or as a form dialog, depending on
what your use-case requires. By default, the form is used in widget mode on the
List view, and in dialog mode on the Edit view.

The form uses a shared form composable on the inside to allow easy changes to
the behavior of all forms, but is built in a way that makes custom implementations
or modifications straightforward. Each form is generated for a specific model,
to allow for individual customization.

- See also
    - [Frontend - Form](/generated-files/frontend/components/form)

#### Header

Each module ships with a header component, that is used to display the module
name and action buttons on the List and Edit views.

The header is a simple component shared within both views of the module. A header
is generated for each module, to allow for individual customization.

- See also
    - [Frontend - Header](/frontend/components#header)

#### Relation Widgets

Depending on the module specification, the module may ship with relation widgets.
They are tipically displayed on the edit page, but like everything else you can
move them to any context you like.

Relation widgets allow you to edit the relations of an entity.

Depending on the type of the relation, different widgets will be generated.

All widgets follow the same patterns, differing only in relation types and
related models used in them.

The relation widgets also contain a form component in dialog mode, to allow for
creation of new related entities.

- See also
    - [Frontend - Relation Widgets](/generated-files/frontend/components/relation-widgets)

#### Relation Add Dialogs

Depending on the module specification, the module may ship with relation add dialogs.
They are tipically displayed on the edit page, but like everything else you can
move them to any context you like.

Relation add dialogs allow you to add new relations to an entity. They are used
for many-to-many and many-to-one relations.

All relation add dialogs follow the same patterns, differing only in relation
types and related models used in them.

- See also
    - [Frontend - Relation Add Dialogs](/generated-files/frontend/components/relation-add-dialogs)

### Business Logic

It's no secret that we love Laravel. We love the patterns laravel introduces,
but we also love Vue.js, and prefer the UI to be built as Vue.js SPAs.

Building SPAs is traditionally a bit complex, but we've made it simple. We've
created simple patterns to communicate between the frontend and the backend,
providing as much functionality of Laravel to frontend developers, while keeping
a clear sparation between the Frontend and the API.

#### Models

We love Laravel models and the Eloquent ORM, and we wanted to bring as much of
it's power to frontend developers as possible. Similar to Laravel, the codecannon
frontend also defines TypeScript models, which represent your database tables,
and their coresponding objects. We leverage these models, to provide type safety
and seamless communication with your Laravel APIs.

Example User model:

```typescript
import type { Column, Model, Plain } from '@/helpers/models/Model'

export interface UserStorePayload {
	name: string
	email: string
}

export interface UserUpdatePayload {
	name?: string
	email?: string
}

export type UserModel = Model<{
	id: Column<number>
	name: Column<string>
	email: Column<string>
	role: Column<'user' | 'admin'>
	verified: Column<boolean>
	created_at: Column<string>
	updated_at: Column<string>
}>

export type User = Plain<UserModel>
```

- See also
    - [Frontend - Models](/frontend/model)
    - [API - Model](/api/frontend/models)

#### APIs

Frontend APIs are helper files, that are used to communicate with the Laravel API.

Example User api:

```typescript
import type { UserModel, UserStorePayload, UserUpdatePayload } from '@/models/User/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class UsersApi extends Api<
	UserModel,
	LaravelPaginationResponse<UserModel>,
	UserStorePayload,
	UserUpdatePayload
> {
	route = 'users'
}
```

This helper will provide you with methods for:
- Getting a list of users
- Getting a single user
- Creating a user
- Updating a user
- Deleting a user
- Updating the user's relations

- See also
    - [Frontend - APIs](/frontend/apis)
    - [API - Api](/api/frontend/api)

#### States

States are reusable state composables, which combine the models and APIs and add
a state management layer on top of them.

They are used to manage states like lists (a list of entities) or details (a
single entity) in views and components.

They offer helper methods to interact with the API, and manage their state on the
frontend.

Example User state:

```typescript
import type { UserModel } from '@/models/User/Model'
import UsersApi from '@/models/User/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class UserDetailsState extends DetailsState<UsersApi, UserModel> {
	api = new UsersApi()
}

export function useUserDetailsState() {
	return new UserDetailsState()
}

export class UserListState extends ListState<
	UsersApi,
	UserModel,
	LaravelPaginationResponse<UserModel>
> {
	api = new UsersApi()
}

export function useUserListState() {
	return new UserListState()
}
```

This state provides the default ListState and DetailsState for the User model.

Example usage:

```typescript
import { useUserListState } from '@/states/User'

// Create the state
const userListState = useUserListState()

// Load a list of users
await userListState.getList({ per_page: 10 })

// Access the loaded list, pagination state, loading state, etc.
console.log(userListState.list)
console.log(userListState.pagination)
console.log(userListState.loading)
console.log(userListState.loaded)
```

- See also
    - [Frontend - States](/frontend/states)
    - [API - ListState](/api/frontend/list-state)
    - [API - DetailsState](/api/frontend/details-state)

#### Form utils

We provide a reusable form composable `useForm`, which provides a bunch of
functionality out of the box, like:
- API form validation and input error messages
- Form submission and loading state
- Form reset and clear methods
- Form lifecycle hooks
- Redirect protection
- Relation updating
- Input hiding
- Value forcing

Example usage:

```typescript
const { formData, loading, formErrors, reset, isEdit } = useForm({
	api: () => new UsersApi(),
	defaultData: () => ({
		email: '',
	}),
	forceValues: () => props.forceValues,
	attachTo: () => props.attachTo,
	id: toRef(props, 'id'),
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onSubmit: () => emit('submit'),
	onCreated: (entity) => {
		if (props.shouldRedirect) {
			router.replace({ name: 'users-list', params: { id: entity!.id } })
		}
		emit('created')
	},
	onUpdated: () => emit('updated'),
	onDeleted: () => emit('deleted'),
})
```

Form components use this composable to provide a consistent form experience.

In the case of forms we opted for more reusability and less generated code since
these common features are usually shared accross all forms and it's easier to
add functionality to all forms at once by updating the composable.

If you need special functionality in your form, you can use only part of this
composable, or remove it altogether and handle the business logic in the component
as you see fit.

- See also
    - [Frontend - Form Utils](/frontend/form-utils)
    - [API - `useForm`](/api/frontend/use-form)

#### Query Builder

We provide a query builder designed to work with our custom Laravel API. It
allows you to use the power of Eloquent when fetching lists of entities.

It's built on top of models, and provides a simple API for writing queries,
which gets translated 1:1 to the Laravel Eloquent query builder on the backend.

Since we have Models, the query builder is type safe, and provides code completion.

Example usage:

```typescript
import { useUserListState } from '@/states/User'

// Create a List state
const userListState = useUserListState()

// Define a default query and save it to the state
userListState.query().whereHas('role', (q) => {
    q.where('name', 'admin')
}).save()

// Fetch the list using the default query
await userListState.getList()

// Console log the admin users
console.log(userListState.list)
```

- See also
    - [Frontend - Query Builder](/frontend/query-builder)
    - [API - `QueryBuilder`](/api/frontend/query-builder)

## Backend

The generated backend contains a complete CRUD setup designed to work seamlessly
with the frontend.

### Migrations

The backend ships with a complete set of migrations for each module. The migrations
are generated based on your app specification.

- See also
    - [Backend - Migrations](/generated-files/backend/migrations)

### Routes

The backend ships with a complete set of routes for each module. The routes are
designed to work with the frontend APIs, and provide a simple RESTful API for
the frontend to communicate with.

- See also
    - [Backend - Routes](/generated-files/backend/routes)

### Models

The backend ships with a model for each module. The models are generated based
on your app specification.

They include:
- `$guarded` properties
- `$casts` properties
- `$searchable` properties
- Relations

- See also
    - [Backend - Models](/generated-files/backend/models)
    - [Backend - Searchable](/backend/searchable)

### Controllers

The backend ships with a complete CRUD controller for each module. The controllers
use our CRUD helper by default to provide the functionality the frontend relies
upon.

Example `show` method:

```php
<?php

// ...

/**
 * Display the specified resource.
 */
public function show(App $entity)
{
    return $this->crudControllerHelper->show($entity);
}

// ...
```

`show` method in the `crudControllerHelper`:

```php
<?php

// ...

/**
 * Display the specified resource.
 */
public function show(Model $entity)
{
    if (! is_null(request('with'))) {
        $entity->load(request('with'));
    }

    return $entity;
}

// ...

```

- See also

The controllers are designed in a way that allows you to easily extend or modify
them and use only the parts of the CRUD helper you need as your app grows.

- See also
    - [Backend - CRUD Controllers](/backend/crud-controllers)
    - [Generated Files - Controllers](/generated-files/backend/controllers)

### Store/Update Requests

The backend ships with a complete set of store and update requests for each module.

The requests are generated based on your app specification with all validators
included.

- See also
    - [Backend - Store/Update Requests](/generated-files/backend/requests)

### CRUD Controller Helper

As mentioned above, the controllers use our CRUD helper to provide the functionality
the frontend relies upon.

The CRUD helper is a simple class that provides the following methods:
- `list`
- `show`
- `store`
- `update`
- `destroy`
- `updateRelation`

- See also
    - [Backend - CRUD Helper](/backend/crud-controller-helper)


## Additional Configuration

### Authentication

The frontend and backend shipe with authentication set up. The frontend uses
a custom implementation, while the backend uses Laravel Sanctum and Fortify.

- See also
    - [Authentication](/essentials/authentication)

### User Management

The apps ship with a default User module, which includes the backend User setup,
which is ties into the authentication system, while the frontend features a
User module visible to Admins, and account settings for all users.

- See also
    - [Backend - User Management](/essentials/user-management)

### Login/Registration

The apps ship with a working email login/registration/verification system, based
on the Laravel Fortify and Santcum packages and some custom implementation. The
frontend also features route guards to protect routes from unauthorized access.

- See also
    - [Login/Registration](/essentials/login-registration)

### Linters, Formatters, Testing, CI/CD

The apps ship with a complete set of linters, formatters, test environments, and
CI/CD setup for Github Actions. These tools are set up to run on every pull
request and merge into master.

- See also
    - [Backend - Linters](/essentials/linters)
    - [Backend - Formatters](/essentials/formatters)
    - [Backend - Testing](/essentials/testing)
    - [Backend - CI/CD](/essentials/ci-cd)

### Docker

The apps ship with a complete Docker setup, which allows you to run the app
locally, and deploy it to any server that supports Docker with minimal configuration.

- See also
    - [General - Docker](/essentials/docker)

### Kubernetes

The apps ship with a complete Kubernetes setup, which allows you to deploy the
app to any Kubernetes cluster with minimal configuration.

- See also
    - [General - Kubernetes](/essentials/kubernetes)
