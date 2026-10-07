---
outline: 'deep'
---

# Formatters

codecannon apps come with formatters configured and ready to go.

## Frontend

On the frontend codecannon apps use Prettier for formatting.

You can run the formatter with the following command:

```bash
npm run format
```

The Prettier configuration can be found in `ui/.prettierrc.json`.

Additionally formatter workflows for Github Actions are generated and enabled
by default.

- See also
  - [Prettier Documentation](https://prettier.io/docs/en/index.html)
  - [CI/CD Documentation](/essentials/ci-cd)

## Backend

On the backend codecannon apps use Laravel Pint for formatting.

You can run the formatter with the following commands:

```bash
# Format code
composer run format

# Check formatting without making changes
composer run format-check
```

Alternatively, you can run Pint directly:

```bash
./vendor/bin/pint --parallel
```

Additionally formatter workflows for Github Actions are generated and enabled
by default.

- See also
  - [Laravel Pint Documentation](https://laravel.com/docs/11.x/pint)
  - [CI/CD Documentation](/essentials/ci-cd)
