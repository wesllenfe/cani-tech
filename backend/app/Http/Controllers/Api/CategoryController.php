<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with(['expenses', 'donations'])->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function store(CategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Categoria criada com sucesso.',
            'data' => $category
        ], 201);
    }

    public function show(Category $category)
    {
        $category->load(['expenses', 'donations']);

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Categoria atualizada com sucesso.',
            'data' => $category
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Categoria excluída com sucesso.'
        ]);
    }
}
