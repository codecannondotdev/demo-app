---
outline: 'deep'
---

# APIs

Frontend APIs are helper files, that are used to communicate with the database.

Let's look at the `UsersApi` helper:

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

By default, model APIs extend the generic CRUD Api, that is supported out of the
box for all your modules. Let's take a quick look at what the default CRUD Api
offers and then talk about extensibility. We'll just look at the class for now
but you can check out the [Frontend API](/api/frontend/api) reference to go
into what all the interfaces mean and how they are designed.

```typescript
export default class Api<
	Model extends ModelType = ModelType,
	ModelList extends LaravelPaginationResponse<Model> = LaravelPaginationResponse<Model>,
	ModelStorePayload = Record<string, any>,
	ModelUpdatePayload = Record<string, any>,
> implements IApi<Model, ModelList, ModelStorePayload, ModelUpdatePayload>
{
	route: string = ''

	async list(
		params: {
			page?: number
			per_page?: number
			search?: string
			filters?: Filter[]
			orderBy?: keyof Model
			order?: 'asc' | 'desc'
			with?: WithParameterRelations<Model>[]
			fromRelation?: {
				model: string
				id: number | string
				relation: string
			}
			notFromRelation?: {
				model: string
				id: number | string
				relation: string
			}
		},
		options?: { signal?: AbortSignal },
	): Promise<AxiosResponse<ModelList>> {
		return await axios.post(`${apiUrl}/${this.route}/list`, params, { signal: options?.signal })
	}

	async show(
		id: PropertyType<Model, 'id'>,
		params?: {
			with?: WithParameterRelations<Model>[]
		},
		options?: { signal?: AbortSignal },
	): Promise<AxiosResponse<Plain<Model>>> {
		return await axios.get(`${apiUrl}/${this.route}/${id}`, { params, signal: options?.signal })
	}

	async store(params: ModelStorePayload): Promise<AxiosResponse<Plain<Model>>> {
		return await axios.post(`${apiUrl}/${this.route}`, params)
	}

	async update(
		id: PropertyType<Model, 'id'>,
		params: ModelUpdatePayload,
	): Promise<AxiosResponse<Plain<Model>>> {
		return await axios.put(`${apiUrl}/${this.route}/${id}`, params)
	}

	async updateRelation(
		id: PropertyType<Model, 'id'>,
		relation: string,
		params: UpdateRelationPayload,
	): Promise<AxiosResponse<Plain<Model>>> {
		return await axios.put(`${apiUrl}/${this.route}/${id}/${relation}`, params)
	}

	async destroy(id: PropertyType<Model, 'id'>): Promise<AxiosResponse<void>> {
		return await axios.delete(`${apiUrl}/${this.route}/${id}`)
	}
}
```

The default model Api offers all the functions you need to communicate with
default Laravel Resource Controller methods, but we've sprinkled some extra
functionality in these.

The methods you know and love:
- `list` (for fetching a list of models)
- `show` (for fetching a single model)
- `store` (for creating a model)
- `update` (for updating a model)
- `destroy` (for deleting a model)

Additional CRUD methods:
- `updateRelation` (for updating relations of a model)

## List

```typescript
class Api {
	async list(
		params: {
			page?: number
			per_page?: number
			search?: string
			filters?: Filter[]
			orderBy?: keyof Model
			order?: 'asc' | 'desc'
			with?: WithParameterRelations<Model>[]
			fromRelation?: {
				model: string
				id: number | string
				relation: string
			}
			notFromRelation?: {
				model: string
				id: number | string
				relation: string
			}
		},
		options?: { signal?: AbortSignal },
	): Promise<AxiosResponse<ModelList>> {
		return await axios.post(`${apiUrl}/${this.route}/list`, params, { signal: options?.signal })
	}
}
```

The `list` method is used to retrieve a list of models from the coresponding
`list` route and method in your Laravel Controller.

We upgraded the default Laravel Resource controller implementation, to give you
a lot more power when communicating with the API.

The `list` API and method allow you to write powerful queries from the comfort
of your Vue SPA, without the need to change your controllers. Since all of this
works over a normal REST API however, you can limit these functionalities on a
per-controller basis, add additional data scopes, permission checks or any other
logic you want on the API.

