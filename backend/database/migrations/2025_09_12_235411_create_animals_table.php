<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('animals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('breed')->nullable();
            $table->integer('age_months');
            $table->enum('gender', ['male', 'female']);
            $table->enum('size', ['small', 'medium', 'large', 'extra_large']);
            $table->string('color');
            $table->text('description')->nullable();
            $table->enum('status', ['available', 'adopted', 'under_treatment', 'unavailable'])->default('available');
            $table->boolean('vaccinated')->default(false);
            $table->boolean('neutered')->default(false);
            $table->text('medical_notes')->nullable();
            $table->string('photo_url')->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->date('entry_date');

            $table->foreignId('adopted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('adopted_at')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('animals');
    }
};
