# Migrations

Migrations are automatically generated based on the module schema.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\PlanIntervalEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price');
            $table->enum('interval', array_map(fn ($case) => $case->value, PlanIntervalEnum::cases()))->nullable();
            $table->string('stripe_price_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
```

The mirations contain the fields defined on the module.

The timestamps and `id` are automatically added to the table.

If there are any relevant validators defined or if the field is required,
the constraints will be added to the migrations.

## Many-to-many migrations

The generator creates one pivot table for each many-to-many relation. It prefixes each relation name with its model name, converts both endpoints to snake_case, and sorts them before joining them. For example, `ModelA.user` with inverse `ModelB.userTeams` uses `model_a_user_model_b_user_teams`. Both Eloquent methods and the migration use that table name. Pivot foreign keys also include the model prefixes, so equal relation names on different models produce distinct columns.

Names longer than MySQL's 64-character identifier limit use a readable prefix followed by a stable 16-character hash of the full name. Both sides calculate the same table name. Long pivot column names keep their `_id` suffix.
