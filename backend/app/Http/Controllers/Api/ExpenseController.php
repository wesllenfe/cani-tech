<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with(['category', 'user'])->orderBy('date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $expenses
        ]);
    }

    public function store(ExpenseRequest $request)
    {
        $expense = Expense::create([
            ...$request->validated(),
            'created_by' => auth()->id()
        ]);

        $expense->load(['category', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Despesa criada com sucesso.',
            'data' => $expense
        ], 201);
    }

    public function show(Expense $expense)
    {
        $expense->load(['category', 'user']);

        return response()->json([
            'success' => true,
            'data' => $expense
        ]);
    }

    public function update(ExpenseRequest $request, Expense $expense)
    {
        $expense->update($request->validated());
        $expense->load(['category', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Despesa atualizada com sucesso.',
            'data' => $expense
        ]);
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();

        return response()->json([
            'success' => true,
            'message' => 'Despesa excluída com sucesso.'
        ]);
    }
}
