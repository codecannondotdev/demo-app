---
outline: 'deep'
---

# Frontend Models

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

As you can see, the model consists of 4 parts:
- The entity interface (`User`)
- The store payload interface (`UserStorePayload`)
- The update payload interface (`UserUpdatePayload`)
- The entity title (`title`)

## Entity Model

The entity interface defines the shape of a model entity returned by the database,
or in the frontend context, the API.

Models are defined using the `Model` type, which is a generic type that takes an
object with the model's `Column`s, `Relation`s and `Attribute`s as it's type parameter.

`Column`, `Relation` and `Attribute` are branded types and are used to empower
other helpers like the [Query Builder](/frontend/query-builder) and provide
type safety and auto completion in your IDE.

- See also
  - [Branded Types](https://www.learningtypescript.com/articles/branded-types)
  - [API - Model](/api/frontend/models)

### `Column`

The `Column` branded type, is used to define model columns. It's a generic type
that takes the column type as it's type parameter. You can define any valid JSON
type as the column type.

::: danger
Columns should never be optional, but should contain null in their brand
generic parameters.

BAD: `name?: Column<string>`
GOOD: `name: Column<string | null>`
:::

- Example:
  ```typescript
  import type { Model, Column } from '@/helpers/models/Model'

  export type UserModel = Model<{
    id: Column<number>
    name: Column<string>
    role: Column<'user' | 'admin'>
    verified: Column<boolean>
    created_at: Column<string>
    updated_at: Column<string>
  }>
  ```

- See also
  - [API - Column](/api/frontend/models#column)

### `Relation`
The `Relation` branded type, is used to define model relations. It's a generic
type that takes the related model type as it's type parameter.

When defining relations you can define a one-type or many-relation type by
using either `Model` or `Model[]` as the type parameter.

Relations must be defined as `camelCase`, but are returned as `snake_case` from
the API due to Laravel's naming conventions.

You can convert them to `snake_case` by using the [`Plain`](/frontend/model#plain-entity) helper below.

- Example:
  ```typescript
  import type { Model, Relation } from '@/helpers/models/Model'

  export type UserModel = Model<{
    id: Column<number>
    name: Column<string>
    posts: Relation<PostModel[]>
  }>
  ```

- See also
  - [API - Relation](/api/frontend/models#relation)

### `Attribute`

The `Attribute` branded type, is used to define model attributes. It's a generic
type that takes the attribute type as it's type parameter. You can define any
valid JSON type as the attribute type.

- Example:
  ```typescript
  import type { Model, Attribute } from '@/helpers/models/Model'

  export type UserModel = Model<{
    id: Column<number>
    is_active: Attribute<boolean>
  }>
  ```

- See also
  - [API - Attribute](/api/frontend/models#attribute)

## Store Payload

The store payload interface defines the shape of the store request payload. By
default, this is generated based on the model columns, and validators you define.

You can define any type of object as the Store Payload, as these parameters will
be passed through `axios` to your Laravel API.

- Example:
  ```typescript
  export interface UserStorePayload {
    name: string
    email: string
  }
  ```

- See also
  - [Axios Post Documentation](https://axios-http.com/docs/post_example)

## Update Payload

Like the store payload interface the update payload interface defines the shape
of the update request payload. By default, this is also generated based on the
model columns, and validators you define.

You can define any type of object as the Update Payload, as these parameters will
be passed through `axios` to your Laravel API.

- Example:
  ```typescript
  export interface UserUpdatePayload {
    name?: string
    email?: string
  }
  ```

- See also
  - [Axios Post Documentation](https://axios-http.com/docs/post_example) (should be the same for `PUT` requests)

## Plain Entity

The plain entity type is a helper type that extracts the model columns from the
model, and returns them as a plain object. This is useful when you need a type
for your entity without the Column/Relation/Attribute brands.

Additionaly, it also converts the relations to their plain types, so you can
easily use the entity in your application. The relation keys are also converted
from `camelCase` to `snake_case` - in line with the Laravel's API.

- Example:
  ```typescript
  import type { Model, Column, Attribute, Relation } from '@/helpers/models/Model'
  import type { PostModel } from '@/models/Post/Model'

  export type UserModel = Model<{
    name: Column<string>
    role: Column<'user' | 'admin'>
    verified: Column<boolean>
    shoe_size: Attribute<'XL' | 'L' | 'M' | 'S'>
    favoritePosts: Relation<PostModel[]>
    created_at: Column<string>
    updated_at: Column<string>
  }>

  export type User = Plain<UserModel>

  /**
   * The user type becomes:
   * type User = {
   *   id: number | string
   *   name: string
   *   role: 'user' | 'admin'
   *   verified: boolean
   *   shoe_size: 'XL' | 'L' | 'M' | 'S'
   *   favorite_posts: Post[] // This is the plain Post model type (Plain<PostModel>)
   *   created_at: string
   *   updated_at: string
   * }
   */

  const user: User = {
    id: 1,
    name: 'John Doe',
    role: 'user',
    verified: true,
    shoe_size: 'XL',
    favorite_posts: [],
    created_at: '2022-01-01',
    updated_at: '2022-01-01',
  }
  ```

  - See also
    - [API - Plain](/api/frontend/models#plain)

---

The interfaces for everything model related are defined explicitly, so you can
modify them per your needs as your application evolves. Everything is changable,
and all the helpers we'll look at next were designed with extension in mind.
