<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class StatusController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            $db_status = 'connected';
            $version = DB::select('select version()');
            $connections = DB::select('select count(*) from pg_stat_activity');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Bem vindo a API do Canitech!',
                'db_status' => 'disconnected',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Bem-vindo ao Canitech, tudo está funcionando conforme esperado.',
            'db_status' => $db_status,
            'db_version' => $version[0]->version,
            'db_connections' => $connections[0]->count,
        ]);
    }
}
