<?php

namespace Database\Factories;

use App\Models\Treatment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Treatment>
 */
class TreatmentFactory extends Factory
{
    protected $model = Treatment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'treatment_date' => fake()->date(),
            'description' => fake()->text(),
            'outcome' => fake()->realText(),
            'cost' => fake()->randomFloat(2, 8),
        ];
    }
}
