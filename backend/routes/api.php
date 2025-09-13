<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AnimalController;
use Illuminate\Support\Facades\Route;

// publicas
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::get('/animals/public', [AnimalController::class, 'publicAvailable']);

Route::middleware('auth:sanctum')->group(function () {

    // autenticado apenas
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::get('/animals', [AnimalController::class, 'index']);
    Route::get('/animals/available', [AnimalController::class, 'available']);
    Route::get('/animals/{animal}', [AnimalController::class, 'show']);
    Route::post('/animals/{animal}/adopt', [AnimalController::class, 'adopt']);
    Route::get('/my-adoptions', [AnimalController::class, 'myAdoptions']);

    // admin e cuidador
    Route::middleware('role:admin,caregiver')->group(function () {
        Route::post('/animals', [AnimalController::class, 'store']);
        Route::put('/animals/{animal}', [AnimalController::class, 'update']);
        Route::patch('/animals/{animal}/status', [AnimalController::class, 'updateStatus']);
        Route::get('/animals/dashboard/statistics', [AnimalController::class, 'statistics']);
        Route::delete('/animals/{animal}', [AnimalController::class, 'destroy']);
    });

    // admin
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/admin/create-user', [UserController::class, 'createAdmin']);
    });
});
