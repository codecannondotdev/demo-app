---
outline: 'deep'
---

# Models

Models on the frontend are essentially a TypeScript type.

This page contains a reference to the collection of types that comprise or are
used to work with models.

- See also
  - [Frontend - Models](/frontend/model)
  - [TypeScript Brands](https://www.learningtypescript.com/articles/branded-types)

## `Column`

```typescript
/**
 * Brand type for model columns
 *
 * @example
 * type MyModel = Model<{
 *   name: Column<string>
 * }>
 */
export type Column<T extends string | number | boolean | null = string | number | boolean | null> =
	Branded<T, 'Model.Column'>
```
- **Description**: A model column is a branded type that represents a column in a model.

## `Attribute`

```typescript
/**
 * Brand type for model attributes
 *
 * @example
 * type MyModel = Model<{
 *  name: Attribute<string>
 * }>
 */
export type Attribute<
	T extends string | number | boolean | null = string | number | boolean | null,
> = Branded<T, 'Model.Attribute'>
```
- **Description**: A model attribute is a branded type that represents an attribute in a model.

## `Relation`

```typescript
/**
 * Brand type for model relations
 *
 * @example
 * type MyModel = Model<{
 *  user?: Relation<User>
 * }>
 */
export type Relation<T extends Model | null = Model | null> = Branded<T, 'Model.Relation'>
```
- **Description**: A model relation is a branded type that represents a relation in a model.

## `Model`

```typescript
/**
 * Model type that holds columns, attributes, and relations
 *
 * @example
 * type MyModel = Model<{
 *  name: Column<string>
 *  age: Attribute<number>
 *  user?: Relation<User>
 * }>
 */
export type Model<
	ModelProperties extends {
		[key: string]: Column | Attribute | Relation<Model | null> | Relation<Model>[] | undefined
	} = {
		[key: string]: Column | Attribute | Relation<Model | null> | Relation<Model>[] | undefined
	},
> = {
	id: Column<string | number>
} & Omit<ModelProperties, 'id'>
```
- **Description**: A model is a type that defines a model's structure. Models
are objects comprised of columns, attributes, and relations.
- **Usage**:
  ```typescript
  type UserModel = Model<{
    id: Column<number>
    name: Column<string>
    age: Attribute<number>
    posts?: Relation<Post>[]
  }>
  ```

## `ModelColumnKey`

```typescript
/**
 * Get the column keys of a model
 *
 * @example
 * type MyModelColumnKey = ModelColumnKey<MyModel>
 */
export type ModelColumnKey<M extends Model> = Exclude<
	{
		[K in keyof M]: M[K] extends Column ? K : never
	}[keyof M],
	undefined
>
```
- **Description**: The `ModelColumnKey` type is a utility type that extracts the
column keys of a model.
- **Usage**:
  ```typescript
  type PostModel = Model<{
    id: Column<number>
    title: Column<string>
    content: Column<string>
    rating: Attribute<number>
    creator: Relation<User>
  }>

  type MyModelColumnKey = ModelColumnKey<PostModel>
  // MyModelColumnKey = 'id' | 'title' | 'content'
  ```

## `ModelAttributeKey`

```typescript
/**
 * Get the attribute keys of a model
 *
 * @example
 * type MyModelAttributeKey = ModelAttributeKey<MyModel>
 */
export type ModelAttributeKey<M extends Model> = Exclude<
	{
		[K in keyof M]: M[K] extends Attribute ? K : never
	}[keyof M],
	undefined
>
```
- **Description**: The `ModelAttributeKey` type is a utility type that extracts the
attribute keys of a model.
- **Usage**:
  ```typescript
  type PostModel = Model<{
    id: Column<number>
    title: Column<string>
    content: Column<string>
    rating: Attribute<number>
    creator: Relation<User>
  }>

  type MyModelAttributeKey = ModelAttributeKey<PostModel>
  // MyModelAttributeKey = 'rating'
  ```

## `ModelRelationKey`

```typescript
/**
 * Get the relation keys of a model
 *
 * @example
 * type MyModelRelationKey = ModelRelationKey<MyModel>
 */
export type ModelRelationKey<M extends Model | null> = keyof Omit<
	M,
	M extends Model ? ModelColumnKey<M> | ModelAttributeKey<M> : never
>
```
- **Description**: The `ModelRelationKey` type is a utility type that extracts the
relation keys of a model.
- **Usage**:
  ```typescript
  type PostModel = Model<{
    id: Column<number>
    title: Column<string>
    content: Column<string>
    rating: Attribute<number>
    creator: Relation<User>
  }>

  type MyModelRelationKey = ModelRelationKey<PostModel>
  // MyModelRelationKey = 'creator'
  ```

## `RelationModel`

```typescript
/**
 * Get the relation model of a model's relation
 *
 * @example
 * type MyModelRelation = RelationModel<MyModel, 'user'>
 */
export type RelationModel<M extends Model, K extends ModelRelationKey<M>> = M[K] extends
	| Relation<infer R>
	| undefined
	? R
	: M[K] extends Relation<infer R>[] | undefined
		? R
		: never
```
- **Description**: The `RelationModel` type is a utility type that extracts the
relation model of a model's relation.
- **Usage**:
  ```typescript
  type PostModel = Model<{
    id: Column<number>
    title: Column<string>
    content: Column<string>
    rating: Attribute<number>
    creator: Relation<User>
  }>

  type MyModelRelation = RelationModel<PostModel, 'creator'>
  // MyModelRelation = User
  ```

## `ColumnType`

```typescript
/**
 * Get the type of a model's column
 *
 *  @example
 *  type MyModelName = ColumnType<MyModel, 'name'>
 */
export type ColumnType<M extends Model, K extends ModelColumnKey<M>> =
	M[K] extends Column<infer R> ? R : never
```
- **Description**: The `ColumnType` type is a utility type that extracts the
type of a model's column.
- **Usage**:
  ```typescript
  type PostModel = Model<{
    id: Column<number>
    title: Column<string>
    content: Column<string>
    rating: Attribute<number>
    creator: Relation<User>
  }>

  type MyModelName = ColumnType<PostModel, 'title'>
  // MyModelName = string
  ```

## `AttributeType`

```typescript
/**
 * Get the type of a model's attribute
 *
 * @example
 * type MyModelName = AttributeType<MyModel, 'name'>
 */
export type AttributeType<M extends Model, K extends ModelAttributeKey<M>> =
	M[K] extends Attribute<infer R> ? R : never
```
- **Description**: The `AttributeType` type is a utility type that extracts the
type of a model's attribute.
- **Usage**:
  ```typescript
  type PostModel = Model<{
    id: Column<number>
    title: Column<string>
    content: Column<string>
    rating: Attribute<number>
    creator: Relation<User>
  }>

  type MyModelRating = AttributeType<PostModel, 'rating'>
  // MyModelRating = number
  ```

## PropertyType

```typescript
/**
 * Get the type of a model's property
 *
 * @example
 * type MyModelName = PropertyType<MyModel, 'name'>
 */
export type PropertyType<M extends Model, K extends keyof M> = K extends 'id'
	? number | string
	: M[K] extends Column<infer R>
		? R
		: M[K] extends Attribute<infer R>
			? R
			: M[K] extends Relation<infer R>
				? R extends Model
					? Plain<R>
					: null
				: M[K] extends Relation<infer R>[]
					? R extends Model
						? Plain<R>[]
						: never
					: M[K] extends Relation<infer R> | undefined
						? R extends Model
							? Plain<R> | undefined
							: null | undefined
						: M[K] extends Relation<infer R>[] | undefined
							? R extends Model
								? Plain<R>[] | undefined
								: never
							: never
```
- **Description**: The `PropertyType` type is a utility type that extracts the
type of a model's property, regardless of whether it's a column, attribute or
relation.
- **Usage**:
  ```typescript
  type PostModel = Model<{
    id: Column<number>
    title: Column<string>
    content: Column<string>
    rating: Attribute<number>
    creator: Relation<User>
  }>

  type MyModelName = PropertyType<PostModel, 'title'>
  // MyModelName = string

  type MyModelRating = PropertyType<PostModel, 'rating'>
  // MyModelRating = number

  type MyModelCreator = PropertyType<PostModel, 'creator'>
  // MyModelCreator = User
  ```

## `Plain`

```typescript
/**
 * Get the type of the model without Column, Attribute, and Relation branding
 * and relations transformed to snake_case
 *
 * @example
 * type MyModelProperties = Plain<MyModel>
 */
export type Plain<M extends Model> = {
	[K in keyof M as K extends string
		? K extends ModelRelationKey<M>
			? CamelToSnakeCase<K>
			: K
		: K]: PropertyType<M, K>
} & { id: string | number } & { [key: string]: never; [key: number]: never }
```
- **Description**: The `Plain` type is a utility type that extracts the type of
the model without the Column, Attribute, and Relation branding and relations
transformed to snake_case.
- **Usage**:
  ```typescript
  type PostModel = Model<{
    id: Column<number>
    title: Column<string>
    content: Column<string>
    rating: Attribute<number>
    myCreator: Relation<User>
  }>

  type MyModelProperties = Plain<PostModel>
  // MyModelProperties = {
  //   id: string | number
  //   title: string
  //   content: string
  //   rating: number
  //   my_creator: User
  // }
  ```

## `WithParameterRelations`

```typescript
/**
 * Validates the 'with' parameter for query builder which can be constructed
 * out of dot separated nested relation names.
 *
 * @example
 * const userWithParam: WithParameterRelations<User, string> = "supervisor.address"
 */
export type WithParameterRelations<M extends Model, Depth extends number = 3> = Depth extends 0
	? string
	:
			| `${ModelRelationKey<M>}`
			| {
					[K in ModelRelationKey<M>]: `${K}.${WithParameterRelations<RelationModel<M, K>, [never, 0, 1, 2, 3, 4, 5][Depth]>}`
			  }[ModelRelationKey<M>]
```
- **Description**: The `WithParameterRelations` type is a utility type that
compiles 3 levels of relations and child relations for the given model to be used
in `with` parameters for fetching models with relations. If you require child
relations deeper than 3 levels, you can still get them you just won't get type
validation. This is mostly an internal type.
