<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnimalRequest;
use App\Models\Animal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AnimalController extends Controller
{
    /**
     * Listar todos os animais
     */
    public function index(Request $request): JsonResponse
    {
        $query = Animal::query();

        if (auth()->user()->role === 'adopter') {
            $query->available();
        }

        if ($request->has('status') && in_array(auth()->user()->role, ['admin', 'caregiver'])) {
            $query->where('status', $request->status);
        }

        if ($request->has('size')) {
            $query->bySize($request->size);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $animals = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Animais listados com sucesso',
            'data' => $animals,
            'user_role' => auth()->user()->role
        ]);
    }

    /**
     * Criar um novo animal (apenas admin/caregiver)
     */
    public function store(AnimalRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            $animal = Animal::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Animal cadastrado com sucesso',
                'data' => $animal
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao cadastrar animal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibir um animal específico
     */
    public function show(Animal $animal): JsonResponse
    {
        if (auth()->user()->role === 'adopter' && $animal->status !== 'available') {
            return response()->json([
                'success' => false,
                'message' => 'Animal não encontrado'
            ], 404);
        }

        $animal->load(['adoptedBy:id,name']);

        return response()->json([
            'success' => true,
            'message' => 'Animal encontrado',
            'data' => $animal
        ]);
    }

    /**
     * Atualizar um animal (apenas admin/caregiver)
     */
    public function update(AnimalRequest $request, Animal $animal): JsonResponse
    {
        try {
            $data = $request->validated();

            $animal->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Animal atualizado com sucesso',
                'data' => $animal->load(['adoptedBy:id,name'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar animal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remover um animal (apenas admin)
     */
    public function destroy(Animal $animal): JsonResponse
    {
        try {
            if ($animal->status === 'adopted') {
                return response()->json([
                    'success' => false,
                    'message' => 'Não é possível deletar um animal adotado'
                ], 422);
            }

            $animal->delete();

            return response()->json([
                'success' => true,
                'message' => 'Animal removido com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao remover animal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Adotar um animal
     */
    public function adopt(Animal $animal): JsonResponse
    {
        if (!$animal->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'Este animal não está disponível para adoção'
            ], 422);
        }

        $userAdoptedCount = Animal::where('adopted_by', auth()->id())->count();
        if ($userAdoptedCount >= 3) {
            return response()->json([
                'success' => false,
                'message' => 'Você já atingiu o limite máximo de animais adotados'
            ], 422);
        }

        try {
            $animal->markAsAdopted(auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'Parabéns! Animal adotado com sucesso! 🎉',
                'data' => $animal->load(['adoptedBy:id,name'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar adoção',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar apenas animais disponíveis para adoção
     */
    public function available(): JsonResponse
    {
        $animals = Animal::available()
            ->orderBy('entry_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Animais disponíveis listados com sucesso',
            'data' => $animals
        ]);
    }

    /**
     * Atualizar status do animal (apenas admin/caregiver)
     */
    public function updateStatus(Request $request, Animal $animal): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:available,adopted,under_treatment,unavailable',
            'notes' => 'nullable|string|max:500'
        ]);

        try {
            $updateData = ['status' => $request->status];

            if ($request->status === 'adopted' && $request->has('adopted_by')) {
                $updateData['adopted_by'] = $request->adopted_by;
                $updateData['adopted_at'] = now();
            } elseif ($request->status !== 'adopted') {
                $updateData['adopted_by'] = null;
                $updateData['adopted_at'] = null;
            }

            $animal->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Status do animal atualizado com sucesso',
                'data' => $animal->load(['adoptedBy:id,name'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar status do animal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar animais adotados pelo usuário logado
     */
    public function myAdoptions(): JsonResponse
    {
        $animals = Animal::where('adopted_by', auth()->id())
            ->with(['adoptedBy:id,name'])
            ->orderBy('adopted_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Seus animais adotados',
            'data' => $animals
        ]);
    }

    /**
     * Estatísticas dos animais (apenas admin/caregiver)
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Animal::count(),
            'available' => Animal::where('status', 'available')->count(),
            'adopted' => Animal::where('status', 'adopted')->count(),
            'under_treatment' => Animal::where('status', 'under_treatment')->count(),
            'unavailable' => Animal::where('status', 'unavailable')->count(),
            'by_size' => Animal::selectRaw('size, COUNT(*) as count')
                ->groupBy('size')
                ->get()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Estatísticas obtidas com sucesso',
            'data' => $stats
        ]);
    }

    /**
     * Rota pública para mostrar animais disponíveis (sem autenticação)
     */
    public function publicAvailable(): JsonResponse
    {
        $animals = Animal::available()
            ->select(['id', 'name', 'breed', 'age_months', 'gender', 'size', 'color', 'photo_url', 'entry_date'])
            ->orderBy('entry_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Animais disponíveis para adoção',
            'data' => $animals
        ]);
    }
}
