<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Donation;
use App\Models\User;
use App\Models\Category;

class DonationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_donation(): void
    {
        $category = Category::factory()->create(['type' => 'donation']);

        $donationData = [
            'category_id' => $category->id,
            'title' => 'Test Donation',
            'amount' => 100.50,
            'donor_name' => 'Test Donator',
            'date' => now()->toDateString(),
        ];

        $response = $this->postJson('/api/donations', $donationData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('donations', [
            'title' => 'Test Donation',
        ]);
    }

    public function test_admin_can_get_all_donations(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        Donation::factory()->count(10)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/donations');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data');
    }

    public function test_admin_can_get_single_donation(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $donation = Donation::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/donations/{$donation->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $donation->id,
                ]
            ]);
    }

    public function test_admin_can_update_donation(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $donation = Donation::factory()->create();
        $category = Category::factory()->create(['type' => 'donation']);

        $updateData = [
            'category_id' => $category->id,
            'title' => 'Updated Donation Title',
            'amount' => 200.00,
            'donor_name' => 'Updated Donator Name',
            'date' => now()->toDateString(),
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/donations/{$donation->id}", $updateData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('donations', [
            'id' => $donation->id,
            'title' => 'Updated Donation Title',
        ]);
    }

    public function test_admin_can_delete_donation(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $donation = Donation::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/donations/{$donation->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Doação excluída com sucesso.',
            ]);

        $this->assertDatabaseMissing('donations', [
            'id' => $donation->id,
        ]);
    }
}
