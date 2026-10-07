import { describe, it, expectTypeOf } from 'vitest'
import type {
	Model,
	Column,
	Attribute,
	Relation,
	Plain,
	ModelColumnKey,
	ModelAttributeKey,
	ModelRelationKey,
	RelationModel,
	ColumnType,
	AttributeType,
	PropertyType,
	WithParameterRelations,
} from './Model'

type TestUser = Model<{
	stringColumn: Column<string>
	numberColumn: Column<number>
	booleanColumn: Column<boolean>
	nullColumn: Column<null>
	mixedColumn: Column<string | number | boolean | null>
	nullableStringColumn: Column<string | null>
	nullableNumberColumn: Column<number | null>
	nullableBooleanColumn: Column<boolean | null>
	stringAttribute: Attribute<string>
	numberAttribute: Attribute<number>
	booleanAttribute: Attribute<boolean>
	nullAttribute: Attribute<null>
	mixedAttribute: Attribute<string | number | boolean | null>
	nullableStringAttribute: Attribute<string | null>
	nullableNumberAttribute: Attribute<number | null>
	nullableBooleanAttribute: Attribute<boolean | null>
	someUser?: Relation<TestUser>
	someUsers?: Relation<TestUser>[]
	nullableUser?: Relation<TestUser | null>
	alwaysUser: Relation<TestUser>
	alwaysUsers: Relation<TestUser>[]
	alwaysNullableUser: Relation<TestUser | null>
}>

