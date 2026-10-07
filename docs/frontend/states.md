---
outline: 'deep'
---

# States

When building applications, we found ourselves recreating the same logic over
and over again when storing and managing data from the API. We didn't love that
workflow, so we created a set of tools to help us manage the state of your
application.

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

## States vs. Stores

States are not a replacement for glbal stores like [Pinia](https://pinia.vuejs.org/)
or [Vuex](https://vuex.vuejs.org/), but rather composables that allow you to
reuse some common state logic accross your application.

States are designed to be created and discarded as needed, and are not meant to
exist globally, although there's nothing stopping you from doing so.

States are bound to a specific `Model` and it's corresponding `Api`, and provide
type safe APIs for managing the state of the model entities.

- See also
    - [Frontend - Models](/frontend/model)
    - [Frontend - Apis](/frontend/apis)

## Location

States are located in the `ui/src/models/{modelName}/State.ts` file.

By default 2 states are created for each model, a `DetailsState` and a `ListState`,
but you can create your own as you see fit and store them there.

## `ListState`

The `ListState` is a state that manages a list of items. It provides methods to
fetch the list form the API, and manage pagination information and loading states.

```typescript
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'
import { ref } from 'vue'
import type { Ref } from 'vue'
import QueryBuilder from './QueryBuilder'
import type { IApi } from './Api'
import type {
	FullLaravelPaginationMeta,
	MinimalLaravelPaginationMeta,
} from '@/interfaces/models/Laravel'
import type { Model as ModelType, Plain } from '@/helpers/models/Model'

export default class ListState<
	Api extends IApi<Model, ModelList>,
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model>,
> {
	api!: Api
	list: Ref<Array<Plain<Model>>> = ref([])
	pagination = ref(makeMinimalLaravelPaginationMeta())
	isLoaded: Ref<boolean> = ref(false)
	isLoading: Ref<boolean> = ref(false)
	defaultParams: Parameters<Api['list']>[0] = {}

	query() {
		return new ListStateQueryBuilder<Api, Model, ModelList>(this)
	}

	async getList(
		params: Parameters<Api['list']>[0] = {
			page: this.pagination.value.current_page,
		},
	) {
		if (this.isLoading.value) return
		params = { ...this.defaultParams, ...params }
		if (params.page === undefined) {
			params.page = this.pagination.value.current_page
		}
		this.isLoading.value = true
		try {
			const response = await this.api.list(params)
			this.list.value = response.data.data as Array<Plain<Model>>
			this.pagination.value = makeMinimalLaravelPaginationMeta(response.data)
			this.isLoaded.value = true
		} finally {
			this.isLoading.value = false
		}
	}

	clearList() {
		this.list.value = []
		this.isLoaded.value = false
		this.pagination.value = makeMinimalLaravelPaginationMeta()
	}
}

export function makeMinimalLaravelPaginationMeta(
	meta?: Partial<FullLaravelPaginationMeta>,
): MinimalLaravelPaginationMeta {
	return {
		current_page: meta?.current_page ?? 1,
		from: meta?.from ?? 1,
		last_page: meta?.last_page ?? 1,
		per_page: meta?.per_page ?? 0,
		to: meta?.to ?? 0,
		total: meta?.total ?? 0,
	}
}

class ListStateQueryBuilder<
	Api extends IApi<Model, ModelList>,
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model>,
> extends QueryBuilder<Model> {
	constructor(private listState: ListState<Api, Model, ModelList>) {
		super()
	}

	getList(params: Parameters<(typeof this.listState)['getList']>[0]) {
		return this.listState.getList({ filters: [this.getFilter()], ...params })
	}

	save() {
		this.listState.defaultParams.filters = [this.getFilter()]
	}
}
```

Above is a complete implementation of a `ListState` that manages a list of items
from the API.

We'll do a broad overview here, but you can find more detailed information in
the API section of the documentation.

- See also
    - [API - ListState](/api/frontend/list-state)

### Creating `ListState`

`ListState` is a composable and a list state is created like any other composable.

```typescript
import { usePostListState } from '@/models/Post/States'

const listState = usePostListState()
```

### `getList`

The `getList` method is used to fetch the list of items from the API. It takes
a bunch of different parameters (same as the [Api list method](/frontend/apis#list)),
and fetches a list of entities of the defined `Model` form the API.

```typescript
import { usePostListState } from '@/models/Post/State'

const listState = usePostListState()

await listState.getList()

// Log the list of posts stored in the state
console.log(listState.list.value)
```

The example above creates the state, then fetches the first list of posts from
the API.

We can define any other `Api.list` parameters in the `getList` method, and they
will be passed through to the API. For example, we can fetch the second page of
posts like this:

```typescript
await listState.getList({ page: 2 })
```

There are a few other use cases for the `getList` method that we'll look at now.
These have the same API as the underlying [`Api.list`](/frontend/apis#list) method.

#### Sorting

We provide API parameters that can be used to call `$query->orderBy()` on the
list of items returned by the `list` route.

We provide an `orderBy` and `order` parameter that can be used to sort the list
of items on all `list` routes and the `getList` method of the `ListState`.

```typescript
import PostListState from '@/helpers/states/PostListState'

const postListState = new PostListState()

await postListState.getList({
  orderBy: 'name',
  order: 'desc'
})

// Log the list of posts stored in the state
console.log(postListState.list.value)
```

#### Searching

We provide API parameters that can be used to do `LIKE` search on the
searchable columns of your models.

We provide a `search` parameter that can be used to search the list of items on
all `list` routes and the `getList` method of the `ListState`.

```typescript
import PostListState from '@/helpers/states/PostListState'

const postListState = new PostListState()

await postListState.getList({
  search: 'Lorem Ipsum',
})

// Log the list of posts stored in the state
console.log(postListState.list.value)
```

#### Filtering

We provide API parameters that can be used to filter the list of items returned
by the `list` route.

We provide a `filter` parameter that can be used to filter the list of items on
all `list` routes and the `getList` method of the `ListState`.

```typescript
import PostListState from '@/helpers/states/PostListState'

const postListState = new PostListState()

await postListState.getList({
  filter: new QueryBuilder().where('name', 'Lorem ipsum').getFilter()
})

// Log the list of posts stored in the state
console.log(postListState.list.value)
```

Or you can use the `ListState.query` method to build your query:

```typescript
import PostListState from '@/helpers/states/PostListState'

const postListState = new PostListState()

await postListState.query()
  .where('name', 'Lorem ipsum')
  .getList()

// Log the list of posts stored in the state
console.log(postListState.list.value)
```

You can also save the query to the `ListState` default params so it can be used
with every `getList` request:

```typescript
import PostListState from '@/helpers/states/PostListState'

const postListState = new PostListState()

postListState.query()
  .where('name', 'Lorem ipsum')
  .save()

await postListState.getList()

// Log the list of posts stored in the state
console.log(postListState.list.value)
```

- See also
  - [Frontend - Query Builder](/frontend/query-builder)

#### Appending relations

We provide API parameters that can be used to append relations to the list of
items returned by the `list` route.

We provide an `with` parameter that can be used to append relations to the list
of items on all `list` routes and the `getList` method of the `ListState`.

```typescript
import PostListState from '@/helpers/states/PostListState'

const postListState = new PostListState()

await postListState.getList({
  with: 'comments'
})

// Log the comments of the first post stored in the state
console.log(postListState.list.value[0].comments)
```

#### Filtering by relation

We provide API parameters that can be used to filter the list of items returned
by the `list` route by a relation. This is for example useful when you want to
get a list of comments for a specific post or want to get a list of tags that are
not attached to a specific post.

We provide `fromRelation` and `fromRelationId` parameters that can be used to filter
the list of items on all `list` routes and the `getList` method of the `ListState`.

You can use the `fromRelation` parameters on your frontend `ListState`
class instances:

```typescript
import CommentListState from '@/helpers/states/CommentListState'

const post = {
    id: 1
}

const commentListState = new CommentListState()

await commentListState.getList({
  fromRelation: {
    model: 'App\\Models\\Post',
    id: post.id,
    relation: 'comments'
  }
})

// Log the list of comments that belong to that post
console.log(commentListState.list.value)
```

Or the `notFromRelation` parameters on your frontend `ListState` class instances:

```typescript
import TagListState from '@/helpers/states/TagListState'

const post = {
    id: 1
}

const tagListState = new TagListState()

await tagListState.getList({
  notFromRelation: {
    model: 'App\\Models\\Post',
    id: post.id,
    relation: 'tags'
  }
})

// Log the list of tags that are not attached to that post
console.log(tagListState.list.value)
```

### `clearList`

The `clearList` method is used to clear the list of items stored in the state.

```typescript
import { usePostListState } from '@/models/Post/State'

const listState = usePostListState()

listState.clearList()
```

### `list`

The `list` property is a `Ref<Plain<Model>[]>` that stores the list of entities
fetched from the API.

Whenever you call `ListState.getList` the list of items is stored in this property.

```typescript
import { usePostListState } from '@/models/Post/State'

const listState = usePostListState()

// Log the list of posts stored in the state
console.log(listState.list.value)
```

### `pagination`

The `pagination` property is a `Ref<MinimalLaravelPaginationMeta>` that stores
the pagination information of the list of items fetched from the API.

Whenever you call `ListState.getList` the pagination information is stored in
this property.

By default, the pagination is set to page 1, so when you call `getList` without
parameters it will return the first page.

```typescript
import { usePostListState } from '@/models/Post/State'

const listState = usePostListState()

// Log the pagination information of the list of posts stored in the state
console.log(listState.pagination.value)
```

### `isLoaded`

The `isLoaded` property is a `Ref<boolean>` that indicates if the list of items
has been fetched from the API.

Whenever you call `ListState.getList` the `isLoaded` property is set to `true`.

Whenever you call `ListState.clearList` the `isLoaded` property is set to `false`.

This is useful when you - for example - want to show a skeleton loader only
the first time, before a list of items has been fetched from the api.

```typescript
import { usePostListState } from '@/models/Post/State'

const listState = usePostListState()

// Log if the list of posts has been fetched from the API
console.log(listState.isLoaded.value)
```

### `isLoading`

The `isLoading` property is a `Ref<boolean>` that indicates if the list of items
is currently being fetched from the API.

Whenever you call `ListState.getList` the `isLoading` property is set to `true`.

Whenever the list of items has been fetched from the API the `isLoading` property
is set to `false`.

This is useful when you - for example - want to show a loading spinner while
the list of items is being fetched from the API.

```typescript
import { usePostListState } from '@/models/Post/State'

const listState = usePostListState()

// Log if the list of posts is currently being fetched from the API
console.log(listState.isLoading.value)
```

### `defaultParams`

The `defaultParams` property is an object that stores the default parameters that
are passed to the `Api.list` method when calling `ListState.getList`.

It accepts all the same parameters that can be passed to `ListState.getList`.

This is useful when you want to set default parameters that are always passed to
the `Api.list` method when calling `ListState.getList`.

```typescript
import { usePostListState } from '@/models/Post/State'

const listState = usePostListState()

listState.defaultParams = {
    orderBy: 'name',
    order: 'desc'
}

await listState.getList()
```

### Review

The `ListState` is a powerful state that allows you to manage a list of items
from the API. It provides methods to fetch the list form the API, and manage
pagination information and loading states.

We didn't go over all the specifics, so if you'd like learn more about the api
you should check out the API documentation.

- See also
    - [API - ListState](/api/frontend/list-state)

## `DetailsState`

The `DetailsState` is a state that manages a single entity. It provides methods to
fetch the item form the API, update the item, and manage loading states.

The details state is often used in forms, details display views, or reusable
components that do something with a specific entity type like our `<ModelSelect>`
component.

- See also
  - [Frontend - Components](/frontend/components#modelselect)

The `DetailsState` is quite a bit simpler than the `ListState`:

```typescript
import type { IApi } from '@/helpers/models/Api'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Model as ModelType, Plain } from '@/helpers/models/Model'

export default class DetailsState<Api extends IApi<Model>, Model extends ModelType> {
	api!: Api
	isLoaded: Ref<boolean> = ref(false)
	isLoading: Ref<boolean> = ref(false)
	details: Ref<Plain<Model> | null> = ref(null)
	defaultParams: Parameters<Api['show']>[1] = {}

	async getDetails(id: Parameters<Api['show']>[0], params?: Parameters<Api['show']>[1]) {
		if (this.isLoading.value) return
		this.isLoading.value = true
		const response = await this.api.show(id, { ...this.defaultParams, ...params })
		this.details.value = response.data
		this.isLoading.value = false
		this.isLoaded.value = true
	}

	async update(params: Parameters<Api['update']>[1]) {
		if (!this.isLoaded.value || !this.details.value) return
		if (this.isLoading.value) return
		this.isLoading.value = true
		const response = await this.api.update(this.details.value.id, params)
		this.details.value = response.data
		this.isLoading.value = false
	}
}
```

Above is a complete implementation of a `DetailsState` that manages a single entity
from the API.

We'll do a broad overview here, but you can find more detailed information in
the API section of the documentation.

- See also
    - [API - DetailsState](/api/frontend/details-state)

### Creating `DetailsState`

`DetailsState` is a composable and a details state is created like any other composable.

```typescript
import { usePostDetailsState } from '@/models/Post/State'

const detailsState = usePostDetailsState()
```

### `getDetails`

The `getDetails` method is used to fetch the a single entity from the API.

Unlike the `ListSatate.getList` method, `DetailsState.getDetails` requires an
`id` parameter to fetch the entity.

```typescript
import { usePostDetailsState } from '@/models/Post/State'

const detailsState = usePostDetailsState()

await detailsState.getDetails(1)

// Log the post stored in the state
console.log(detailsState.details.value)
```

There is also another use case for the `getDetails` method that we'll look at now.
This has the same API as the underlying [`Api.list`](/frontend/apis#show) method.

#### Appending relations

We provide API parameters that can be used to append relations to the item
returned by the `show` route.

We provide an `with` parameter that can be used to append relations to the item
on all `show` routes.

```typescript
import PostDetailsState from '@/helpers/states/PostDetailsState'

const postDetailsState = new PostDetailsState()

await postDetailsState.getDetails(1, {
  with: 'comments'
})

// Log the post comments stored in the state
console.log(postDetailsState.details.value.comments)
```

### `clearDetails`

The `clearDetails` method is used to clear item stored in the state.

```typescript
import { usePostDetailsState } from '@/models/Post/State'

const detailsState = usePostDetailsState()

detailsState.clearDetails()
```

- See also
    - [API - DetailsState](/api/frontend/details-state)

### `update`

The `update` method is used to update the entity stored in the state.

Like `getDetails`, it accepts an `id` parameter, and an update payload that is
passed to the `Api.update` method.

```typescript
import { usePostDetailsState } from '@/models/Post/State'

const detailsState = usePostDetailsState()

await detailsState.getDetails(1)

await detailsState.update({
    name: 'New name'
})

// Log the updated post stored in the state
console.log(detailsState.details.value)
```

- See also
    - [API - DetailsState](/api/frontend/details-state)
    - [Frontend - Api.update](/frontend/apis#update)

### `details`

The `details` property is a `Ref<Plain<Model> | null>` that stores the entity
fetched from the API.

Whenever you call `DetailsState.getDetails` the entity is stored in this property.

```typescript
import { usePostDetailsState } from '@/models/Post/State'

const detailsState = usePostDetailsState()

// Log the post stored in the state
console.log(detailsState.details.value)
```

### `isLoaded`

The `isLoaded` property is a `Ref<boolean>` that indicates if the entity has been
fetched from the API.

Whenever you call `DetailsState.getDetails` the `isLoaded` property is set to `true`.

Whenever you call `DetailsState.clearDetails` the `isLoaded` property is set to `false`.

This is useful when you - for example - want to show a skeleton loader only the
first time, before an entity has been fetched from the api.

```typescript
import { usePostDetailsState } from '@/models/Post/State'

const detailsState = usePostDetailsState()

// Log if the post has been fetched from the API
console.log(detailsState.isLoaded.value)
```

### `isLoading`

The `isLoading` property is a `Ref<boolean>` that indicates if the entity is
currently being fetched from the API.

Whenever you call `DetailsState.getDetails` the `isLoading` property is set to `true`.

Whenever the entity has been fetched from the API the `isLoading` property is set
to `false`.

This is useful when you - for example - want to show a loading spinner while
the entity is being fetched from the API.

```typescript
import { usePostDetailsState } from '@/models/Post/State'

const detailsState = usePostDetailsState()

// Log if the post is currently being fetched from the API
console.log(detailsState.isLoading.value)
```

### `defaultParams`

The `defaultParams` property is an object that stores the default parameters that
are passed to the `Api.show` method when calling `DetailsState.getDetails`.

It accepts all the same parameters that can be passed to `DetailsState.getDetails`.

This is useful when you want to set default parameters that are always passed to
the `Api.show` method when calling `DetailsState.getDetails`.

```typescript
import { usePostDetailsState } from '@/models/Post/State'

const detailsState = usePostDetailsState()

detailsState.defaultParams = {
    with: ['comments']
}

await detailsState.getDetails(1)
```

### Review

The `DetailsState` is a powerful state that allows you to manage a single entity
from the API. It provides methods to fetch the item form the API, update the item,
and manage loading states.

We didn't go over all the specifics, so if you'd like learn more about the api
you should check out the API documentation.

- See also
    - [API - DetailsState](/api/frontend/details-state)
