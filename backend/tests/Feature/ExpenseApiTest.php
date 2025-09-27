<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Expense;
use App\Models\User;
use App\Models\Category;

class ExpenseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_get_all_expenses(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        Expense::factory()->count(10)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/expenses');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data');
    }

    public function test_admin_can_create_expense(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;
        $category = Category::factory()->create(['type' => 'expense']);

        $expenseData = [
            'category_id' => $category->id,
            'title' => 'Test Expense Title',
            'description' => 'Test Expense',
            'amount' => 100.50,
            'date' => now()->toDateString(),
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/expenses', $expenseData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('expenses', [
            'description' => 'Test Expense',
        ]);
    }

    public function test_admin_can_get_single_expense(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $expense = Expense::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/expenses/{$expense->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $expense->id,
                ]
            ]);
    }

    public function test_admin_can_update_expense(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;
        $category = Category::factory()->create(['type' => 'expense']);

        $expense = Expense::factory()->create();

        $updateData = [
            'category_id' => $category->id,
            'title' => 'Updated Expense Title',
            'description' => 'Updated Expense',
            'amount' => 200.00,
            'date' => now()->toDateString(),
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/expenses/{$expense->id}", $updateData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('expenses', [
            'id' => $expense->id,
            'description' => 'Updated Expense',
        ]);
    }

    public function test_admin_can_delete_expense(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $expense = Expense::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/expenses/{$expense->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('expenses', [
            'id' => $expense->id,
        ]);
    }
}
