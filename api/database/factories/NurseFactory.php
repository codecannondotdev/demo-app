<?php

namespace Database\Factories;

use App\Models\Nurse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Nurse>
 */
class NurseFactory extends Factory
{
    protected $model = Nurse::class;

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
            'shift' => fake()->randomElement(['MORNING', 'AFTERNOON', 'NIGHT']),
            'contact_number' => fake()->phoneNumber(),
            'email_address' => fake()->safeEmail(),
        ];
    }
}
