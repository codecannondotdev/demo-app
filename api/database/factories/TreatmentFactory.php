<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Treatment>
 */
class TreatmentFactory extends Factory
{
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
            'doctor_id' => fake()->numberBetween(1, 50),
            'patient_id' => fake()->numberBetween(1, 50),
        ];
    }
}
