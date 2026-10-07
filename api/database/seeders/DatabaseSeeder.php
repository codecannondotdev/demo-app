<?php

namespace Database\Seeders;

use App\Models\User;
use Closure;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (User::count() > 0) {
            return;
        }
        DB::connection()->disableQueryLog();

        $this->withFastSeeding(function () {
            $this->call([UserSeeder::class/* GENERATOR(SEEDER) */]);
        });
    }

    protected function withFastSeeding(Closure $callback): void
    {
        Schema::disableForeignKeyConstraints();

        DB::beginTransaction();

        try {

            Model::unguarded(function () use ($callback) {
                $callback();
            });

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        } finally {

            Schema::enableForeignKeyConstraints();
        }
    }
}
