---
outline: 'deep'
---

# Testing

Codecannon come with test environments preconfigured so you can hit the ground
running.

There are some tests already written for critical reusable components and
business logic like Auth, but not every component and view is tested, so you
can choose how much testing you want to do yourself.

## Frontend

In the `ui` service, tests are handled by Vitest. You can run the tests like:
- `npm run test` - for dev test runner with watch mode
- `npm run test:ui` - for dev test runer with Vitest UI
- `npm run test:run` - for test run without watch mode
- `npm run coverage` - for test run with coverage

## Backend

In the `api` service test are handled by Pest. You can run the tests using:

```bash
composer run test
```

Alternatively, you can run Pest directly:

```bash
php artisan test --parallel
```

There are 3 different types of tests:

**Unit**

Unit tests don't use any database connections.

**Helper**

Helper tests use a database with test models and are used for testing helpers
that require a database to be useful, but not your app's database specifically.

**Feature**

Feature tests use the database of your application. You can test your API endpoints
and anything else that depends on your app's database.
