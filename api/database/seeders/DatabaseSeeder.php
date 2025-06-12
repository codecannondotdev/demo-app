<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (User::count() > 0) {
            return;
        }
        $this->call([UserSeeder::class, PatientSeeder::class, DoctorSeeder::class, NurseSeeder::class, DepartmentSeeder::class, AppointmentSeeder::class, TreatmentSeeder::class, MedicationSeeder::class, BillingSeeder::class, TagSeeder::class]);
    }
}
