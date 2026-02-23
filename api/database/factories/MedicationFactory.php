<?php

namespace Database\Factories;

use App\Enums\MedicationDosageFormEnum;
use App\Models\Medication;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Medication>
 */
class MedicationFactory extends Factory
{
    protected $model = Medication::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'description' => fake()->realText(),
            'dosage_form' => fake()->randomElement(array_map(fn ($case) => $case->value, MedicationDosageFormEnum::cases())),
        ];
    }
}
