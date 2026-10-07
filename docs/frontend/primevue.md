---
outline: 'deep'
---

# PrimeVue

This section covers PrimeVue utilities and configurations included with Codecannon apps.

## Composables

### `useApiTable`

The `useApiTable` composable provides a type-safe way to use the `ApiTable` component and its related components (`Column`, `ApiTableLinkButton`, `ApiTableRemoveButton`) with proper TypeScript type inference in Column slot props. It solves the problem where PrimeVue's `DataTable` component doesn't provide type information to its `Column` components, making it difficult to work with typed data in templates. By using `useApiTable`, the `Column` component's `body` slot receives properly typed data (`Plain<Model>`) instead of `any`, enabling full type safety, autocomplete, and compile-time error checking.

- See also: [API - `useApiTable`](/api/frontend/use-api-table)

### `useDataTable`

The `useDataTable` composable provides a type-safe way to use PrimeVue's `DataTable` and `Column` components with proper TypeScript type inference in Column slot props. Similar to `useApiTable`, it solves the type inference problem but is designed for standard PrimeVue `DataTable` components that work with local data or data that doesn't come from a `ListState`. The composable ensures that the `Column` component's `body` slot receives properly typed data instead of `any`, providing type safety and autocomplete for any data type.

- See also: [API - `useDataTable`](/api/frontend/use-data-table)

## PrimeVue Icons Package

The `@primevue/icons` package has been vendored (copied into the codebase) and customized to replace PrimeVue's default icons with FontAwesome icons. This approach was taken because PrimeVue doesn't offer a simple way to overwrite default icons in components.

### Why Vendor the Package?

The official PrimeVue approach for customizing icons suggests either using slots or writing a custom wrapper component for each PrimeVue component you want to customize. However, for components with many icon slots (for example, the `DatePicker` component has 7 different icon slots: calendar, previous month, next month, previous year, next year, clear, and today), both approaches become impractical for different reasons:

1. **A lot of repetitive work with slots** – Every time you use a component like `DatePicker`, you would need to define all 7 icon slots, leading to a lot of repeated code in every usage which is not only time consuming, but also highly error prone.
2. **A lot of upfront work with wrappers** – Creating a custom wrapper component for every PrimeVue component you want to customize involves substantial initial effort and boilerplate and is prone to errors.
3. **Significant maintenance burden** – Any changes to icon slot implementations in primevue require updating all usages (with slots) or refactoring all wrappers.
4. **Risk of brittleness as PrimeVue evolves** – If PrimeVue changes slot names or internal component structures, your customizations can break in many places, requiring broad updates.

Because of these issues, both the slot and wrapper solutions are difficult to scale and maintain.

### Implementation

The vendored package is located at `generator/app-base/ui/src/packages/@primevue/icons/` and is configured in `package.json` using npm's `overrides` feature:

```json
{
  "overrides": {
    "@primevue/icons": "file:./src/packages/@primevue/icons"
  },
  "dependencies": {
    "@primevue/icons": "file:./src/packages/@primevue/icons"
  }
}
```

This ensures that when PrimeVue components import `@primevue/icons`, they receive our customized version with FontAwesome icons instead of the default PrimeVue icons. All PrimeVue components that use icons will automatically use the FontAwesome icons without requiring any additional configuration or slot definitions.
