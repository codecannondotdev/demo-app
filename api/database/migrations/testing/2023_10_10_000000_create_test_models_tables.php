<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('test_model_a', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_model_b_id')->nullable();
        });

        Schema::create('test_model_b', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_model_a_id')->nullable();
        });

        Schema::create('test_model_a_test_model_b', function (Blueprint $table) {
            $table->foreignId('test_model_a_id');
            $table->foreignId('test_model_b_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('test_model_a');
        Schema::dropIfExists('test_model_b');
    }
};
