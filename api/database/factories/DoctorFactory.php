<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Doctor>
 */
class DoctorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'specialty' => fake()->word(),
            'contact_number' => fake()->phoneNumber(),
            'email_address' => fake()->safeEmail(),
            'consultation_fee' => fake()->randomFloat(2, 8),
            'department_id' => fake()->numberBetween(1, 50),
        ];
    }
}
