---
outline: 'deep'
---

# Linters

codecannon apps come with linters configured and ready to go.

## Frontend

On the frontend codecannon apps use ESLint for linting.

You can run the linter with the following command:

```bash
npm run lint
```

The ESLint configuration can be found in `ui/.eslintrc.js`.

Additionally linter workflows for Github actions are generated and enabled by
default.

- See also
    - [ESLint Documentation](https://eslint.org/docs/user-guide/getting-started)
    - [CI/CD Documentation](/essentials/ci-cd)
