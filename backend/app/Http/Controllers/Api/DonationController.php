<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DonationRequest;
use App\Models\Donation;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    public function index()
    {
        $donations = Donation::with('category')->orderBy('date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $donations
        ]);
    }

    public function store(DonationRequest $request)
    {
        $donation = Donation::create($request->validated());
        $donation->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Doação registrada com sucesso.',
            'data' => $donation
        ], 201);
    }

    public function show(Donation $donation)
    {
        $donation->load('category');

        return response()->json([
            'success' => true,
            'data' => $donation
        ]);
    }

    public function update(DonationRequest $request, Donation $donation)
    {
        $donation->update($request->validated());
        $donation->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Doação atualizada com sucesso.',
            'data' => $donation
        ]);
    }

    public function destroy(Donation $donation)
    {
        $donation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Doação excluída com sucesso.'
        ]);
    }
}
