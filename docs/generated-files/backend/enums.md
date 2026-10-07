# Enums

PHP enum classes are automatically generated for each enum column defined in your module schema.

```php
<?php

namespace App\Enums;

enum PostStatusEnum: string
{
    case DRAFT = 'draft';
    case IN_REVIEW = 'in_review';
    case PUBLISHED = 'published';
}
```

## Overview

Each enum column in your module schema generates a corresponding PHP backed enum class. The enum class name follows the pattern `{ModelName}{ColumnName}Enum` (e.g., `PostStatusEnum` for a `status` column on the `Post` model).

## Enum Values

- **Case Names**: Enum case names are `UPPER_SNAKE_CASE` versions of the original human-readable values (e.g., `DRAFT`, `IN_REVIEW`).
- **Case Values**: Enum case values are `snake_case` versions of the original human-readable values (e.g., `'draft'`, `'in_review'`).

## Usage

These enum classes are automatically used in:
- **Migrations**: Enum values are extracted using `array_map(fn ($case) => $case->value, PostStatusEnum::cases())`.
- **Factories**: Enum values are used for faker data generation.

The enums are PHP 8.1+ backed enums with string values, allowing you to use them throughout your application for type-safe enum handling.

