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

export type QueryBuilder = {
	// Add a where clause on the primary key to the query.
	whereKey(id: ID): QueryBuilder

	// Add a where clause on the primary key to the query.
	whereKeyNot(id: ID): QueryBuilder

	// Add a basic where clause to the query.
	// where(column: Closure|string|string[], operator: Operator|null = null, value: string|number|null = null, boolean: 'and' | 'or' = 'and'): QueryBuilder
	where(column: Closure): QueryBuilder
	where(
		column: Column | Column[],
		operator: Operator | null,
		value: string | number | boolean | null,
		boolean: 'and' | 'or',
	): QueryBuilder

	// Add an "or where" clause to the query.
	// orWhere(column: Closure|string|string[], operator: Operator|null = null, value: string|number|null = null): QueryBuilder
	orWhere(
		column: Closure | Column | Column[],
		operator: Operator | null,
		value: string | number | null,
	): QueryBuilder

	// Add a basic "where not" clause to the query.
	// whereNot(column: Closure|string|string[], operator: Operator|null = null, value: string|number|null = null, boolean: 'and' | 'or' = 'and'): QueryBuilder
	whereNot(
		column: Closure | Column | Column[],
		operator: Operator | null,
		value: string | number | null,
		boolean: 'and' | 'or',
	): QueryBuilder

	// Add an "or where not" clause to the query.
	// orWhereNot(column: Closure|string|string[], operator: Operator|null = null, value: string|number|null = null): QueryBuilder
	orWhereNot(
		column: Closure | Column | Column[],
		operator: Operator | null,
		value: string | number | null,
	): QueryBuilder

	// Add an "order by" clause for a timestamp to the query.
	// latest(column: string = null)
	latest(column: Column): QueryBuilder

	// Add an "order by" clause for a timestamp to the query.
	// oldest(column: string = null)
	oldest(column: Column): QueryBuilder

	// Set the columns to be selected.
	// select(columns: string[] = ['*']): QueryBuilder
	select(columns: Column[]): QueryBuilder

	// Add a new select column to the query.
	addSelect(column: Column[]): QueryBuilder

	// Force the query to only return distinct results.
	distinct(): QueryBuilder

	// Add a join clause to the query.
	// join(table: Table, first: Closure|string, operator: Operator | null = null,  second: string|null = null, type: JoinType = 'inner', where: boolean = false): QueryBuilder
	join(
		table: Table,
		first: Closure | string,
		operator: Operator | null,
		second: string | null,
		type: JoinType,
		where: boolean,
	): QueryBuilder

	// Add a "join where" clause to the query.
	// joinWhere(table: Table,  first: Closure|string, operator: Operator, second: string, type: JoinType = 'inner'): QueryBuilder
	joinWhere(
		table: Table,
		first: Closure | string,
		operator: Operator,
		second: string,
		type: JoinType,
	): QueryBuilder

	// Add a lateral join clause to the query.
	// joinLateral(query: Closure|string, as: string, type: JoinType = 'inner'): QueryBuilder
	joinLateral(query: Closure | string, as: string, type: JoinType): QueryBuilder

	// Add a lateral left join to the query.
	leftJoinLateral(query: Closure | string, as: string): QueryBuilder

	// Add a left join to the query.
	// leftJoin(table: Table, first: Closure|string, operator: Operator|null = null, second: string|null = null): QueryBuilder
	leftJoin(
		table: Table,
		first: Closure | string,
		operator: Operator | null,
		second: string | null,
	): QueryBuilder

	// Add a "join where" clause to the query.
	leftJoinWhere(
		table: Table,
		first: Closure | string,
		operator: Operator,
		second: string | null,
	): QueryBuilder

	// Add a right join to the query.
	// rightJoin(table: Table, first: Closure|string, operator: Operator|null = null, second: string|null = null)
	rightJoin(
		table: Table,
		first: Closure | string,
		operator: Operator | null,
		second: string | null,
	): QueryBuilder

	// Add a "right join where" clause to the query.
	rightJoinWhere(
		table: Table,
		first: Closure | string,
		operator: Operator,
		second: string,
	): QueryBuilder

	// Add a "cross join" clause to the query.
	// crossJoin(table: Table, first: Closure|string|null = null, operator: Operator|null = null, second: string|null = null)
	crossJoin(
		table: Table,
		first: Closure | string | null,
		operator: Operator | null,
		second: string | null,
	): QueryBuilder

	// Add a "where" clause comparing two columns to the query.
	// whereColumn(column: Column|Column[], operator: Operator|null = null, second: string|null = null, boolean: string|null = 'and'): QueryBuilder
	whereColumn(
		column: Column | Column[],
		operator: Operator | null,
		second: string | null,
		boolean: string | null,
	): QueryBuilder

	// Add an "or where" clause comparing two columns to the query.
	// orWhereColumn(column: Column|Column[], operator: Operator|null = null, second: string|null = null)
	orWhereColumn(
		column: Column | Column[],
		operator: Operator | null,
		second: string | null,
	): QueryBuilder

	// Add a "where in" clause to the query.
	// whereIn(column: Column, values: string[]|number[], boolean: string = 'and', not: boolean = false): QueryBuilder
	whereIn(column: Column, values: string[] | number[], boolean: string, not: boolean): QueryBuilder

	// Add an "or where in" clause to the query.
	orWhereIn(column: Column, values: string[] | number[]): QueryBuilder

	// Add a "where not in" clause to the query.
	// whereNotIn(column: Column, values: string[]|number[], boolean: string = 'and'): QueryBuilder
	whereNotIn(column: Column, values: string[] | number[], boolean: string): QueryBuilder

	// Add an "or where not in" clause to the query.
	orWhereNotIn(column: Column, values: string[] | number[]): QueryBuilder

	// Add a "where null" clause to the query.
	// whereNull(columns: Column|Column[], boolean: string = 'and', not: boolean = false): QueryBuilder
	whereNull(columns: Column | Column[], boolean: string, not: boolean): QueryBuilder

	// Add an "or where null" clause to the query.
	orWhereNull(column: Column): QueryBuilder

	// Add a "where not null" clause to the query.
	// whereNotNull(columns: Column|Column[], boolean: string = 'and'): QueryBuilder
	whereNotNull(columns: Column | Column[], boolean: string): QueryBuilder

	// Add a where between statement to the query.
	// whereBetween(column: Column, iterable: [string|number, string|number], boolean: string = 'and', not: boolean = false): QueryBuilder
	whereBetween(
		column: Column,
		iterable: [string | number, string | number],
		boolean: string,
		not: boolean,
	): QueryBuilder

	// Add a where between statement using columns to the query.
	// whereBetweenColumns(column: Column, values: [string, string], boolean: string = 'and', not: boolean = false): QueryBuilder
	whereBetweenColumns(
		column: Column,
		values: [string, string],
		boolean: string,
		not: boolean,
	): QueryBuilder

	// Add an or where between statement to the query.
	orWhereBetween(column: Column, iterable: [string | number, string | number]): QueryBuilder

	// Add an or where between statement using columns to the query.
	orWhereBetweenColumns(column: Column, values: [string, string]): QueryBuilder

	// Add a where not between statement to the query.
	// whereNotBetween(column: Column, iterable: [string|number, string|number], boolean: string = 'and'): QueryBuilder
	whereNotBetween(
		column: Column,
		iterable: [string | number, string | number],
		boolean: string,
	): QueryBuilder

	// Add a where not between statement using columns to the query.
	// whereNotBetweenColumns(column: Column, values: [string, string], boolean: string = 'and'): QueryBuilder
	whereNotBetweenColumns(column: Column, values: [string, string], boolean: string): QueryBuilder

	// Add an or where not between statement to the query.
	orWhereNotBetween(column: Column, iterable: [string | number, string | number]): QueryBuilder

	// Add an or where not between statement using columns to the query.
	orWhereNotBetweenColumns(column: Column, values: [string, string]): QueryBuilder

	// Add an "or where not null" clause to the query.
	orWhereNotNull(column: Column): QueryBuilder

	// Add a "where date" statement to the query.
	// whereDate(column: Column, operator: string|Operator, value: string|Operator|null = null, boolean: string = 'and'): QueryBuilder
	whereDate(
		column: Column,
		operator: string | Operator,
		value: string | Operator | null,
		boolean: string,
	): QueryBuilder

	// Add an "or where date" statement to the query.
	// orWhereDate(column: Column, operator: string|Operator, value: string|Operator|null = null): QueryBuilder
	orWhereDate(
		column: Column,
		operator: string | Operator,
		value: string | Operator | null,
	): QueryBuilder

	// Add a "where time" statement to the query.
	// whereTime(column: Column, operator: string|Operator, value: string|Operator|null = null, boolean: string = 'and'): QueryBuilder
	whereTime(
		column: Column,
		operator: string | Operator,
		value: string | Operator | null,
		boolean: string,
	): QueryBuilder

	// Add an "or where time" statement to the query.
	// orWhereTime(column: Column, operator: string|Operator, value: string|Operator|null = null): QueryBuilder
	orWhereTime(
		column: Column,
		operator: string | Operator,
		value: string | Operator | null,
	): QueryBuilder

	// Add a "where day" statement to the query.
	// whereDay(column: Column, operator: string|Operator|null = null, value: string|Operator|null = null, boolean: string = 'and'): QueryBuilder
	whereDay(
		column: Column,
		operator: string | Operator | null,
		value: string | Operator | null,
		boolean: string,
	): QueryBuilder

	// Add an "or where day" statement to the query.
	// orWhereDay(column: Column, operator: string|Operator|null = null, value: string|Operator|null = null): QueryBuilder
	orWhereDay(
		column: Column,
		operator: string | Operator | null,
		value: string | Operator | null,
	): QueryBuilder

	// Add a "where month" statement to the query.
	// whereMonth(column: Column, operator: string|Operator|null = null, value: string|Operator|null = null, boolean: string = 'and'): QueryBuilder
	whereMonth(
		column: Column,
		operator: string | Operator | null,
		value: string | Operator | null,
		boolean: string,
	): QueryBuilder

	// Add an "or where month" statement to the query.
	// orWhereMonth(column: Column, operator: string|Operator|null = null, value: string|Operator|null = null): QueryBuilder
	orWhereMonth(
		column: Column,
		operator: string | Operator | null,
		value: string | Operator | null,
	): QueryBuilder

	// Add a "where year" statement to the query.
	// whereYear(column: Column, operator: string|Operator|null = null, value: string|Operator|null = null, boolean: string = 'and'): QueryBuilder
	whereYear(
		column: Column,
		operator: string | Operator | null,
		value: string | Operator | null,
		boolean: string,
	): QueryBuilder

	// Add an "or where year" statement to the query.
	// orWhereYear(column: Column, operator: string|Operator|null = null, value: string|Operator|null = null): QueryBuilder
	orWhereYear(
		column: Column,
		operator: string | Operator | null,
		value: string | Operator | null,
	): QueryBuilder

	// Add a nested where statement to the query.
	// whereNested(callback: Closure, boolean: string = 'and'): QueryBuilder
	whereNested(callback: Closure, boolean: string): QueryBuilder

	// Add an exists clause to the query.
	// whereExists(callback: Closure, boolean: string = 'and', not: boolean = false): QueryBuilder
	whereExists(callback: Closure, boolean: string, not: boolean): QueryBuilder

	// Add an or exists clause to the query.
	// orWhereExists(callback: Closure, not: boolean = false): QueryBuilder
	orWhereExists(callback: Closure, not: boolean): QueryBuilder

	// Add a where not exists clause to the query.
	// whereNotExists(callback: Closure, boolean: string = 'and'): QueryBuilder
	whereNotExists(callback: Closure, boolean: string): QueryBuilder

	// Add a where not exists clause to the query.
	orWhereNotExists(callback: Closure): QueryBuilder

	// Add an exists clause to the query.
	// addWhereExistsQuery(query: Closure, boolean: string = 'and', not: boolean = false): QueryBuilder
	addWhereExistsQuery(query: Closure, boolean: string, not: boolean): QueryBuilder

	// Adds a where condition using row values.
	// whereRowValues(columns: Column[], operator: Operator, values: string[]|number[], boolean: string = 'and'): QueryBuilder
	whereRowValues(
		columns: Column[],
		operator: Operator,
		values: string[] | number[],
		boolean: string,
	): QueryBuilder

	// Adds an or where condition using row values.
	orWhereRowValues(columns: Column[], operator: Operator, values: string[] | number[]): QueryBuilder

	// Add a "where JSON contains" clause to the query.
	// whereJsonContains(column: string, value: string|number, boolean: string = 'and', not: boolean = false): QueryBuilder
	whereJsonContains(
		column: string,
		value: string | number,
		boolean: string,
		not: boolean,
	): QueryBuilder

	// Add an "or where JSON contains" clause to the query.
	orWhereJsonContains(column: string, value: string | number): QueryBuilder

	// Add a "where JSON not contains" clause to the query.
	// whereJsonDoesntContain(column: string, value: string|number, boolean: string = 'and'): QueryBuilder
	whereJsonDoesntContain(column: string, value: string | number, boolean: string): QueryBuilder

	// Add an "or where JSON not contains" clause to the query.
	orWhereJsonDoesntContain(column: string, value: string | number): QueryBuilder

	// Add a clause that determines if a JSON path exists to the query.
	// whereJsonContainsKey(column: string, boolean: string = 'and', not: boolean = false): QueryBuilder
	whereJsonContainsKey(column: string, boolean: string, not: boolean): QueryBuilder

	// Add an "or" clause that determines if a JSON path exists to the query.
	orWhereJsonContainsKey(column: string): QueryBuilder

	// Add a clause that determines if a JSON path does not exist to the query.
	// whereJsonDoesntContainKey(column: string, boolean: string = 'and'): QueryBuilder
	whereJsonDoesntContainKey(column: string, boolean: string): QueryBuilder

	// Add an "or" clause that determines if a JSON path does not exist to the query.
	orWhereJsonDoesntContainKey(column: string): QueryBuilder

	// Add a "where JSON length" clause to the query.
	// whereJsonLength(column: string, operator: Operator, value: string|number|null, boolean: string = 'and'): QueryBuilder
	whereJsonLength(
		column: string,
		operator: Operator,
		value: string | number | null,
		boolean: string,
	): QueryBuilder

	// Add an "or where JSON length" clause to the query.
	orWhereJsonLength(column: string, operator: Operator, value: string | number | null): QueryBuilder

	// Add a "where fulltext" clause to the query.
	// whereFullText(columns: Column|Column[], value: string, options: string[] = [], boolean: string = 'and'): QueryBuilder
	whereFullText(
		columns: Column | Column[],
		value: string,
		options: string[],
		boolean: string,
	): QueryBuilder

	// Add a "or where fulltext" clause to the query.
	// orWhereFullText(columns: Column|Column[], value: string, options: string[] = []): QueryBuilder
	orWhereFullText(columns: Column | Column[], value: string, options: string[]): QueryBuilder

	// Add a "where" clause to the query for multiple columns with "and" conditions between them.
	// whereAll(columns: Column[], operator: Operator|null, value: string|number|null, boolean: string = 'and'): QueryBuilder
	whereAll(
		columns: Column[],
		operator: Operator | null,
		value: string | number | null,
		boolean: string,
	): QueryBuilder

	// Add an "or where" clause to the query for multiple columns with "and" conditions between them.
	// orWhereAll(columns: Column[], operator: Operator = null, value: string|number|null): QueryBuilder
	orWhereAll(columns: Column[], operator: Operator, value: string | number | null): QueryBuilder

	// Add an "where" clause to the query for multiple columns with "or" conditions between them.
	// whereAny(columns: Column[], operator: Operator = null, value: string|number|null, boolean: string = 'and'): QueryBuilder
	whereAny(
		columns: Column[],
		operator: Operator,
		value: string | number | null,
		boolean: string,
	): QueryBuilder

	// Add an "or where" clause to the query for multiple columns with "or" conditions between them.
	// orWhereAny(columns: Column[], operator: Operator = null, value: string|number|null): QueryBuilder
	orWhereAny(columns: Column[], operator: Operator, value: string | number | null): QueryBuilder

	// Add a "group by" clause to the query.
	groupBy(...groups: Column[]): QueryBuilder

	// Add a "having" clause to the query.
	// having(column: Column, operator: Operator|null = null, value: string|number, boolean: string = 'and'): QueryBuilder
	having(
		column: Column,
		operator: Operator | null,
		value: string | number,
		boolean: string,
	): QueryBuilder

	// Add an "or having" clause to the query.
	// orHaving(column: Column, operator: Operator|null = null, value: string|number): QueryBuilder
	orHaving(column: Column, operator: Operator | null, value: string | number): QueryBuilder

	// Add a nested having statement to the query.
	// havingNested(callback: Closure, boolean: string = 'and'): QueryBuilder
	havingNested(callback: Closure, boolean: string): QueryBuilder

	// Add a "having null" clause to the query.
	// havingNull(columns: Column[], boolean: string = 'and', not: boolean = false): QueryBuilder
	havingNull(columns: Column[], boolean: string, not: boolean): QueryBuilder

	// Add an "or having null" clause to the query.
	orHavingNull(column: Column): QueryBuilder

	// Add a "having not null" clause to the query.
	// havingNotNull(columns: Column[], boolean: string = 'and'): QueryBuilder
	havingNotNull(columns: Column[], boolean: string): QueryBuilder

	// Add an "or having not null" clause to the query.
	orHavingNotNull(column: Column): QueryBuilder

	// Add a "having between " clause to the query.
	// havingBetween(column: Column, iterable: [string|number, string|number], boolean: string = 'and', not: boolean = false): QueryBuilder
	havingBetween(
		column: Column,
		iterable: [string | number, string | number],
		boolean: string,
		not: boolean,
	): QueryBuilder

	// Add an "order by" clause to the query.
	// orderBy(column: Column, direction: 'asc'|'desc' = 'asc'): QueryBuilder
	orderBy(column: Column, direction: 'asc' | 'desc'): QueryBuilder

	// Add a descending "order by" clause to the query.
	orderByDesc(column: Column): QueryBuilder

	// Put the query's results in random order.
	// inRandomOrder(seed: string|number = ''): QueryBuilder
	inRandomOrder(seed: string | number): QueryBuilder

	// Alias to set the "offset" value of the query.
	skip(value: number): QueryBuilder

	// Set the "offset" value of the query.
	offset(value: number): QueryBuilder

	// Alias to set the "limit" value of the query.
	take(value: number): QueryBuilder

	// Set the "limit" value of the query.
	limit(value: number): QueryBuilder

	// Set the limit and offset for a given page.
	// forPage(page: number, perPage: number = 15): QueryBuilder
	forPage(page: number, perPage: number): QueryBuilder

	// Constrain the query to the previous "page" of results before a given ID.
	// forPageBeforeId(perPage: number = 15, lastId: ID|null, column: Column = 'id'): QueryBuilder
	forPageBeforeId(perPage: number, lastId: ID | null, column: Column): QueryBuilder

	// Constrain the query to the next "page" of results after a given ID.
	// forPageAfterId(perPage: number = 15, lastId: ID|null, column: Column = 'id'): QueryBuilder
	forPageAfterId(perPage: number, lastId: ID | null, column: Column): QueryBuilder

	// Remove all existing orders and optionally add a new order.
	// reorder(column: Column|null = null, direction: 'asc'|'desc' = 'asc'): QueryBuilder
	reorder(column: Column | null, direction: 'asc' | 'desc'): QueryBuilder

	// Add a union statement to the query.
	// union(query: Closure, all: boolean = false): QueryBuilder
	union(query: Closure, all: boolean): QueryBuilder

	// Add a union all statement to the query.
	unionAll(query: Closure): QueryBuilder

	// Add a relationship count / exists condition to the query.
	// has(relation: Relation, operator: Operator = '>=', count: number = 1, boolean: string = 'and', callback: Closure|null = null): QueryBuilder
	has(
		relation: Relation,
		operator: Operator,
		count: number,
		boolean: string,
		callback: Closure | null,
	): QueryBuilder

	// Add nested relationship count / exists conditions to the query.
	// hasNested(relations: Relation, operator: Operator = '>=', count: number = 1, boolean: string = 'and', callback: Closure|null = null): QueryBuilder
	hasNested(
		relations: Relation,
		operator: Operator,
		count: number,
		boolean: string,
		callback: Closure | null,
	): QueryBuilder

	// Add a relationship count / exists condition to the query with an "or".
	// orHas(relation: Relation, operator: Operator = '>=', count: number = 1): QueryBuilder
	orHas(relation: Relation, operator: Operator, count: number): QueryBuilder

	// Add a relationship count / exists condition to the query.
	// doesntHave(relation: Relation, boolean: string = 'and', callback: Closure|null = null): QueryBuilder
	doesntHave(relation: Relation, boolean: string, callback: Closure | null): QueryBuilder

	// Add a relationship count / exists condition to the query with an "or".
	orDoesntHave(relation: Relation): QueryBuilder

	// Add a relationship count / exists condition to the query with where clauses.
	// whereHas(relation: Relation, callback: Closure|null = null, operator: Operator = '>=', count: number = 1): QueryBuilder
	whereHas(
		relation: Relation,
		callback: Closure | null,
		operator: Operator,
		count: number,
	): QueryBuilder

	// Add a relationship count / exists condition to the query with where clauses.
	// withWhereHas(relation: Relation, callback: Closure|null = null, operator: Operator = '>=', count: number = 1): QueryBuilder
	withWhereHas(
		relation: Relation,
		callback: Closure | null,
		operator: Operator,
		count: number,
	): QueryBuilder

	// Add a relationship count / exists condition to the query with where clauses and an "or".
	// orWhereHas(relation: Relation, callback: Closure|null = null, operator: Operator = '>=', count: number = 1): QueryBuilder
	orWhereHas(
		relation: Relation,
		callback: Closure | null,
		operator: Operator,
		count: number,
	): QueryBuilder

	// Add a relationship count / exists condition to the query with where clauses.
	// whereDoesntHave(relation: Relation, callback: Closure|null = null): QueryBuilder
	whereDoesntHave(relation: Relation, callback: Closure | null): QueryBuilder

	// Add a relationship count / exists condition to the query with where clauses and an "or".
	// orWhereDoesntHave(relation: Relation, callback: Closure|null = null): QueryBuilder
	orWhereDoesntHave(relation: Relation, callback: Closure | null): QueryBuilder

	// Add a polymorphic relationship count / exists condition to the query.
	// hasMorph(relation: Relation, types: string|string[], operator: Operator = '>=', count: number = 1, boolean: string = 'and', callback: Closure|null = null): QueryBuilder
	hasMorph(
		relation: Relation,
		types: string | string[],
		operator: Operator,
		count: number,
		boolean: string,
		callback: Closure | null,
	): QueryBuilder

	// Add a polymorphic relationship count / exists condition to the query with an "or".
	// orHasMorph(relation: Relation, types: string|string[], operator: Operator = '>=', count: number = 1): QueryBuilder
	orHasMorph(
		relation: Relation,
		types: string | string[],
		operator: Operator,
		count: number,
	): QueryBuilder

	// Add a polymorphic relationship count / exists condition to the query.
	// doesntHaveMorph(relation: Relation, types: string|string[], boolean: string = 'and', callback: Closure|null = null): QueryBuilder
	doesntHaveMorph(
		relation: Relation,
		types: string | string[],
		boolean: string,
		callback: Closure | null,
	): QueryBuilder

	// Add a polymorphic relationship count / exists condition to the query with an "or".
	orDoesntHaveMorph(relation: Relation, types: string | string[]): QueryBuilder

	// Add a polymorphic relationship count / exists condition to the query with where clauses.
	// whereHasMorph(relation: Relation, types: string|string[], callback: Closure|null = null, operator: Operator = '>=', count: number = 1): QueryBuilder
	whereHasMorph(
		relation: Relation,
		types: string | string[],
		callback: Closure | null,
		operator: Operator,
		count: number,
	): QueryBuilder

	// Add a polymorphic relationship count / exists condition to the query with where clauses and an "or".
	// orWhereHasMorph(relation: Relation, types: string|string[], callback: Closure|null = null, operator: Operator = '>=', count: number = 1): QueryBuilder
	orWhereHasMorph(
		relation: Relation,
		types: string | string[],
		callback: Closure | null,
		operator: Operator,
		count: number,
	): QueryBuilder

	// Add a polymorphic relationship count / exists condition to the query with where clauses.
	// whereDoesntHaveMorph(relation: Relation, types: string|string[], callback: Closure|null = null): QueryBuilder
	whereDoesntHaveMorph(
		relation: Relation,
		types: string | string[],
		callback: Closure | null,
	): QueryBuilder

	// Add a polymorphic relationship count / exists condition to the query with where clauses and an "or".
	// orWhereDoesntHaveMorph(relation: Relation, types: string|string[], callback: Closure|null = null): QueryBuilder
	orWhereDoesntHaveMorph(
		relation: Relation,
		types: string | string[],
		callback: Closure | null,
	): QueryBuilder

	// Add a basic where clause to a relationship query.
	whereRelation(
		relation: Relation,
		column: Column,
		operator: Operator | null,
		value: string | number | null,
	): QueryBuilder

	// Add an "or where" clause to a relationship query.
	orWhereRelation(
		relation: Relation,
		column: Column,
		operator: Operator | null,
		value: string | number | null,
	): QueryBuilder

	// Add a polymorphic relationship condition to the query with a where clause.
	whereMorphRelation(
		relation: Relation,
		types: string | string[],
		column: Column,
		operator: Operator | null,
		value: string | number | null,
	): QueryBuilder

	// Add a polymorphic relationship condition to the query with an "or where" clause.
	orWhereMorphRelation(
		relation: Relation,
		types: string | string[],
		column: Column,
		operator: Operator | null,
		value: string | number | null,
	): QueryBuilder

	// Add a morph-to relationship condition to the query.
	// whereMorphedTo(relation: Relation, model: string, boolean: string = 'and'): QueryBuilder
	whereMorphedTo(relation: Relation, model: string, boolean: string): QueryBuilder

	// Add a not morph-to relationship condition to the query.
	// whereNotMorphedTo(relation: Relation, model: string, boolean: string = 'and'): QueryBuilder
	whereNotMorphedTo(relation: Relation, model: string, boolean: string): QueryBuilder

	// Add a morph-to relationship condition to the query with an "or where" clause.
	orWhereMorphedTo(relation: Relation, model: string): QueryBuilder

	// Add a not morph-to relationship condition to the query with an "or where" clause.
	orWhereNotMorphedTo(relation: Relation, model: string): QueryBuilder
}
