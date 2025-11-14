<?php

namespace Database\Factories;

use App\Models\Appointment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

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
            'status' => fake()->randomElement(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
        ];
    }
}
