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
        Schema::create('medication_treatments_treatment_medications', function (Blueprint $table) {
            $table->foreignId('treatment_medications_id');
            $table->foreignId('medication_treatments_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medication_treatments_treatment_medications');
    }
};
