<?php

use App\Enums\BillingPaymentMethodEnum;
use App\Enums\BillingStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('billings', function (Blueprint $table) {
            $table->id();
            $table->date('billing_date');
            $table->decimal('amount');
            $table->enum('status', array_map(fn ($case) => $case->value, BillingStatusEnum::cases()));
            $table->enum('payment_method', array_map(fn ($case) => $case->value, BillingPaymentMethodEnum::cases()));
            $table->foreignId('patient_id')->nullable();
            $table->foreignId('appointment_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billings');
    }
};
