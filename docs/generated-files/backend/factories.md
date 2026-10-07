# Factories

Factories are generated for every module based on the module specification.

```php
<?php

namespace Database\Factories;

use App\Enums\PlanIntervalEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'price' => fake()->randomFloat(2, 8),
            'interval' => fake()->randomElement(array_map(fn ($case) => $case->value, PlanIntervalEnum::cases())),
            'stripe_price_id' => fake()->uuid(),
        ];
    }
}
```

The factories contain the fields defined on the module.

The factories use the `Faker` library to generate random data for the fields.

The `Faker` methods used are based on the fake data type defined in the module
specification.
