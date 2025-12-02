<?php

namespace Database\Factories;

use App\Enums\NurseShiftEnum;
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
            'shift' => fake()->randomElement(array_map(fn ($case) => $case->value, NurseShiftEnum::cases())),
            'contact_number' => fake()->phoneNumber(),
            'email_address' => fake()->safeEmail(),
        ];
    }
}
