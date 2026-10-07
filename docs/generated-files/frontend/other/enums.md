# Frontend Enums

An `Enums.ts` file is automatically generated for each module that contains enum columns. This file exports enum constants and types for use throughout your frontend application.

```typescript
export const Status = {
	draft: 'Draft',
	in_review: 'In Review',
	published: 'Published',
} as const

export type StatusEnum = (typeof Status)[keyof typeof Status]

export const Role = {
	admin: 'Admin',
	editor: 'Editor',
	user: 'User',
} as const

export type RoleEnum = (typeof Role)[keyof typeof Role]
```

## Overview

For each enum column in your module, the generator creates:
- **A const object**: Named after the column in PascalCase (without the "Enum" suffix), containing key-value pairs where keys are `snake_case` alphanumeric versions and values are the original human-readable strings.
- **A type alias**: Named with the "Enum" suffix (e.g., `StatusEnum`), representing the union type of all possible enum values.

## Usage

These enum constants and types are automatically used in:
- **Models**: Enum columns use the enum type (e.g., `Column<StatusEnum>`) instead of union types.
- **Forms**: Enum constants are used for select options, and enum types are used for form data typing.

## Example Usage

```typescript
import { Status, type StatusEnum } from '@/models/Post/Enums'

// Using the const for options
const options = Object.entries(Status).map(([key, value]) => ({ 
  title: value, 
  value: key 
}))

// Using the type for type safety
function updateStatus(status: StatusEnum) {
  // ...
}
```

The enum constants preserve the original human-readable values for display purposes, while the keys provide normalized `snake_case` identifiers for use in your application logic.

