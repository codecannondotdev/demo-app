---
outline: 'deep'
---

# `QueryBuilder`

The `QueryBuilder` class is a utility class that provides a fluent interface for
building queries that can be used to filter, sort, paginate and append relations
to the list of entities. It's based on the Laravel Eloquent query builder.

Not all Eloquent methods are supported. The supported methods are listed below.

- See also
  - [Frontend - Query Builder](/frontend/query-builder)
  - [Laravel Queries Documentation](https://laravel.com/docs/11.x/queries)

## General methods

### `getFilter`
- **Type**: `() => Filter`
- **Details**
  Returns the current filter object.

## Query building methods

The query builder provides a set of methods to build a query object that can be
used to filter, sort, paginate and append relations to the list of entities.

We won't go over what each method does here, but you can find more information
in the [Laravel Eloquent documentation](https://laravel.com/docs/11.x/eloquent).

For reference, we'll add the method type signatures here.

The full QueryBuilder class can be found in `ui/src/helpers/models/QueryBuilder.ts`.

### Utility types

```typescript
export type ID = string | number

export type Closure = (query: QueryBuilder) => void

export type Operator =
	| '='
	| '<'
	| '>'
	| '<='
	| '>='
	| '<>'
	| '!='
	| 'like'
	| 'not like'
	| 'between'
	| 'ilike'
	| 'not ilike'

export type JoinType = 'inner' | 'left' | 'right' | 'cross'

export type Column = string

export type Relation = string

export type Table = string
```


### whereKey

```typescript
// Add a where clause on the primary key to the query.
whereKey(id: ID): QueryBuilder
```

### whereKeyNot

```typescript
// Add a where clause on the primary key to the query.
whereKeyNot(id: ID): QueryBuilder
```

### where

```typescript
// Add a basic where clause to the query.
where(column: Closure): QueryBuilder
where(
    column: Column | Column[],
    operator: Operator | null,
    value: string | number | boolean | null,
    boolean: 'and' | 'or',
): QueryBuilder
```

### orWhere

```typescript
// Add an "or where" clause to the query.
orWhere(
    column: Closure | Column | Column[],
    operator: Operator | null,
    value: string | number | null,
): QueryBuilder
```

### whereNot

```typescript
// Add a basic "where not" clause to the query.
whereNot(
    column: Closure | Column | Column[],
    operator: Operator | null,
    value: string | number | null,
    boolean: 'and' | 'or',
): QueryBuilder
```

### orWhereNot

```typescript
// Add an "or where not" clause to the query.
orWhereNot(
    column: Closure | Column | Column[],
    operator: Operator | null,
    value: string | number | null,
): QueryBuilder
```

### latest

```typescript
// Add an "order by" clause for a timestamp to the query.
latest(column: Column): QueryBuilder
```

### oldest

```typescript
// Add an "order by" clause for a timestamp to the query.
oldest(column: Column): QueryBuilder
```

### distinct

```typescript
// Force the query to only return distinct results.
distinct(): QueryBuilder
```

### whereColumn

```typescript
// Add a "where" clause comparing two columns to the query.
whereColumn(
    column: Column | Column[],
    operator: Operator | null,
    second: string | null,
    boolean: string | null,
): QueryBuilder
```

### orWhereColumn

```typescript
// Add an "or where" clause comparing two columns to the query.
orWhereColumn(
    column: Column | Column[],
    operator: Operator | null,
    second: string | null,
): QueryBuilder
```

### whereIn

```typescript
// Add a "where in" clause to the query.
whereIn(column: Column, values: string[] | number[], boolean: string, not: boolean): QueryBuilder
```

### orWhereIn

```typescript
// Add an "or where in" clause to the query.
orWhereIn(column: Column, values: string[] | number[]): QueryBuilder
```

### whereNotIn

```typescript
// Add a "where not in" clause to the query.
whereNotIn(column: Column, values: string[] | number[], boolean: string): QueryBuilder
```

### orWhereNotIn

```typescript
// Add an "or where not in" clause to the query.
orWhereNotIn(column: Column, values: string[] | number[]): QueryBuilder
```

### whereNull

```typescript
// Add a "where null" clause to the query.
whereNull(columns: Column | Column[], boolean: string, not: boolean): QueryBuilder
```

### orWhereNull

```typescript
// Add an "or where null" clause to the query.
orWhereNull(column: Column): QueryBuilder
```

### whereNotNull

```typescript
// Add a "where not null" clause to the query.
whereNotNull(columns: Column | Column[], boolean: string): QueryBuilder
```

### whereBetween

```typescript
// Add a where between statement to the query.
whereBetween(
    column: Column,
    iterable: [string | number, string | number],
    boolean: string,
    not: boolean,
): QueryBuilder
```

### whereBetweenColumns

```typescript
// Add a where between statement using columns to the query.
whereBetweenColumns(
    column: Column,
    values: [string, string],
    boolean: string,
    not: boolean,
): QueryBuilder
```

### orWhereBetween

```typescript
// Add an or where between statement to the query.
orWhereBetween(column: Column, iterable: [string | number, string | number]): QueryBuilder
```

### orWhereBetweenColumns

```typescript
// Add an or where between statement using columns to the query.
orWhereBetweenColumns(column: Column, values: [string, string]): QueryBuilder
```

### whereNotBetween

```typescript
// Add a where not between statement to the query.
whereNotBetween(
    column: Column,
    iterable: [string | number, string | number],
    boolean: string,
): QueryBuilder
```

### whereNotBetweenColumns

```typescript
// Add a where not between statement using columns to the query.
whereNotBetweenColumns(column: Column, values: [string, string], boolean: string): QueryBuilder
```

### orWhereNotBetween

```typescript
// Add an or where not between statement to the query.
orWhereNotBetween(column: Column, iterable: [string | number, string | number]): QueryBuilder
```

### orWhereNotBetweenColumns

```typescript
// Add an or where not between statement using columns to the query.
orWhereNotBetweenColumns(column: Column, values: [string, string]): QueryBuilder
```

### orWhereNotNull

```typescript
// Add an "or where not null" clause to the query.
orWhereNotNull(column: Column): QueryBuilder
```

### whereDate

```typescript
// Add a "where date" statement to the query.
whereDate(
    column: Column,
    operator: string | Operator,
    value: string | Operator | null,
    boolean: string,
): QueryBuilder
```

### orWhereDate

```typescript
// Add an "or where date" statement to the query.
orWhereDate(
    column: Column,
    operator: string | Operator,
    value: string | Operator | null,
): QueryBuilder
```

### whereTime

```typescript
// Add a "where time" statement to the query.
whereTime(
    column: Column,
    operator: string | Operator,
    value: string | Operator | null,
    boolean: string,
): QueryBuilder
```

### orWhereTime

```typescript
// Add an "or where time" statement to the query.
orWhereTime(
    column: Column,
    operator: string | Operator,
    value: string | Operator | null,
): QueryBuilder
```

### whereDay

```typescript
// Add a "where day" statement to the query.
whereDay(
    column: Column,
    operator: string | Operator | null,
    value: string | Operator | null,
    boolean: string,
): QueryBuilder
```

### orWhereDay

```typescript
// Add an "or where day" statement to the query.
orWhereDay(
    column: Column,
    operator: string | Operator | null,
    value: string | Operator | null,
): QueryBuilder
```

### whereMonth

```typescript
// Add a "where month" statement to the query.
whereMonth(
    column: Column,
    operator: string | Operator | null,
    value: string | Operator | null,
    boolean: string,
): QueryBuilder
```

### orWhereMonth

```typescript
// Add an "or where month" statement to the query.
orWhereMonth(
    column: Column,
    operator: string | Operator | null,
    value: string | Operator | null,
): QueryBuilder
```

### whereYear

```typescript
// Add a "where year" statement to the query.
whereYear(
    column: Column,
    operator: string | Operator | null,
    value: string | Operator | null,
    boolean: string,
): QueryBuilder
```

### orWhereYear

```typescript
// Add an "or where year" statement to the query.
orWhereYear(
    column: Column,
    operator: string | Operator | null,
    value: string | Operator | null,
): QueryBuilder
```

### whereExists

```typescript
// Add an exists clause to the query.
whereExists(callback: Closure, boolean: string, not: boolean): QueryBuilder
```

### orWhereExists

```typescript
// Add an or exists clause to the query.
orWhereExists(callback: Closure, not: boolean): QueryBuilder
```

### whereNotExists

```typescript
// Add a where not exists clause to the query.
whereNotExists(callback: Closure, boolean: string): QueryBuilder
```

### orWhereNotExists

```typescript
// Add a where not exists clause to the query.
orWhereNotExists(callback: Closure): QueryBuilder
```

### whereJsonContains

```typescript
// Add a "where JSON contains" clause to the query.
whereJsonContains(
    column: string,
    value: string | number,
    boolean: string,
    not: boolean,
): QueryBuilder
```

### orWhereJsonContains

```typescript
// Add an "or where JSON contains" clause to the query.
orWhereJsonContains(column: string, value: string | number): QueryBuilder
```

### whereJsonDoesntContain

```typescript
// Add a "where JSON not contains" clause to the query.
whereJsonDoesntContain(column: string, value: string | number, boolean: string): QueryBuilder
```

### orWhereJsonDoesntContain

```typescript
// Add an "or where JSON not contains" clause to the query.
orWhereJsonDoesntContain(column: string, value: string | number): QueryBuilder
```

### whereJsonContainsKey

```typescript
// Add a clause that determines if a JSON path exists to the query.
whereJsonContainsKey(column: string, boolean: string, not: boolean): QueryBuilder
```

### orWhereJsonContainsKey

```typescript
// Add an "or" clause that determines if a JSON path exists to the query.
orWhereJsonContainsKey(column: string): QueryBuilder
```

### whereJsonDoesntContainKey

```typescript
// Add a clause that determines if a JSON path does not exist to the query.
whereJsonDoesntContainKey(column: string, boolean: string): QueryBuilder
```

### orWhereJsonDoesntContainKey

```typescript
// Add an "or" clause that determines if a JSON path does not exist to the query.
orWhereJsonDoesntContainKey(column: string): QueryBuilder
```

### whereJsonLength

```typescript
// Add a "where JSON length" clause to the query.
whereJsonLength(
    column: string,
    operator: Operator,
    value: string | number | null,
    boolean: string,
): QueryBuilder
```

### orWhereJsonLength

```typescript
// Add an "or where JSON length" clause to the query.
orWhereJsonLength(column: string, operator: Operator, value: string | number | null): QueryBuilder
```

### whereFullText

```typescript
// Add a "where fulltext" clause to the query.
whereFullText(
    columns: Column | Column[],
    value: string,
    options: string[],
    boolean: string,
): QueryBuilder
```

### orWhereFullText

```typescript
// Add a "or where fulltext" clause to the query.
orWhereFullText(columns: Column | Column[], value: string, options: string[]): QueryBuilder
```

### whereAll

```typescript
// Add a "where" clause to the query for multiple columns with "and" conditions between them.
whereAll(
    columns: Column[],
    operator: Operator | null,
    value: string | number | null,
    boolean: string,
): QueryBuilder
```

### orWhereAll

```typescript
// Add an "or where" clause to the query for multiple columns with "and" conditions between them.
orWhereAll(columns: Column[], operator: Operator, value: string | number | null): QueryBuilder
```

### whereAny

```typescript
// Add an "where" clause to the query for multiple columns with "or" conditions between them.
whereAny(
    columns: Column[],
    operator: Operator,
    value: string | number | null,
    boolean: string,
): QueryBuilder
```

### orWhereAny

```typescript
// Add an "or where" clause to the query for multiple columns with "or" conditions between them.
orWhereAny(columns: Column[], operator: Operator, value: string | number | null): QueryBuilder
```

### groupBy

```typescript
// Add a "group by" clause to the query.
groupBy(...groups: Column[]): QueryBuilder
```

### having

```typescript
// Add a "having" clause to the query.
having(
    column: Column,
    operator: Operator | null,
    value: string | number,
    boolean: string,
): QueryBuilder
```

### orHaving

```typescript
// Add an "or having" clause to the query.
orHaving(column: Column, operator: Operator | null, value: string | number): QueryBuilder
```

### havingNested

```typescript
// Add a nested having statement to the query.
havingNested(callback: Closure, boolean: string): QueryBuilder
```

### havingNull

```typescript
// Add a "having null" clause to the query.
havingNull(columns: Column[], boolean: string, not: boolean): QueryBuilder
```

### orHavingNull

```typescript
// Add an "or having null" clause to the query.
orHavingNull(column: Column): QueryBuilder
```

### havingNotNull

```typescript
// Add a "having not null" clause to the query.
havingNotNull(columns: Column[], boolean: string): QueryBuilder
```

### orHavingNotNull

```typescript
// Add an "or having not null" clause to the query.
orHavingNotNull(column: Column): QueryBuilder
```

### havingBetween

```typescript
// Add a "having between " clause to the query.
havingBetween(
    column: Column,
    iterable: [string | number, string | number],
    boolean: string,
    not: boolean,
): QueryBuilder
```

### orderBy

```typescript
// Add an "order by" clause to the query.
orderBy(column: Column, direction: 'asc' | 'desc'): QueryBuilder
```

### orderByDesc

```typescript
// Add a descending "order by" clause to the query.
orderByDesc(column: Column): QueryBuilder
```

### inRandomOrder

```typescript
// Put the query's results in random order.
inRandomOrder(seed: string | number): QueryBuilder
```

### skip

```typescript
// Alias to set the "offset" value of the query.
skip(value: number): QueryBuilder
```

### offset

```typescript
// Set the "offset" value of the query.
offset(value: number): QueryBuilder
```

### take

```typescript
// Alias to set the "limit" value of the query.
take(value: number): QueryBuilder
```

### limit

```typescript
// Set the "limit" value of the query.
limit(value: number): QueryBuilder
```

### forPage

```typescript
// Set the limit and offset for a given page.
forPage(page: number, perPage: number): QueryBuilder
```

### forPageBeforeId

```typescript
// Constrain the query to the previous "page" of results before a given ID.
forPageBeforeId(perPage: number, lastId: ID | null, column: Column): QueryBuilder
```

### forPageAfterId

```typescript
// Constrain the query to the next "page" of results after a given ID.
forPageAfterId(perPage: number, lastId: ID | null, column: Column): QueryBuilder
```

### reorder

```typescript
// Remove all existing orders and optionally add a new order.
reorder(column: Column | null, direction: 'asc' | 'desc'): QueryBuilder
```

### has

```typescript
// Add a relationship count / exists condition to the query.
has(
    relation: Relation,
    operator: Operator,
    count: number,
    boolean: string,
    callback: Closure | null,
): QueryBuilder
```

### hasNested

```typescript
// Add nested relationship count / exists conditions to the query.
hasNested(
    relations: Relation,
    operator: Operator,
    count: number,
    boolean: string,
    callback: Closure | null,
): QueryBuilder
```

### orHas

```typescript
// Add a relationship count / exists condition to the query with an "or".
orHas(relation: Relation, operator: Operator, count: number): QueryBuilder
```

### doesntHave

```typescript
// Add a relationship count / exists condition to the query.
doesntHave(relation: Relation, boolean: string, callback: Closure | null): QueryBuilder
```

### orDoesntHave

```typescript
// Add a relationship count / exists condition to the query with an "or".
orDoesntHave(relation: Relation): QueryBuilder
```

### whereHas

```typescript
// Add a relationship count / exists condition to the query with where clauses.
whereHas(
    relation: Relation,
    callback: Closure | null,
    operator: Operator,
    count: number,
): QueryBuilder
```

### withWhereHas

```typescript
// Add a relationship count / exists condition to the query with where clauses.
withWhereHas(
    relation: Relation,
    callback: Closure | null,
    operator: Operator,
    count: number,
): QueryBuilder
```

### orWhereHas

```typescript
// Add a relationship count / exists condition to the query with where clauses and an "or".
orWhereHas(
    relation: Relation,
    callback: Closure | null,
    operator: Operator,
    count: number,
): QueryBuilder
```

### whereDoesntHave

```typescript
// Add a relationship count / exists condition to the query with where clauses.
whereDoesntHave(relation: Relation, callback: Closure | null): QueryBuilder
```

### orWhereDoesntHave

```typescript
// Add a relationship count / exists condition to the query with where clauses and an "or".
orWhereDoesntHave(relation: Relation, callback: Closure | null): QueryBuilder
```

### hasMorph

```typescript
// Add a polymorphic relationship count / exists condition to the query.
hasMorph(
    relation: Relation,
    types: string | string[],
    operator: Operator,
    count: number,
    boolean: string,
    callback: Closure | null,
): QueryBuilder
```

### orHasMorph

```typescript
// Add a polymorphic relationship count / exists condition to the query with an "or".
orHasMorph(
    relation: Relation,
    types: string | string[],
    operator: Operator,
    count: number,
): QueryBuilder
```

### doesntHaveMorph

```typescript
// Add a polymorphic relationship count / exists condition to the query.
doesntHaveMorph(
    relation: Relation,
    types: string | string[],
    boolean: string,
    callback: Closure | null,
): QueryBuilder
```

### orDoesntHaveMorph

```typescript
// Add a polymorphic relationship count / exists condition to the query with an "or".
orDoesntHaveMorph(relation: Relation, types: string | string[]): QueryBuilder
```

### whereHasMorph

```typescript
// Add a polymorphic relationship count / exists condition to the query with where clauses.
whereHasMorph(
    relation: Relation,
    types: string | string[],
    callback: Closure | null,
    operator: Operator,
    count: number,
): QueryBuilder
```

### orWhereHasMorph

```typescript
// Add a polymorphic relationship count / exists condition to the query with where clauses and an "or".
orWhereHasMorph(
    relation: Relation,
    types: string | string[],
    callback: Closure | null,
    operator: Operator,
    count: number,
): QueryBuilder
```

### whereDoesntHaveMorph

```typescript
// Add a polymorphic relationship count / exists condition to the query with where clauses.
whereDoesntHaveMorph(
    relation: Relation,
    types: string | string[],
    callback: Closure | null,
): QueryBuilder
```

### orWhereDoesntHaveMorph

```typescript
// Add a polymorphic relationship count / exists condition to the query with where clauses and an "or".
orWhereDoesntHaveMorph(
    relation: Relation,
    types: string | string[],
    callback: Closure | null,
): QueryBuilder
```

### whereRelation

```typescript
// Add a basic where clause to a relationship query.
whereRelation(
    relation: Relation,
    column: Column,
    operator: Operator | null,
    value: string | number | null,
): QueryBuilder
```

### orWhereRelation

```typescript
// Add an "or where" clause to a relationship query.
orWhereRelation(
    relation: Relation,
    column: Column,
    operator: Operator | null,
    value: string | number | null,
): QueryBuilder
```

### whereMorphRelation

```typescript
// Add a polymorphic relationship condition to the query with a where clause.
whereMorphRelation(
    relation: Relation,
    types: string | string[],
    column: Column,
    operator: Operator | null,
    value: string | number | null,
): QueryBuilder
```

### orWhereMorphRelation

```typescript
// Add a polymorphic relationship condition to the query with an "or where" clause.
orWhereMorphRelation(
    relation: Relation,
    types: string | string[],
    column: Column,
    operator: Operator | null,
    value: string | number | null,
): QueryBuilder
```

### whereMorphedTo

```typescript
// Add a morph-to relationship condition to the query.
whereMorphedTo(relation: Relation, model: string, boolean: string): QueryBuilder
```

### whereNotMorphedTo

```typescript
// Add a not morph-to relationship condition to the query.
whereNotMorphedTo(relation: Relation, model: string, boolean: string): QueryBuilder
```

### orWhereMorphedTo

```typescript
// Add a morph-to relationship condition to the query with an "or where" clause.
orWhereMorphedTo(relation: Relation, model: string): QueryBuilder
```

### orWhereNotMorphedTo

```typescript
// Add a not morph-to relationship condition to the query with an "or where" clause.
orWhereNotMorphedTo(relation: Relation, model: string): QueryBuilder
```
