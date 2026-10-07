---
outline: 'deep'
---

# CI/CD

Codecannon apps come with CI/CD workflows configured and ready to go.

Currently, the CI/CD workflows are configured for GitHub Actions. For detailed information about GitHub Actions, refer to the [official GitHub Actions documentation](https://docs.github.com/en/actions).

## Workflow Files

Two main workflow files are included in your generated application:

1. `.github/workflows/pull_request.yml` - Runs on pull requests to the main branch
2. `.github/workflows/push_main.yml` - Runs when code is pushed to the main branch

## On Pull Request

The pull request workflow runs the following jobs:

```yaml
build-ui:
  # Builds the UI Docker image

build-api:
  # Builds the API Docker image

test-api:
  # Runs API tests

format-api:
  # Checks API code formatting

format-check-ui:
  # Checks UI code formatting

type-check-ui:
  # Performs TypeScript type checking for UI

lint-ui:
  # Lints the UI code
```

## On Push Main

The push main workflow runs the same jobs as the pull request workflow:

```yaml
build-ui:
  # Builds the UI Docker image

build-api:
  # Builds the API Docker image

test-api:
  # Runs API tests

format-api:
  # Checks API code formatting

format-check-ui:
  # Checks UI code formatting

type-check-ui:
  # Performs TypeScript type checking for UI

lint-ui:
  # Lints the UI code
```

## Custom Actions

The workflows use custom actions stored in the `.github/actions/` directory:

| Action | Description |
|--------|-------------|
| `docker-build` | Builds Docker images for UI and API |
| `format-api` | Checks PHP code formatting with Laravel Pint |
| `format-ui` | Checks Vue/TS/JS code formatting with Prettier |
| `lint-ui` | Lints UI code with ESLint |
| `test-api` | Runs Laravel tests |
| `type-check-ui` | Runs TypeScript type checking |
