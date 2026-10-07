---
outline: 'deep'
---

# `FilterHelper`

The `FilterHelper` class is a helper that handles complex query filtering on the
backend. It is used to apply filters to the query builder based on the request
parameters.

## Usage

The `FilterHelper` class provides a static method `applyFilters` that takes a
query builder instance and an array of filters.

The filters are in JSON format and can have multiple types. Let's look at an
example filter.

```json
[
  [
    {
      "type": "method",
      "method": "where",
      "params": [
        {
          "type": "closure",
          "params": [
            {
              "type": "method",
              "method": "where",
              "params": [
                {
                  "type": "value",
                  "value": "archived"
                },
                {
                  "type": "value",
                  "value": "="
                },
                {
                  "type": "value",
                  "value": false
                }
              ]
            }
          ]
        }
      ]
    }
  ]
]
```

The filter above will be translated into the following Eloquent query:

```php
<?php

$query->where(function ($q) { return $q->where('archived', '=', false); });
```

There's no reason why you would ever create a query like this, but it'll make
it simpler to showcase the structure that includes a closure, which is useful
in many instances in Eloquent.

Let's break down the filter structure. It's defined like this on the frontend
(we'll use typescript types since typescript has more expressive capabilities):

```typescript
type FilterRequestPayload = Filter[]

type Filter = MethodParam[]

type MethodParam = {
	type: 'method'
	method: string // Name of an Eloquent query method you want to use
	params: Array<ValueParam | ClosureParam> // Parameters for the method
}

type ClosureParam = {
	type: 'closure'
	params: MethodParam[] // Array of method calls within the closure
}

type ValueParam = {
	type: 'value'
	value: any // Value to pass to the method
}
```

So applying this to the filter above, we can see the following:
- The first array in the payload is an array of `Filter` objects. It's an array
of these filters so we can apply multiple filters at once. All the filters
applied on this level are combined with an `AND` operator.
- The first filter is an array of `MethodParam` objects. Each `MethodParam`
object represents a method call on the query builder. The method call is defined
by the `method` property. The `params` property is an array of `ValueParam` and
`ClosureParam` objects and represents the params passed to the called method.
- The `ClosureParam` object is a closure parameter that allows you to nest
multiple method calls within a closure. A common pattern in Eloquent for nesting
SQL statements.
- The `ValueParam` object is a value parameter that represents a value that is
passed to the method call.

Many of the Eloquent methods are supported but not all of them. You can find the
list of suppored methods in the `FilterHelper` class.

There are also multiple frontend helpers that allow you to build these filters
with an API that matches the Laravel Eloquent Query Builder API as much as
possible. For example like this:

```typescript
import PostListState from '@/helpers/states/PostListState'

const postListState = new PostListState()

await postListState.query()
  .where('name', 'Lorem ipsum')
  .whereHas('creator', q => q.where('name', 'John Doe'))
  .getList()
```

The FilterHelper is used in the `CRUDControllerHelper` to apply filters to the
query builder based on the request parameters.

- See also
  - [API - `FilterHelper`](/api/backend/filter-helper)
  - [Frontend - Query Builder](/frontend/query-builder)
  - [Backend - CRUD Controller Helper](/backend/crud-controller-helper)