With this approach, you have a powerful API that covers most common use-cases
for data retrieval, an out of the box incredible external integrations API,
and full control over how these requests are implemented and processed on your
backend.

- Example

  ```typescript
  const users = await new UsersApi().list({ page: 1, per_page: 10 })
  ```

- See also:
  - [API - List](/api/frontend/api#list)

### Sorting

We provide API parameters that can be used to call `$query->orderBy()` on the
list of items returned by the `list` route.

We provide an `orderBy` and `order` parameter that can be used to sort the list
of items on all `list` routes.

```typescript
import PostApi from '@/helpers/api/PostApi'

const postApi = new PostApi()

const response = await postApi.list({
  orderBy: 'name',
  order: 'desc'
})

// Log the list of posts
console.log(response.data.data)
```

- See also:
  - [API - List](/api/frontend/api#list)

### Searching

We provide API parameters that can be used to do `LIKE` search on the
searchable columns of your models.

We provide a `search` parameter that can be used to search the list of items on
all `list` routes.

```typescript
import PostApi from '@/helpers/api/PostApi'

const postApi = new PostApi()

const response = await postApi.list({
  search: 'Lorem ipsum',
})

// Log the list of posts
console.log(response.data.data)
```

- See also:
  - [API - List](/api/frontend/api#list)

### Filtering

We provide API parameters that can be used to filter the list of items returned
by the `list` route.

We provide a `filter` parameter that can be used to filter the list of items on
all `list` routes.

```typescript
import PostApi from '@/helpers/api/PostApi'

const postApi = new PostApi()

const response = await postApi.list({
  filter: new QueryBuilder().where('name', 'Lorem ipsum').getFilter()
})

// Log the list of posts
console.log(response.data.data)
```

- See also
  - [Frontend - Query Builder](/frontend/query-builder)
  - [API - List](/api/frontend/api#list)

### Appending relations

We provide API parameters that can be used to append relations to the list of
items returned by the `list` route.

We provide an `with` parameter that can be used to append relations to the list
of items on all `list` routes.

```typescript
import PostApi from '@/helpers/api/PostApi'

const postApi = new PostApi()

const response = await postApi.list({
  with: ['comments']
})

// Log the list of posts
console.log(response.data.data)
```

- See also:
  - [API - List](/api/frontend/api#list)

### Filtering by relation

We provide API parameters that can be used to filter the list of items returned
by the `list` route by a relation. This is for example useful when you want to
get a list of comments for a specific post or want to get a list of tags that are
not attached to a specific post.

We provide `fromRelation` and `fromRelationId` parameters that can be used to filter
the list of items on all `list` routes.

```typescript
import CommentApi from '@/helpers/api/CommentApi'

const post = {
    id: 1
}

const commentApi = new CommentApi()

const response = await commentApi.list({
  fromRelation: {
    model: 'App\\Models\\Post',
    id: post.id,
    relation: 'comments'
  }
})

// Log the list of comments that belong to that post
console.log(response.data.data)
```

Or the `notFromRelation` parameters on your frontend `Api` class instances:

```typescript
import TagApi from '@/helpers/api/TagApi'

const post = {
    id: 1
}

const tagApi = new TagApi()

const response = await tagApi.list({
  notFromRelation: {
    model: 'App\\Models\\Post',
    id: post.id,
    relation: 'tags'
  }
})

// Log the list of tags that are not attached to that post
console.log(response.data.data)
```

- See also
  - [API - List](/api/frontend/api#list)

## Show

```typescript
class Api {
	async show(
		id: T['id'],
		params?: {
			with?: string[]
		},
	): Promise<AxiosResponse<T>> {
		return await axios.get(`${apiUrl}/${this.route}/${id}`, { params })
	}
}
```

The next method you have at your disposal is `show`. It's a lot less complicated
but still offers a useful helper you can use. The show method is used to retrieve
a single model from your API.

- Example

  ```typescript
  const user = await new UsersApi().show(1)
  ```

- See also
  - [API - Show](/api/frontend/api#show)

#### Appending relations

We provide API parameters that can be used to append relations to the item
returned by the `show` route.


We provide an `with` parameter that can be used to append relations to the item
on all `show` routes.

```typescript
import PostApi from '@/helpers/api/PostApi'

const postApi = new PostApi()

const response = await postApi.show(1, {
  with: ['comments']
})

// Log the post with comments
console.log(response.data)
```

- See also
  - [API - Show](/api/frontend/api#show)

## Store

```typescript
class Api {
	async store(params: TStorePayload): Promise<AxiosResponse<T>> {
		return await axios.post(`${apiUrl}/${this.route}`, params)
	}
}
```

The store method is used to create new models via your API. It's super simple
with the `StorePayload` defined in your frontend model being the only parameter.
You can pass in the values you want to use to create a new model and a new model
will be created for you.

- Example

  ```typescript
  const newUser = await new UsersApi().store({
    name: 'John Doe',
    email: 'john@example.com',
  })
  ```

- See also
    - [API - Store](/api/frontend/api#store)

## Update

```typescript
class Api {
	async update(id: T['id'], params: TUpdatePayload): Promise<AxiosResponse<T>> {
		return await axios.put(`${apiUrl}/${this.route}/${id}`, params)
	}
}
```

The update method is used to update existing models via your API. It's super simple
with the `id` and `UpdatePayload` defined in your frontend model being the only
parameters.

You can pass in the values you want to use to update an existing model and the model
will be updated for you.

- Example

  ```typescript
  const updatedUser = await new UsersApi().update(1, {
    name: 'Jane Doe',
  })
  ```

- See also
    - [API - Update](/api/frontend/api#update)

## Destroy

```typescript
class Api {
	async destroy(id: T['id']): Promise<AxiosResponse<void>> {
		return await axios.delete(`${apiUrl}/${this.route}/${id}`)
	}
}
```

The destroy method is used to delete models via your API. All you need to do is
provide the model `id` and the model will be deleted.

- Example

  ```typescript
  await new UsersApi().destroy(1)
  ```

- See also
    - [API - Destroy](/api/frontend/api#destroy)

## Update Relation

```typescript
class Api {
	async updateRelation(
		id: number | string,
		relation: string,
		params: UpdateRelationPayload,
	): Promise<AxiosResponse<T>> {
		return await axios.put(`${apiUrl}/${this.route}/${id}/${relation}`, params)
	}
}
```

The `updateRelation` method is the only non-standard Resource Controller method
that we provide. It's used to update a models relations with ease.

- Example

  ```typescript
  await new UsersApi().updateRelation(1, 'roles', {
    method: 'attach',
    params: [1, 2, 3],
  })
  ```

- See also
    - [API - Update Relation](/api/frontend/api#update-relation)

## New routes

As you can see, all of this functionality gives you great power directly from
the frontend, with all the safety and customizabillity of an API layer.

As a reminder, let's look at how a standard Api for a model that we just looked
at is defined.

```typescript
import type { User, UserStorePayload, UserUpdatePayload } from '@/models/User/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class UsersApi extends Api<
	User,
	LaravelPaginationResponse<User>,
	UserStorePayload,
	UserUpdatePayload
> {
	route = 'users'
}
```

Simple right? So why this intermediate class at all you might ask. Well, as our
applications grow, we usually need to add some new specialised API endpoints.
The Api file is the place where you can define the methods you want to use in
your views and other helpers to communicate with the API. You can think of it
sort of as a frontend controller.

For example, if we wanted to add an endpoint to wish a user a happy birthday,
we might add a frontend Api method to communicate with that endpoint like this:

```typescript
import type { User, UserStorePayload, UserUpdatePayload } from '@/models/User/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

const apiUrl = import.meta.env.VITE_API_URL // [!code ++]

export default class UsersApi extends Api<
	User,
	LaravelPaginationResponse<User>,
	UserStorePayload,
	UserUpdatePayload
> {
	route = 'users'

	async wishHappyBirthday(id: User['id']): Promise<AxiosResponse<void>> { // [!code ++]
		return await axios.post(`${apiUrl}/${this.route}/${id}/wish-happy-birthday`) // [!code ++]
	} // [!code ++]
}
```

Which we could then use like this, to wish user `1` a happy birthday:

```typescript
new UsersApi().wishHappyBirthday(1)
```
