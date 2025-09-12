<?php

use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::post('/register', [UserController::class, 'register']); // Sempre cria 'adopter'
Route::post('/login', [UserController::class, 'login']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::get('/users', [UserController::class, 'index']); // Apenas admin
    Route::post('/admin/create-user', [UserController::class, 'createAdmin']);
});
