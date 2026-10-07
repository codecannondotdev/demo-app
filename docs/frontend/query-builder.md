---
outline: 'deep'
---

# Query Builder

The Query Builder is a powerful tool that allows you to build complex queries
using a simple and intuitive API. It is used to build filters for the `list`
routes of the CRUD controllers.

The aim with this tool is to resemble the Laravel Eloquent Query Builder as much
as possible, while providing a clear separation between the front-end and back-end
via a REST API.

Let's look at an example usage of the query builder with the `ListState` class:

```typescript
import PostListState from '@/helpers/states/PostListState'

const postListState = new PostListState()

await postListState.query()
  .where('name', 'Lorem ipsum')
  .where('created_at', '>', '2021-01-01')
  .orderBy('name', 'desc')
  .whereHas('creator', q => q.where('name', 'John Doe'))
  .getList()

// Log the list of posts stored in the state
console.log(postListState.list.value)
```

As you can see, the query builder provides a fluent API that allows you to chain
methods together to build complex queries, just like you're used to with Laravel.

We copied the Laravel Eloquent Query Builder API as much as possible, and provided
TypeScript typings to make it easier to work with in your front-end code.

This should allow frontend developers to move swiftly, without depending on
the back-end developers to write custom controllers or routes for each simple
query.

- See also
  - [API - `QueryBuilder`](/api/frontend/query-builder)
  - [API - `ListState.getList`](/api/frontend/list-state#getlist)
  - [API - `ListState.query`](/api/frontend/list-state#query)
  - [API - `Api.list`](/api/frontend/api#list)
