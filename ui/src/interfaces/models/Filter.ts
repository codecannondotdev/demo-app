export type ClosureParam = {
	type: 'closure'
	params: MethodParam[]
}

export type ValueParam = {
	type: 'value'
	value: any
}

export type MethodParam = {
	type: 'method'
	method: string
	params: Array<ValueParam | ClosureParam>
}

export type Filter = MethodParam[]
