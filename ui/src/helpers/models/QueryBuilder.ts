import type { Filter } from '@/interfaces/models/Filter'
import type { Closure, Operator } from '@/interfaces/models/QueryBuilder'
import type { ModelColumnKey, ModelRelationKey, Model as ModelType, RelationModel } from './Model'

export default class QueryBuilder<Model extends ModelType> {
	#query: Filter = []

	#addMethodToQuery(method: string, params: any[]): void {
		this.#query.push({
			type: 'method',
			method,
			params: params.map((param) => {
				if (typeof param === 'function') {
					const closureQueryBuilder = new QueryBuilder()
					param(closureQueryBuilder)
					return {
						type: 'closure',
						params: closureQueryBuilder.getFilter(),
					}
				} else {
					return {
						type: 'value',
						value: param,
					}
				}
			}),
		})
	}

	/** Get the underlying filter specification. */
	getFilter(): Filter {
		return this.#query
	}

	/** Add a where clause on the primary key to the query. */
	whereKey(id: Model['id']): this {
		this.#addMethodToQuery('whereKey', [id])
		return this
	}

	/** Add a where clause on the primary key to the query. */
	whereKeyNot(id: Model['id']): this {
		this.#addMethodToQuery('whereKeyNot', [id])
		return this
	}

	/** Add a basic where clause to the query. */
	where(column: Closure): this
	where(
		column: ModelColumnKey<Model> | ModelColumnKey<Model>[],
		operator: Operator | null,
		value: string | number | boolean | null,
		boolean?: 'and' | 'or',
	): this
	where(
		column: Closure | ModelColumnKey<Model> | ModelColumnKey<Model>[],
		operator: Operator | null = null,
		value: string | number | boolean | null = null,
		boolean: 'and' | 'or' = 'and',
	): this {
		if (typeof column === 'function') {
			this.#addMethodToQuery('where', [column])
		} else {
			this.#addMethodToQuery('where', [column, operator, value, boolean])
		}
		return this
	}

	/** Add an "or where" clause to the query. */
	orWhere(column: Closure): this
	orWhere(
		column: ModelColumnKey<Model> | ModelColumnKey<Model>[],
		operator: Operator | null,
		value: string | number | boolean | null,
	): this
	orWhere(
		column: Closure | ModelColumnKey<Model> | ModelColumnKey<Model>[],
		operator: Operator | null = null,
		value: string | number | boolean | null = null,
	): this {
		if (typeof column === 'function') {
			this.#addMethodToQuery('orWhere', [column])
		} else {
			this.#addMethodToQuery('orWhere', [column, operator, value])
		}
		return this
	}

	/** Add a basic "where not" clause to the query. */
	whereNot(column: Closure): this
	whereNot(
		column: ModelColumnKey<Model> | ModelColumnKey<Model>[],
		operator: Operator | null,
		value: string | number | boolean | null,
		boolean?: 'and' | 'or',
	): this
	whereNot(
		column: Closure | ModelColumnKey<Model> | ModelColumnKey<Model>[],
		operator: Operator | null = null,
		value: string | number | boolean | null = null,
		boolean: 'and' | 'or' = 'and',
	): this {
		if (typeof column === 'function') {
			this.#addMethodToQuery('whereNot', [column])
		} else {
			this.#addMethodToQuery('whereNot', [column, operator, value, boolean])
		}
		return this
	}

	/** Add an "or where not" clause to the query. */
	orWhereNot(column: Closure): this
	orWhereNot(
		column: ModelColumnKey<Model> | ModelColumnKey<Model>[],
		operator: Operator | null,
		value: string | number | boolean | null,
	): this
	orWhereNot(
		column: Closure | ModelColumnKey<Model> | ModelColumnKey<Model>[],
		operator: Operator | null = null,
		value: string | number | boolean | null = null,
	): this {
		if (typeof column === 'function') {
			this.#addMethodToQuery('orWhereNot', [column])
		} else {
			this.#addMethodToQuery('orWhereNot', [column, operator, value])
		}
		return this
	}

	/** Add an "order by" clause for a timestamp to the query. */
	latest(column: ModelColumnKey<Model> | null = null): this {
		this.#addMethodToQuery('latest', [column])
		return this
	}

	/** Add an "order by" clause for a timestamp to the query. */
	oldest(column: ModelColumnKey<Model> | null = null): this {
		this.#addMethodToQuery('oldest', [column])
		return this
	}

	// /** Set the columns to be selected. */
	// select(columns: [] | ['*']): this
	// select<K extends readonly ModelColumnKey<Model>[]>(...columns: K): this
	// select<K extends readonly ModelColumnKey<Model>[]>(columns: K): this
	// select(columns: ModelColumnKey<Model>[] | [] | ['*'] = ['*']): QueryBuilder<Optional<Model>> {
	// 	if (columns.length === 1 && columns[0] === '*') {
	// 		this.#addMethodToQuery('select', [columns])
	// 		return this
	// 	} else if (columns.length === 0) {
	// 		this.#addMethodToQuery('select', [['*']])
	// 		return this
	// 	} else {
	// 		this.#addMethodToQuery('select', [columns])
	// 		return this
	// 	}
	// }

	// /** Add a new select column to the query. */
	// addSelect(columns: [] | ['*']): this
	// addSelect<K extends readonly ModelColumnKey<Model>[]>(...columns: K): this
	// addSelect<K extends readonly ModelColumnKey<Model>[]>(columns: K): this
	// addSelect(columns: ModelColumnKey<Model>[] | [] | ['*'] = ['*']): this {
	// 	this.#addMethodToQuery('addSelect', [columns])
	// 	return this
	// }

	/** Force the query to only return distinct results. */
	distinct(): this {
		this.#addMethodToQuery('distinct', [])
		return this
	}

	/** Add a "where" clause comparing two columns to the query. */
	whereColumn(
		column: ModelColumnKey<Model> | ModelColumnKey<Model>[],
		operator: Operator | null = null,
		second: string | null = null,
		boolean: string | null = null,
	): this {
		this.#addMethodToQuery('whereColumn', [column, operator, second, boolean])
		return this
	}

	/** Add an "or where" clause comparing two columns to the query. */
	orWhereColumn(
		column: ModelColumnKey<Model> | ModelColumnKey<Model>[],
		operator: Operator | null = null,
		second: string | null = null,
	): this {
		this.#addMethodToQuery('orWhereColumn', [column, operator, second])
		return this
	}

	/** Add a "where in" clause to the query. */
	whereIn(
		column: ModelColumnKey<Model>,
		values: string[] | number[],
		boolean: string = 'and',
		not: boolean = false,
	): this {
		this.#addMethodToQuery('whereIn', [column, values, boolean, not])
		return this
	}

	/** Add an "or where in" clause to the query. */
	orWhereIn(column: ModelColumnKey<Model>, values: string[] | number[]): this {
		this.#addMethodToQuery('orWhereIn', [column, values])
		return this
	}

	/** Add a "where not in" clause to the query. */
	whereNotIn(
		column: ModelColumnKey<Model>,
		values: string[] | number[],
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereNotIn', [column, values, boolean])
		return this
	}

	/** Add an "or where not in" clause to the query. */
	orWhereNotIn(column: ModelColumnKey<Model>, values: string[] | number[]): this {
		this.#addMethodToQuery('orWhereNotIn', [column, values])
		return this
	}

	/** Add a "where null" clause to the query. */
	whereNull(
		columns: ModelColumnKey<Model> | ModelColumnKey<Model>[],
		boolean: string = 'and',
		not: boolean = false,
	): this {
		this.#addMethodToQuery('whereNull', [columns, boolean, not])
		return this
	}

	/** Add an "or where null" clause to the query. */
	orWhereNull(column: ModelColumnKey<Model>): this {
		this.#addMethodToQuery('orWhereNull', [column])
		return this
	}

	/** Add a "where not null" clause to the query. */
	whereNotNull(
		columns: ModelColumnKey<Model> | ModelColumnKey<Model>[],
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereNotNull', [columns, boolean])
		return this
	}

	/** Add a where between statement to the query. */
	whereBetween(
		column: ModelColumnKey<Model>,
		iterable: [string | number, string | number],
		boolean: string = 'and',
		not: boolean = false,
	): this {
		this.#addMethodToQuery('whereBetween', [column, iterable, boolean, not])
		return this
	}

	/** Add a where between statement using columns to the query. */
	whereBetweenColumns(
		column: ModelColumnKey<Model>,
		values: [string, string],
		boolean: string = 'and',
		not: boolean = false,
	): this {
		this.#addMethodToQuery('whereBetweenColumns', [column, values, boolean, not])
		return this
	}

	/** Add an or where between statement to the query. */
	orWhereBetween(
		column: ModelColumnKey<Model>,
		iterable: [string | number, string | number],
	): this {
		this.#addMethodToQuery('orWhereBetween', [column, iterable])
		return this
	}

	/** Add an or where between statement using columns to the query. */
	orWhereBetweenColumns(column: ModelColumnKey<Model>, values: [string, string]): this {
		this.#addMethodToQuery('orWhereBetweenColumns', [column, values])
		return this
	}

	/** Add a where not between statement to the query. */
	whereNotBetween(
		column: ModelColumnKey<Model>,
		iterable: [string | number, string | number],
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereNotBetween', [column, iterable, boolean])
		return this
	}

	/** Add a where not between statement using columns to the query. */
	whereNotBetweenColumns(
		column: ModelColumnKey<Model>,
		values: [string, string],
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereNotBetweenColumns', [column, values, boolean])
		return this
	}

	/** Add an or where not between statement to the query. */
	orWhereNotBetween(
		column: ModelColumnKey<Model>,
		iterable: [string | number, string | number],
	): this {
		this.#addMethodToQuery('orWhereNotBetween', [column, iterable])
		return this
	}

	/** Add an or where not between statement using columns to the query. */
	orWhereNotBetweenColumns(column: ModelColumnKey<Model>, values: [string, string]): this {
		this.#addMethodToQuery('orWhereNotBetweenColumns', [column, values])
		return this
	}

	/** Add an "or where not null" clause to the query. */
	orWhereNotNull(column: ModelColumnKey<Model>): this {
		this.#addMethodToQuery('orWhereNotNull', [column])
		return this
	}

	/** Add a "where date" statement to the query. */
	whereDate(
		column: ModelColumnKey<Model>,
		operator: Operator,
		value: string | null = null,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereDate', [column, operator, value, boolean])
		return this
	}

	/** Add an "or where date" statement to the query. */
	orWhereDate(
		column: ModelColumnKey<Model>,
		operator: Operator,
		value: string | null = null,
	): this {
		this.#addMethodToQuery('orWhereDate', [column, operator, value])
		return this
	}

	/** Add a "where time" statement to the query. */
	whereTime(
		column: ModelColumnKey<Model>,
		operator: Operator,
		value: string | null = null,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereTime', [column, operator, value, boolean])
		return this
	}

	/** Add an "or where time" statement to the query. */
	orWhereTime(
		column: ModelColumnKey<Model>,
		operator: Operator,
		value: string | null = null,
	): this {
		this.#addMethodToQuery('orWhereTime', [column, operator, value])
		return this
	}

	/** Add a "where day" statement to the query. */
	whereDay(
		column: ModelColumnKey<Model>,
		operator: Operator | null = null,
		value: string | null = null,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereDay', [column, operator, value, boolean])
		return this
	}

	/** Add an "or where day" statement to the query. */
	orWhereDay(
		column: ModelColumnKey<Model>,
		operator: Operator | null = null,
		value: string | null = null,
	): this {
		this.#addMethodToQuery('orWhereDay', [column, operator, value])
		return this
	}

	/** Add a "where month" statement to the query. */
	whereMonth(
		column: ModelColumnKey<Model>,
		operator: Operator | null = null,
		value: string | null = null,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereMonth', [column, operator, value, boolean])
		return this
	}

	/** Add an "or where month" statement to the query. */
	orWhereMonth(
		column: ModelColumnKey<Model>,
		operator: Operator | null = null,
		value: string | null = null,
	): this {
		this.#addMethodToQuery('orWhereMonth', [column, operator, value])
		return this
	}

	/** Add a "where year" statement to the query. */
	whereYear(
		column: ModelColumnKey<Model>,
		operator: Operator | null = null,
		value: string | null = null,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereYear', [column, operator, value, boolean])
		return this
	}

	/** Add an "or where year" statement to the query. */
	orWhereYear(
		column: ModelColumnKey<Model>,
		operator: Operator | null = null,
		value: string | null = null,
	): this {
		this.#addMethodToQuery('orWhereYear', [column, operator, value])
		return this
	}

	/** Add an exists clause to the query. */
	whereExists(callback: Closure, boolean: string = 'and', not: boolean = false): this {
		this.#addMethodToQuery('whereExists', [callback, boolean, not])
		return this
	}

	/** Add an or exists clause to the query. */
	orWhereExists(callback: Closure, not: boolean = false): this {
		this.#addMethodToQuery('orWhereExists', [callback, not])
		return this
	}

	/** Add a where not exists clause to the query. */
	whereNotExists(callback: Closure, boolean: string = 'and'): this {
		this.#addMethodToQuery('whereNotExists', [callback, boolean])
		return this
	}

	/** Add a where not exists clause to the query. */
	orWhereNotExists(callback: Closure): this {
		this.#addMethodToQuery('orWhereNotExists', [callback])
		return this
	}

	/** Add a "where JSON contains" clause to the query. */
	whereJsonContains(
		column: string,
		value: string | number | boolean,
		boolean: string = 'and',
		not: boolean = false,
	): this {
		this.#addMethodToQuery('whereJsonContains', [column, value, boolean, not])
		return this
	}

	/** Add an "or where JSON contains" clause to the query. */
	orWhereJsonContains(column: string, value: string | number | boolean): this {
		this.#addMethodToQuery('orWhereJsonContains', [column, value])

		return this
	}

	/** Add a "where JSON not contains" clause to the query. */
	whereJsonDoesntContain(
		column: string,
		value: string | number | boolean,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereJsonDoesntContain', [column, value, boolean])
		return this
	}

	/** Add an "or where JSON not contains" clause to the query. */
	orWhereJsonDoesntContain(column: string, value: string | number | boolean): this {
		this.#addMethodToQuery('orWhereJsonDoesntContain', [column, value])
		return this
	}

	/** Add a clause that determines if a JSON path exists to the query. */
	whereJsonContainsKey(column: string, boolean: string = 'and', not: boolean = false): this {
		this.#addMethodToQuery('whereJsonContainsKey', [column, boolean, not])
		return this
	}

	/** Add an "or" clause that determines if a JSON path exists to the query. */
	orWhereJsonContainsKey(column: string): this {
		this.#addMethodToQuery('orWhereJsonContainsKey', [column])
		return this
	}

	/** Add a clause that determines if a JSON path does not exist to the query. */
	whereJsonDoesntContainKey(column: string, boolean: string = 'and'): this {
		this.#addMethodToQuery('whereJsonDoesntContainKey', [column, boolean])
		return this
	}

	/** Add an "or" clause that determines if a JSON path does not exist to the query. */
	orWhereJsonDoesntContainKey(column: string): this {
		this.#addMethodToQuery('orWhereJsonDoesntContainKey', [column])
		return this
	}

	/** Add a "where JSON length" clause to the query. */
	whereJsonLength(
		column: string,
		operator: Operator,
		value: number,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereJsonLength', [column, operator, value, boolean])
		return this
	}

	/** Add an "or where JSON length" clause to the query. */
	orWhereJsonLength(column: string, operator: Operator, value: number): this {
		this.#addMethodToQuery('orWhereJsonLength', [column, operator, value])
		return this
	}

	/** Add a "where fulltext" clause to the query. */
	whereFullText(
		columns: ModelColumnKey<Model> | ModelColumnKey<Model>[],
		value: string,
		options: string[] = [],
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereFullText', [columns, value, options, boolean])
		return this
	}

	/** Add a "or where fulltext" clause to the query. */
	orWhereFullText(
		columns: ModelColumnKey<Model> | ModelColumnKey<Model>[],
		value: string,
		options: string[] = [],
	): this {
		this.#addMethodToQuery('orWhereFullText', [columns, value, options])
		return this
	}

	/** Add a "where" clause to the query for multiple columns with "and" conditions between them. */
	whereAll(
		columns: ModelColumnKey<Model>[],
		operator: Operator,
		value: string | number | boolean | null,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereAll', [columns, operator, value, boolean])
		return this
	}

	/** Add an "or where" clause to the query for multiple columns with "and" conditions between them. */
	orWhereAll(
		columns: ModelColumnKey<Model>[],
		operator: Operator,
		value: string | number | null,
	): this {
		this.#addMethodToQuery('orWhereAll', [columns, operator, value])
		return this
	}

	/** Add an "where" clause to the query for multiple columns with "or" conditions between them. */
	whereAny(
		columns: ModelColumnKey<Model>[],
		operator: Operator,
		value: string | number | boolean | null,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereAny', [columns, operator, value, boolean])
		return this
	}

	/** Add an "or where" clause to the query for multiple columns with "or" conditions between them. */
	orWhereAny(
		columns: ModelColumnKey<Model>[],
		operator: Operator,
		value: string | number | boolean | null,
	): this {
		this.#addMethodToQuery('orWhereAny', [columns, operator, value])
		return this
	}

	/** Add a "group by" clause to the query. */
	groupBy(...groups: ModelColumnKey<Model>[]): this {
		this.#addMethodToQuery('groupBy', groups)
		return this
	}

	/** Add a "having" clause to the query. */
	having(
		column: string,
		operator: Operator,
		value: string | number | boolean | null,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('having', [column, operator, value, boolean])
		return this
	}

	/** Add an "or having" clause to the query. */
	orHaving(column: string, operator: Operator, value: string | number | boolean | null): this {
		this.#addMethodToQuery('orHaving', [column, operator, value])
		return this
	}

	/** Add a nested having statement to the query. */
	havingNested(callback: Closure, boolean: string = 'and'): this {
		this.#addMethodToQuery('havingNested', [callback, boolean])
		return this
	}

	/** Add a "having null" clause to the query. */
	havingNull(columns: string[], boolean: string = 'and', not: boolean = false): this {
		this.#addMethodToQuery('havingNull', [columns, boolean, not])
		return this
	}

	/** Add an "or having null" clause to the query. */
	orHavingNull(column: string): this {
		this.#addMethodToQuery('orHavingNull', [column])
		return this
	}

	/** Add a "having not null" clause to the query. */
	havingNotNull(columns: string[], boolean: string = 'and'): this {
		this.#addMethodToQuery('havingNotNull', [columns, boolean])
		return this
	}

	/** Add an "or having not null" clause to the query. */
	orHavingNotNull(column: string): this {
		this.#addMethodToQuery('orHavingNotNull', [column])
		return this
	}

	/** Add a "having between " clause to the query. */
	havingBetween(
		column: string,
		iterable: [string | number, string | number],
		boolean: string = 'and',
		not: boolean = false,
	): this {
		this.#addMethodToQuery('havingBetween', [column, iterable, boolean, not])
		return this
	}

	/** Add an "order by" clause to the query. */
	orderBy(column: ModelColumnKey<Model>, direction: 'asc' | 'desc' = 'asc'): this {
		this.#addMethodToQuery('orderBy', [column, direction])
		return this
	}

	/** Add a descending "order by" clause to the query. */
	orderByDesc(column: ModelColumnKey<Model>): this {
		this.#addMethodToQuery('orderByDesc', [column])
		return this
	}

	/** Put the query's results in random order. */
	inRandomOrder(seed: string | number = ''): this {
		this.#addMethodToQuery('inRandomOrder', [seed])
		return this
	}

	/** Alias to set the "offset" value of the query. */
	skip(value: number): this {
		this.#addMethodToQuery('skip', [value])
		return this
	}

	/** Set the "offset" value of the query. */
	offset(value: number): this {
		this.#addMethodToQuery('offset', [value])
		return this
	}

	/** Alias to set the "limit" value of the query. */
	take(value: number): this {
		this.#addMethodToQuery('take', [value])
		return this
	}

	/** Set the "limit" value of the query. */
	limit(value: number): this {
		this.#addMethodToQuery('limit', [value])
		return this
	}

	/** Set the limit and offset for a given page. */
	forPage(page: number, perPage: number = 15): this {
		this.#addMethodToQuery('forPage', [page, perPage])
		return this
	}

	/** Constrain the query to the previous "page" of results before a given Model['id']. */
	forPageBeforeId(
		perPage: number = 15,
		lastId: Model['id'] | null = null,
		column: ModelColumnKey<Model> = 'id' as ModelColumnKey<Model>,
	): this {
		this.#addMethodToQuery('forPageBeforeId', [perPage, lastId, column])
		return this
	}

	/** Constrain the query to the next "page" of results after a given Model['id']. */
	forPageAfterId(
		perPage: number = 15,
		lastId: Model['id'] | null = null,
		column: ModelColumnKey<Model> = 'id' as ModelColumnKey<Model>,
	): this {
		this.#addMethodToQuery('forPageAfterId', [perPage, lastId, column])
		return this
	}

	/** Remove all existing orders and optionally add a new order. */
	reorder(column: ModelColumnKey<Model> | null = null, direction: 'asc' | 'desc' = 'asc'): this {
		this.#addMethodToQuery('reorder', [column, direction])
		return this
	}

	/** Add a relationship count / exists condition to the query. */
	has(
		relation: ModelRelationKey<Model>,
		operator: Operator = '>=',
		count: number = 1,
		boolean: string = 'and',
		callback: Closure | null = null,
	): this {
		this.#addMethodToQuery('has', [relation, operator, count, boolean, callback])
		return this
	}

	/** Add nested relationship count / exists conditions to the query. */
	hasNested(
		relations: ModelRelationKey<Model>,
		operator: Operator = '>=',
		count: number = 1,
		boolean: string = 'and',
		callback: Closure | null = null,
	): this {
		this.#addMethodToQuery('hasNested', [relations, operator, count, boolean, callback])
		return this
	}

	/** Add a relationship count / exists condition to the query with an "or". */
	orHas(relation: ModelRelationKey<Model>, operator: Operator = '>=', count: number = 1): this {
		this.#addMethodToQuery('orHas', [relation, operator, count])
		return this
	}

	/** Add a relationship count / exists condition to the query. */
	doesntHave(
		relation: ModelRelationKey<Model>,
		boolean: string = 'and',
		callback: Closure | null = null,
	): this {
		this.#addMethodToQuery('doesntHave', [relation, boolean, callback])
		return this
	}

	/** Add a relationship count / exists condition to the query with an "or". */
	orDoesntHave(relation: ModelRelationKey<Model>): this {
		this.#addMethodToQuery('orDoesntHave', [relation])
		return this
	}

	/** Add a relationship count / exists condition to the query with where clauses. */
	whereHas(
		relation: ModelRelationKey<Model>,
		callback: Closure | null = null,
		operator: Operator = '>=',
		count: number = 1,
	): this {
		this.#addMethodToQuery('whereHas', [relation, callback, operator, count])
		return this
	}

	/** Add a relationship count / exists condition to the query with where clauses. */
	withWhereHas<R extends ModelRelationKey<Model>>(
		relation: R,
		callback: Closure | null = null,
		operator: Operator = '>=',
		count: number = 1,
	): this {
		this.#addMethodToQuery('withWhereHas', [relation, callback, operator, count])
		return this
	}

	/** Add a relationship count / exists condition to the query with where clauses and an "or". */
	orWhereHas(
		relation: ModelRelationKey<Model>,
		callback: Closure | null = null,
		operator: Operator = '>=',
		count: number = 1,
	): this {
		this.#addMethodToQuery('orWhereHas', [relation, callback, operator, count])
		return this
	}

	/** Add a relationship count / exists condition to the query with where clauses. */
	whereDoesntHave(relation: ModelRelationKey<Model>, callback: Closure | null = null): this {
		this.#addMethodToQuery('whereDoesntHave', [relation, callback])
		return this
	}

	/** Add a relationship count / exists condition to the query with where clauses and an "or". */
	orWhereDoesntHave(relation: ModelRelationKey<Model>, callback: Closure | null = null): this {
		this.#addMethodToQuery('orWhereDoesntHave', [relation, callback])
		return this
	}

	/** Add a polymorphic relationship count / exists condition to the query. */
	hasMorph(
		relation: ModelRelationKey<Model>,
		types: string | string[],
		operator: Operator = '>=',
		count: number = 1,
		boolean: string = 'and',
		callback: Closure | null = null,
	): this {
		this.#addMethodToQuery('hasMorph', [relation, types, operator, count, boolean, callback])
		return this
	}

	/** Add a polymorphic relationship count / exists condition to the query with an "or". */
	orHasMorph(
		relation: ModelRelationKey<Model>,
		types: string | string[],
		operator: Operator = '>=',
		count: number = 1,
	): this {
		this.#addMethodToQuery('orHasMorph', [relation, types, operator, count])
		return this
	}

	/** Add a polymorphic relationship count / exists condition to the query. */
	doesntHaveMorph(
		relation: ModelRelationKey<Model>,
		types: string | string[],
		boolean: string = 'and',
		callback: Closure | null = null,
	): this {
		this.#addMethodToQuery('doesntHaveMorph', [relation, types, boolean, callback])
		return this
	}

	/** Add a polymorphic relationship count / exists condition to the query with an "or". */
	orDoesntHaveMorph(relation: ModelRelationKey<Model>, types: string | string[]): this {
		this.#addMethodToQuery('orDoesntHaveMorph', [relation, types])
		return this
	}

	/** Add a polymorphic relationship count / exists condition to the query with where clauses. */
	whereHasMorph(
		relation: ModelRelationKey<Model>,
		types: string | string[],
		callback: Closure | null = null,
		operator: Operator = '>=',
		count: number = 1,
	): this {
		this.#addMethodToQuery('whereHasMorph', [relation, types, callback, operator, count])
		return this
	}

	/** Add a polymorphic relationship count / exists condition to the query with where clauses and an "or". */
	orWhereHasMorph(
		relation: ModelRelationKey<Model>,
		types: string | string[],
		callback: Closure | null = null,
		operator: Operator = '>=',
		count: number = 1,
	): this {
		this.#addMethodToQuery('orWhereHasMorph', [relation, types, callback, operator, count])
		return this
	}

	/** Add a polymorphic relationship count / exists condition to the query with where clauses. */
	whereDoesntHaveMorph(
		relation: ModelRelationKey<Model>,
		types: string | string[],
		callback: Closure | null = null,
	): this {
		this.#addMethodToQuery('whereDoesntHaveMorph', [relation, types, callback])
		return this
	}

	/** Add a polymorphic relationship count / exists condition to the query with where clauses and an "or". */
	orWhereDoesntHaveMorph(
		relation: ModelRelationKey<Model>,
		types: string | string[],
		callback: Closure | null = null,
	): this {
		this.#addMethodToQuery('orWhereDoesntHaveMorph', [relation, types, callback])
		return this
	}

	/** Add a basic where clause to a relationship query. */
	whereRelation<RelationKey extends ModelRelationKey<Model>>(
		relation: RelationKey,
		column: ModelColumnKey<RelationModel<Model, RelationKey> extends ModelType ? ModelType : never>,
		operator: Operator,
		value: string | number | boolean | null,
	): this {
		this.#addMethodToQuery('whereRelation', [relation, column, operator, value])
		return this
	}

	/** Add an "or where" clause to a relationship query. */
	orWhereRelation<RelationKey extends ModelRelationKey<Model>>(
		relation: RelationKey,
		column: ModelColumnKey<RelationModel<Model, RelationKey> extends ModelType ? ModelType : never>,
		operator: Operator,
		value: string | number | boolean | null,
	): this {
		this.#addMethodToQuery('orWhereRelation', [relation, column, operator, value])
		return this
	}

	/** Add a polymorphic relationship condition to the query with a where clause. */
	whereMorphRelation<RelationKey extends ModelRelationKey<Model>>(
		relation: RelationKey,
		types: string | string[],
		column: ModelColumnKey<RelationModel<Model, RelationKey> extends ModelType ? ModelType : never>,
		operator: Operator,
		value: string | number | boolean | null,
	): this {
		this.#addMethodToQuery('whereMorphRelation', [relation, types, column, operator, value])
		return this
	}

	/** Add a polymorphic relationship condition to the query with an "or where" clause. */
	orWhereMorphRelation<RelationKey extends ModelRelationKey<Model>>(
		relation: RelationKey,
		types: string | string[],
		column: ModelColumnKey<RelationModel<Model, RelationKey> extends ModelType ? ModelType : never>,
		operator: Operator,
		value: string | number | boolean | null,
	): this {
		this.#addMethodToQuery('orWhereMorphRelation', [relation, types, column, operator, value])
		return this
	}

	/** Add a morph-to relationship condition to the query. */
	whereMorphedTo(relation: ModelRelationKey<Model>, model: string, boolean: string = 'and'): this {
		this.#addMethodToQuery('whereMorphedTo', [relation, model, boolean])
		return this
	}

	/** Add a not morph-to relationship condition to the query. */
	whereNotMorphedTo(
		relation: ModelRelationKey<Model>,
		model: string,
		boolean: string = 'and',
	): this {
		this.#addMethodToQuery('whereNotMorphedTo', [relation, model, boolean])
		return this
	}

	/** Add a morph-to relationship condition to the query with an "or where" clause. */
	orWhereMorphedTo(relation: ModelRelationKey<Model>, model: string): this {
		this.#addMethodToQuery('orWhereMorphedTo', [relation, model])
		return this
	}

	/** Add a not morph-to relationship condition to the query with an "or where" clause. */
	orWhereNotMorphedTo(relation: ModelRelationKey<Model>, model: string): this {
		this.#addMethodToQuery('orWhereNotMorphedTo', [relation, model])
		return this
	}
}