describe('Model type tests', () => {
	describe('Basic Model types', () => {
		it('validates that TestUser extends Model', () => {
			expectTypeOf<TestUser>().toExtend<Model>()
		})
	})

	describe('Relation types', () => {
		describe('Optional relations', () => {
			it('validates optional single relation', () => {
				expectTypeOf<TestUser['someUser']>().toEqualTypeOf<Relation<TestUser> | undefined>()
			})

			it('validates optional array relation', () => {
				expectTypeOf<TestUser['someUsers']>().toEqualTypeOf<Relation<TestUser>[] | undefined>()
			})
		})

		describe('Required relations', () => {
			it('validates required single relation', () => {
				expectTypeOf<TestUser['alwaysUser']>().toEqualTypeOf<Relation<TestUser>>()
			})

			it('validates required array relation', () => {
				expectTypeOf<TestUser['alwaysUsers']>().toEqualTypeOf<Relation<TestUser>[]>()
			})
		})

		describe('Nullable relations', () => {
			it('validates nullable relations', () => {
				expectTypeOf<Plain<TestUser>['nullable_user']>().toEqualTypeOf<
					Plain<TestUser> | null | undefined
				>()
				expectTypeOf<
					Plain<TestUser>['always_nullable_user']
				>().toEqualTypeOf<Plain<TestUser> | null>()
			})
		})
	})

	describe('Plain relation types', () => {
		describe('Optional plain relations', () => {
			it('validates optional single plain relation', () => {
				expectTypeOf<Plain<TestUser>['some_user']>().toEqualTypeOf<Plain<TestUser> | undefined>()
			})

			it('validates optional array plain relation', () => {
				expectTypeOf<Plain<TestUser>['some_users']>().toEqualTypeOf<Plain<TestUser>[] | undefined>()
			})
		})

		describe('Required plain relations', () => {
			it('validates required single plain relation', () => {
				expectTypeOf<Plain<TestUser>['always_user']>().toEqualTypeOf<Plain<TestUser>>()
			})

			it('validates required array plain relation', () => {
				expectTypeOf<Plain<TestUser>['always_users']>().toEqualTypeOf<Plain<TestUser>[]>()
			})
		})
	})

	describe('Generic Model relation types', () => {
		it('validates relations extend generic Model relations', () => {
			expectTypeOf<TestUser['someUser']>().toExtend<Relation<Model> | undefined>()
			expectTypeOf<TestUser['someUsers']>().toExtend<Relation<Model>[] | undefined>()
			expectTypeOf<TestUser['alwaysUser']>().toExtend<Relation<Model>>()
			expectTypeOf<TestUser['alwaysUsers']>().toExtend<Relation<Model>[]>()
		})

		it('validates relation array compatibility', () => {
			expectTypeOf<Array<Relation<TestUser>>>().toExtend<Array<Relation<Model>>>()
			expectTypeOf<Relation<TestUser>>().toExtend<Relation<Model>>()
		})
	})

	describe('Model key types', () => {
		it('validates column keys', () => {
			expectTypeOf<ModelColumnKey<TestUser>>().toEqualTypeOf<
				| 'id'
				| 'stringColumn'
				| 'numberColumn'
				| 'booleanColumn'
				| 'nullColumn'
				| 'mixedColumn'
				| 'nullableStringColumn'
				| 'nullableNumberColumn'
				| 'nullableBooleanColumn'
			>()
		})

		it('validates attribute keys', () => {
			expectTypeOf<ModelAttributeKey<TestUser>>().toEqualTypeOf<
				| 'stringAttribute'
				| 'numberAttribute'
				| 'booleanAttribute'
				| 'nullAttribute'
				| 'mixedAttribute'
				| 'nullableStringAttribute'
				| 'nullableNumberAttribute'
				| 'nullableBooleanAttribute'
			>()
		})

		it('validates relation keys', () => {
			expectTypeOf<ModelRelationKey<TestUser>>().toEqualTypeOf<
				| 'someUser'
				| 'someUsers'
				| 'nullableUser'
				| 'alwaysUser'
				| 'alwaysUsers'
				| 'alwaysNullableUser'
			>()
		})
	})

	describe('RelationModel types', () => {
		it('validates relation model types', () => {
			expectTypeOf<RelationModel<TestUser, 'someUser'>>().toEqualTypeOf<TestUser>()
			expectTypeOf<RelationModel<TestUser, 'someUsers'>>().toEqualTypeOf<TestUser>()
			expectTypeOf<RelationModel<TestUser, 'alwaysUser'>>().toEqualTypeOf<TestUser>()
			expectTypeOf<RelationModel<TestUser, 'alwaysUsers'>>().toEqualTypeOf<TestUser>()
		})
	})

	describe('Column types', () => {
		it('validates basic column types', () => {
			expectTypeOf<ColumnType<TestUser, 'stringColumn'>>().toEqualTypeOf<string>()
			expectTypeOf<ColumnType<TestUser, 'numberColumn'>>().toEqualTypeOf<number>()
			expectTypeOf<ColumnType<TestUser, 'booleanColumn'>>().toEqualTypeOf<boolean>()
			expectTypeOf<ColumnType<TestUser, 'nullColumn'>>().toEqualTypeOf<null>()
		})

		it('validates complex column types', () => {
			expectTypeOf<ColumnType<TestUser, 'mixedColumn'>>().toEqualTypeOf<
				string | number | boolean | null
			>()
		})

		it('validates nullable column types', () => {
			expectTypeOf<ColumnType<TestUser, 'nullableStringColumn'>>().toEqualTypeOf<string | null>()
			expectTypeOf<ColumnType<TestUser, 'nullableNumberColumn'>>().toEqualTypeOf<number | null>()
		})
	})

	describe('Attribute types', () => {
		it('validates basic attribute types', () => {
			expectTypeOf<AttributeType<TestUser, 'stringAttribute'>>().toEqualTypeOf<string>()
			expectTypeOf<AttributeType<TestUser, 'numberAttribute'>>().toEqualTypeOf<number>()
			expectTypeOf<AttributeType<TestUser, 'booleanAttribute'>>().toEqualTypeOf<boolean>()
			expectTypeOf<AttributeType<TestUser, 'nullAttribute'>>().toEqualTypeOf<null>()
		})

		it('validates complex attribute types', () => {
			expectTypeOf<AttributeType<TestUser, 'mixedAttribute'>>().toEqualTypeOf<
				string | number | boolean | null
			>()
		})

		it('validates nullable attribute types', () => {
			expectTypeOf<AttributeType<TestUser, 'nullableStringAttribute'>>().toEqualTypeOf<
				string | null
			>()
			expectTypeOf<AttributeType<TestUser, 'nullableNumberAttribute'>>().toEqualTypeOf<
				number | null
			>()
			expectTypeOf<AttributeType<TestUser, 'nullableBooleanAttribute'>>().toEqualTypeOf<
				boolean | null
			>()
		})
	})

	describe('Property types', () => {
		it('validates column property types', () => {
			expectTypeOf<PropertyType<TestUser, 'stringColumn'>>().toEqualTypeOf<string>()
			expectTypeOf<PropertyType<TestUser, 'numberColumn'>>().toEqualTypeOf<number>()
			expectTypeOf<PropertyType<TestUser, 'booleanColumn'>>().toEqualTypeOf<boolean>()
			expectTypeOf<PropertyType<TestUser, 'nullColumn'>>().toEqualTypeOf<null>()
			expectTypeOf<PropertyType<TestUser, 'mixedColumn'>>().toEqualTypeOf<
				string | number | boolean | null
			>()
		})

		it('validates nullable column property types', () => {
			expectTypeOf<PropertyType<TestUser, 'nullableStringColumn'>>().toEqualTypeOf<string | null>()
			expectTypeOf<PropertyType<TestUser, 'nullableNumberColumn'>>().toEqualTypeOf<number | null>()
			expectTypeOf<PropertyType<TestUser, 'nullableBooleanColumn'>>().toEqualTypeOf<
				boolean | null
			>()
		})

		it('validates attribute property types', () => {
			expectTypeOf<PropertyType<TestUser, 'stringAttribute'>>().toEqualTypeOf<string>()
			expectTypeOf<PropertyType<TestUser, 'numberAttribute'>>().toEqualTypeOf<number>()
			expectTypeOf<PropertyType<TestUser, 'booleanAttribute'>>().toEqualTypeOf<boolean>()
			expectTypeOf<PropertyType<TestUser, 'nullAttribute'>>().toEqualTypeOf<null>()
			expectTypeOf<PropertyType<TestUser, 'mixedAttribute'>>().toEqualTypeOf<
				string | number | boolean | null
			>()
		})

		it('validates nullable attribute property types', () => {
			expectTypeOf<PropertyType<TestUser, 'nullableStringAttribute'>>().toEqualTypeOf<
				string | null
			>()
			expectTypeOf<PropertyType<TestUser, 'nullableNumberAttribute'>>().toEqualTypeOf<
				number | null
			>()
			expectTypeOf<PropertyType<TestUser, 'nullableBooleanAttribute'>>().toEqualTypeOf<
				boolean | null
			>()
		})

		it('validates relation property types', () => {
			expectTypeOf<PropertyType<TestUser, 'someUser'>>().toEqualTypeOf<
				Plain<TestUser> | undefined
			>()
			expectTypeOf<PropertyType<TestUser, 'someUsers'>>().toEqualTypeOf<
				Plain<TestUser>[] | undefined
			>()
			expectTypeOf<PropertyType<TestUser, 'nullableUser'>>().toEqualTypeOf<
				Plain<TestUser> | null | undefined
			>()
			expectTypeOf<PropertyType<TestUser, 'alwaysUser'>>().toEqualTypeOf<Plain<TestUser>>()
			expectTypeOf<PropertyType<TestUser, 'alwaysUsers'>>().toEqualTypeOf<Plain<TestUser>[]>()
			expectTypeOf<
				PropertyType<TestUser, 'alwaysNullableUser'>
			>().toEqualTypeOf<Plain<TestUser> | null>()
		})
	})

	describe('Plain types', () => {
		it('validates complete Plain type structure', () => {
			expectTypeOf<Plain<TestUser>>().branded.toEqualTypeOf<{
				id: string | number
				stringColumn: string
				numberColumn: number
				booleanColumn: boolean
				nullColumn: null
				mixedColumn: string | number | boolean | null
				nullableStringColumn: string | null
				nullableNumberColumn: number | null
				nullableBooleanColumn: boolean | null
				stringAttribute: string
				numberAttribute: number
				booleanAttribute: boolean
				nullAttribute: null
				mixedAttribute: string | number | boolean | null
				nullableStringAttribute: string | null
				nullableNumberAttribute: number | null
				nullableBooleanAttribute: boolean | null
				some_user?: Plain<TestUser>
				some_users?: Plain<TestUser>[]
				nullable_user?: Plain<TestUser> | null
				always_user: Plain<TestUser>
				always_users: Plain<TestUser>[]
				always_nullable_user: Plain<TestUser> | null
			}>()
		})

		it('validates generic Model Plain types', () => {
			expectTypeOf<Plain<Model<any>>>().toExtend<{ id: string | number }>()
			expectTypeOf<Plain<Model>['id']>().toExtend<string | number>()
		})

		it('validates partial Model Plain types', () => {
			expectTypeOf<{}>().toExtend<Partial<Plain<Model>>>()
			expectTypeOf<{}>().toExtend<Partial<Plain<TestUser>>>()
			expectTypeOf<{ id: number }>().toExtend<Partial<Plain<Model>>>()
			expectTypeOf<{ id: number }>().toExtend<Partial<Plain<TestUser>>>()
			expectTypeOf<{ stringColumn: string }>().toExtend<Partial<Plain<TestUser>>>()
		})
	})

	describe('ID types', () => {
		it('validates ID types across different contexts', () => {
			expectTypeOf<TestUser['id']>().toEqualTypeOf<Column<string | number>>()
			expectTypeOf<Plain<TestUser>['id']>().toEqualTypeOf<string | number>()
			expectTypeOf<Model['id']>().toEqualTypeOf<Column<string | number>>()
			expectTypeOf<Plain<Model>['id']>().toEqualTypeOf<string | number>()
			expectTypeOf<PropertyType<Model, 'id'>>().toEqualTypeOf<string | number>()
		})
	})

	describe('WithParameterRelations', () => {
		it('validates single level relations', () => {
			expectTypeOf<'someUser.someUsers.someUser'>().toExtend<WithParameterRelations<TestUser>>()
		})
		it('validates 2 level relations', () => {
			expectTypeOf<'alwaysUser.someUser'>().toExtend<WithParameterRelations<TestUser>>()
		})
		it('validates 3 level relations', () => {
			expectTypeOf<'alwaysUser.someUser.nullableUser'>().toExtend<
				WithParameterRelations<TestUser>
			>()
		})
		it('doesnt validate 4 or greater level relations', () => {
			expectTypeOf<'alwaysUser.someUser.nullableUser.sometingthatdoesntexist'>().toExtend<
				WithParameterRelations<TestUser>
			>()
		})
	})
})
