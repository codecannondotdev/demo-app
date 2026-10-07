import type { Branded } from '@/interfaces/brand'

export type OptionalKeys<M extends Model> = {
	[K in keyof M]: undefined extends M[K] ? K : never
}[keyof M]

export type RequiredKeys<M extends Model> = Exclude<keyof M, OptionalKeys<M>>

export type CamelToSnakeCase<S extends string> = S extends `${infer First}${infer Rest}`
	? First extends Lowercase<First>
		? `${First}${CamelToSnakeCase<Rest>}`
		: `_${Lowercase<First>}${CamelToSnakeCase<Rest>}`
	: S

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

/**
 * Brand type for model relations
 *
 * @example
 * type MyModel = Model<{
 *  user?: Relation<User>
 * }>
 */
export type Relation<T extends Model | null = Model | null> = Branded<T, 'Model.Relation'>

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
export type Model<P extends object = {}> = {
	[K in keyof P | 'id']: K extends 'id'
		? Column<string | number>
		: K extends keyof P
			? P[K]
			: Column | Attribute | Relation<Model | null> | Relation<Model>[] | undefined
}

/**
 * Get the column keys of a model
 *
 * @example
 * type MyModelColumnKey = ModelColumnKey<MyModel>
 */
export type ModelColumnKey<M extends Model> = Extract<
	{
		[K in keyof M]: M[K] extends Column ? K : never
	}[keyof M],
	string
>

/**
 * Get the attribute keys of a model
 *
 * @example
 * type MyModelAttributeKey = ModelAttributeKey<MyModel>
 */
export type ModelAttributeKey<M extends Model> = Extract<
	{
		[K in keyof M]: M[K] extends Attribute ? K : never
	}[keyof M],
	string
>

/**
 * Get the relation keys of a model
 *
 * @example
 * type MyModelRelationKey = ModelRelationKey<MyModel>
 */
export type ModelRelationKey<M extends Model | null> = M extends Model
	? Extract<Exclude<keyof M, ModelColumnKey<M> | ModelAttributeKey<M>>, string>
	: never

/**
 * Get the relation model of a model's relation
 *
 * @example
 * type MyModelRelation = RelationModel<MyModel, 'user'>
 */
export type RelationModel<M extends Model, K extends ModelRelationKey<M>> = M[K] extends
	| Relation<infer R>
	| undefined
	? Extract<R, Model>
	: M[K] extends Relation<infer R>[] | undefined
		? Extract<R, Model>
		: never

/**
 * Get the type of a model's column
 *
 *  @example
 *  type MyModelName = ColumnType<MyModel, 'name'>
 */
export type ColumnType<M extends Model, K extends ModelColumnKey<M>> =
	M[K] extends Column<infer R> ? R : never

/**
 * Get the type of a model's attribute
 *
 * @example
 * type MyModelName = AttributeType<MyModel, 'name'>
 */
export type AttributeType<M extends Model, K extends ModelAttributeKey<M>> =
	M[K] extends Attribute<infer R> ? R : never

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

/**
 * Get the type of the model without Column, Attribute, and Relation branding
 * and relations transformed to snake_case
 *
 * @example
 * type MyModelProperties = Plain<MyModel>
 */
export type Plain<M extends Model> = {
	[K in RequiredKeys<M> as K extends string
		? K extends ModelRelationKey<M>
			? CamelToSnakeCase<K>
			: K
		: K]: PropertyType<M, K>
} & {
	[K in OptionalKeys<M> as K extends string
		? K extends ModelRelationKey<M>
			? CamelToSnakeCase<K>
			: K
		: K]?: Exclude<PropertyType<M, K>, undefined>
} & { id: string | number }

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
