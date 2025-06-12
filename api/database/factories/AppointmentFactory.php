<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'appointment_date' => fake()->date(),
            'appointment_time' => fake()->time(),
            'reason_for_visit' => fake()->realText(),
            'department_id' => fake()->numberBetween(1, 50),
            'status' => fake()->randomElement(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
            'nurse_id' => fake()->numberBetween(1, 50),
            'doctor_id' => fake()->numberBetween(1, 50),
            'patient_id' => fake()->numberBetween(1, 50),
        ];
    }
}
