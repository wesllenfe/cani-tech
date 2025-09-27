<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateAdminUserRequest;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Registrar novo usuário
     */
    public function register(RegisterUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'cpf' => $request->cpf,
            'birth_date' => $request->birth_date,
            'password' => Hash::make($request->password),
            'role' => 'adopter',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuário criado com sucesso!',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login do usuário
     */
    public function login(LoginUserRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Credenciais inválidas.'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login realizado com sucesso!',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Logout do usuário
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso!'
        ]);
    }

    /**
     * Perfil do usuário autenticado
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /**
     * Atualizar usuário
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        if ($request->user()->id !== $user->id) {
            return response()->json([
                'message' => 'Não autorizado.'
            ], 403);
        }

        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Usuário atualizado com sucesso!',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Listar usuários (apenas admin)
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::paginate(15);

        return response()->json($users);
    }

    /**
     * Criar novo usuário com privilégios (apenas admin)
     */
    public function createAdmin(CreateAdminUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'cpf' => $request->cpf,
            'birth_date' => $request->birth_date,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'Usuário criado com sucesso!',
            'user' => $user,
        ], 201);
    }
}
