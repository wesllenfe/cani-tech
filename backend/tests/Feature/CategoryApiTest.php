<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Category;
use App\Models\User;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_get_all_categories(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        Category::factory()->count(10)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data');
    }

    public function test_admin_can_create_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $categoryData = [
            'name' => 'Test Category',
            'type' => 'expense',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/categories', $categoryData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('categories', [
            'name' => 'Test Category',
        ]);
    }

    public function test_admin_can_get_single_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $category = Category::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/categories/{$category->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $category->id,
                ]
            ]);
    }

    public function test_admin_can_update_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $category = Category::factory()->create();

        $updateData = [
            'name' => 'Updated Category Name',
            'type' => 'donation',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/categories/{$category->id}", $updateData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category Name',
        ]);
    }

    public function test_admin_can_delete_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $category = Category::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/categories/{$category->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Categoria excluída com sucesso.',
            ]);

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }
}
