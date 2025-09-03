<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/mensagem', function () {
    return response()->json(['mensagem' => 'API Laravel funcionando!']);
});
