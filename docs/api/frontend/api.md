---
outline: 'deep'
---

# APIs

Frontend APIs are helper files, that are used to communicate with the database.

## Default CRUD Api

By default, model APIs extend the generic CRUD Api, that is supported out of the
box for all your modules. Let's take a quick look at what the default CRUD Api
offers and then talk about extensibility. We'll just look at the class for now
but you can check out the technical reference to go into what all the interfaces
mean and how they are designed.

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

The list method is used to retrieve a list of models from the coresponding
`list` route and method in your Laravel Controller.

### `params.page`

- **Type**: `number | undefined`
- **Default**: `undefined`
- **Details**

  The `list` route is always paginated, and returns a `AxiosReponse<LaravelPaginationResponse<User>>`
  type, which is basically a standard laravel pagination response.

  The `page` parameter tells the API which page you want to fetch when making the
  request.

### `params.per_page`
- **Type**: `number | undefined`
- **Default**: `undefined`
- **Details**

  Like the `page` param, `per_page` works with the default Laravel pagination
  system, and tells the API how many models it should return in the response page.

### `params.search`
- **Type**: `string | undefined`
- **Default**: `undefined`
- **Details**

  The generated models support `LIKE` search out of the box on the searchable
  fields you define. If you want to filter your list of models using `LIKE`
  search, you can define your search string with the `search` parameter.

### `params.filters`
- **Type**: `Filter[] | undefined`
- **Default**: `undefined`
- **Details**

  Filters are the most powerful feature supported out of the box on all default
  controllers. They allow you to use the majority of Laravel Eloquent ORM's
  functionality, without ever leaving the comfort of your Vue app. We won't do a
  deep dive into how filters are used and defined here, but you can check out the
  [Query Builder docs](/frontend/query-builder) to learn more
  about the recommended way to use these.

- See also
    - [Essentials - Query Builder](/frontend/query-builder)
    - [API - Query Builder](/api/frontend/query-builder)

### `params.orderBy`

- **Type**: `keyof Model | undefined`
- **Default**: `undefined`

- **Details**

  The `orderBy` parameter tells the API which column the list should be ordered by.
  You an use any of the model columns for this, and it will be passed into the
  Eloquent `orderBy` method in the controller.

### `params.order`

- **Type**: `'asc' | 'desc' | undefined`
- **Default**: `undefined`

- **Details**

  The order tells the API if the list should be sorted in the ascending or descending
  order, and you can pass it `'asc'` or `'desc'` values, which will be provided
  as the second `orderBy` method parameter in the controller.

### `params.with`

- **Type**: `WithParameterRelations<Model>[] | undefined`
- **Default**: `undefined`

- **Details**

  We provide the with parameter to leverage the relation loading powers of Eloquent
  on the fly, and you can pass in an array of relation names of relations that you
  want to load on your list models, which will be passed to the Eloquent `with`
  method in the controller. You can retrieve multiple levels of relations by
  separating the relations with a `.`, for example: `posts.comments`.

### `params.fromRelation`

- **Type**: `{ model: string, id: number | string, relation: string } | undefined`
- **Default**: `undefined`

- **Details**

  The **fromRelation** allows you to retrieve a lsit of models from another model's
  relation. For example, if we have a User which hasMany Books, we can get all the
  Books from that user. We won't do a deep dive here, but you can check out the
  helpers documentation for more details.

### `params.notFromRelation`

- **Type**: `{ model: string, id: number | string, relation: string } | undefined`
- **Default**: `undefined`

- **Details**

  The **notFromRelation** allows you to retrieve a lsit of models NOT in another
  models relation. For example, if we have a User which hasMany Books, we can get
  all the Books that AREN'T from that user. We won't do a deep dive here, but you
  can check out the helpers documentation for more details.

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

The show method is used to fetch a single model from the API.

### `id`

- **Type**: `Model['id']`
- **Details**

  The `id` parameter is the id of the model you want to fetch from the API.

### `params.with`

- **Type**: `WithParameterRelations<Model>[] | undefined`
- **Default**: `undefined`

- **Details**

  We provide the with parameter to leverage the relation loading powers of Eloquent
  on the fly, and you can pass in an array of relation names of relations that you
  want to load on your list models, which will be passed to the Eloquent `with`
  method in the controller. You can retrieve multiple levels of relations by
  separating the relations with a `.`, for example: `posts.comments`.

## Store

```typescript
class Api {
	async store(params: TStorePayload): Promise<AxiosResponse<T>> {
		return await axios.post(`${apiUrl}/${this.route}`, params)
	}
}
```

The store method is used to create new models via your API.

### params

- **Type**: `ModelStorePayload`

- **Details**

  ModelStorePayload is the interface that you define in your frontend model to
  represent the shape of your store requests.

  The params are the model values you want to use to create a new model.


## Update

```typescript
class Api {
	async update(id: T['id'], params: TUpdatePayload): Promise<AxiosResponse<T>> {
		return await axios.put(`${apiUrl}/${this.route}/${id}`, params)
	}
}
```

The update method is used to update existing models via your API.

### `id`

- **Type**: `Model['id']`

- **Details**

  The `id` parameter is the id of the model you want to update.

### `params`

- **Type**: `ModelUpdatePayload`

- **Details**

  ModelUpdatePayload is the interface that you define in your frontend model to
  represent the shape of your update requests.

  The params are the model values you want to use to update an existing model.


## Destroy

```typescript
class Api {
	async destroy(id: T['id']): Promise<AxiosResponse<void>> {
		return await axios.delete(`${apiUrl}/${this.route}/${id}`)
	}
}
```

The destroy method is used to delete models via your API.

### `id`

- **Type**: `Model['id']`

- **Details**

  The `id` parameter is the id of the model you want to delete.

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

The `updateRelation` method is used to update relations on your model via your
API.

### `id`

- **Type**: `number | string`

- **Details**

  The `id` of the model whose relation you want to update.

### `relation`

- **Type**: `string`

- **Details**

  The name of the relation you want to update

### `params`

- **Type**: `UpdateRelationPayload`

- **Details**

  The parameters for the update, the inteface for which looks like this:
  ```typescript
  export interface UpdateRelationPayload {
    method:
      | 'attach'
      | 'detach'
      | 'associate'
      | 'dissociate'
      | 'sync'
      | 'toggle'
      | 'syncWithoutDetaching'
    params: Array<string | number>
  }
  ```

### `params.method`

- **Type**: `'attach' | 'detach' | 'associate' | 'dissociate' | 'sync' | 'toggle' | 'syncWithoutDetaching'`

- **Details**

  The `method` param specifies which Eloquent relation updating method you want
  to use, while the `params` param specifies which related models you want to
  add, remove or sync or toggle on the given relation. We won't do a deep dive here
  but you can check out our technical reference to see how this works.

### `params.params`

- **Type**: `Array<string | number>`

- **Details**

  The `params` param is an array of related model ids that you want to
  add, remove or sync or toggle on the given relation.
