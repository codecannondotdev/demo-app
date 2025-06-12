<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Billing>
 */
class BillingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'billing_date' => fake()->date(),
            'amount' => fake()->randomFloat(2, 8),
            'status' => fake()->randomElement(['PENDING', 'PAID', 'OVERDUE']),
            'payment_method' => fake()->randomElement(['CASH', 'CREDIT CARD', 'INSURANCE']),
            'appointment_id' => fake()->numberBetween(1, 50),
            'patient_id' => fake()->numberBetween(1, 50),
        ];
    }
}
