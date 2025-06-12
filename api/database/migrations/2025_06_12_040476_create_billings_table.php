<?php

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
            $table->enum('status', ['PENDING', 'PAID', 'OVERDUE']);
            $table->enum('payment_method', ['CASH', 'CREDIT CARD', 'INSURANCE']);
            $table->foreignId('appointment_id')->nullable();
            $table->foreignId('patient_id')->nullable();
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
