# Laravel Types

## `LaravelPaginationResponse`

```typescript
export interface LaravelPaginationResponse<T> extends FullLaravelPaginationMeta {
	data: T extends Model ? Plain<Model>[] : T[]
}
```

## `MinimalLaravelPaginationMeta`

```typescript
export interface MinimalLaravelPaginationMeta {
	current_page: number
	from: number
	last_page: number
	per_page: number
	to: number
	total: number
}
```

## `FullLaravelPaginationMeta`

```typescript
export interface FullLaravelPaginationMeta extends MinimalLaravelPaginationMeta {
	links: Array<{
		url: string | null
		label: string
		active: boolean
	}>
	path: string
}
```
