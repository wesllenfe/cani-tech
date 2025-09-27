<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Animal;
use App\Models\User;

class AnimalApiTest extends TestCase
{

    public function test_can_get_publicly_available_animals(): void
    {
        Animal::factory()->count(5)->create(['status' => 'available']);
        Animal::factory()->count(3)->create(['status' => 'adopted']);

        $response = $this->getJson('/api/animals/public');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_authenticated_user_can_get_all_animals(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        Animal::factory()->count(10)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/animals');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data.data');
    }

    public function test_authenticated_user_can_get_available_animals(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        Animal::factory()->count(5)->create(['status' => 'available']);
        Animal::factory()->count(3)->create(['status' => 'adopted']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/animals/available');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_authenticated_user_can_get_single_animal(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $animal = Animal::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/animals/{$animal->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $animal->id,
                ]
            ]);
    }

    public function test_authenticated_user_can_adopt_animal(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $animal = Animal::factory()->create(['status' => 'available']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/animals/{$animal->id}/adopt");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Parabéns! Animal adotado com sucesso! 🎉',
            ]);

        $this->assertDatabaseHas('animals', [
            'id' => $animal->id,
            'status' => 'adopted',
            'adopted_by' => $user->id,
        ]);
    }

    public function test_authenticated_user_can_get_their_adoptions(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        Animal::factory()->count(3)->create([
            'status' => 'adopted',
            'adopted_by' => $user->id,
        ]);

        Animal::factory()->count(2)->create(['status' => 'available']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/my-adoptions');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_admin_can_create_animal(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $animalData = [
            'name' => 'Test Animal',
            'breed' => 'test breed',
            'age_months' => 2,
            'gender' => 'male',
            'size' => 'medium',
            'color' => 'black',
            'description' => 'A test animal',
            'entry_date' => now()->toDateString(),
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/animals', $animalData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('animals', [
            'name' => 'Test Animal',
        ]);
    }

    public function test_non_admin_cannot_create_animal(): void
    {
        $user = User::factory()->create(['role' => 'adopter']);
        $token = $user->createToken('test-token')->plainTextToken;

        $animalData = [
            'name' => 'Test Animal',
            'breed' => 'test breed',
            'age_months' => 2,
            'gender' => 'male',
            'size' => 'medium',
            'color' => 'black',
            'description' => 'A test animal',
            'entry_date' => now()->toDateString(),
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/animals', $animalData);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_animal(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $animal = Animal::factory()->create();

        $updateData = [
            'name' => 'Updated Animal Name',
            'age_months' => 12,
            'gender' => 'female',
            'size' => 'small',
            'color' => 'white',
            'entry_date' => now()->toDateString(),
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/animals/{$animal->id}", $updateData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('animals', [
            'id' => $animal->id,
            'name' => 'Updated Animal Name',
        ]);
    }

    public function test_admin_can_update_animal_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $animal = Animal::factory()->create(['status' => 'available']);

        $updateData = [
            'status' => 'adopted',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->patchJson("/api/animals/{$animal->id}/status", $updateData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('animals', [
            'id' => $animal->id,
            'status' => 'adopted',
        ]);
    }

    public function test_admin_can_get_animal_statistics(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        Animal::factory()->count(5)->create(['status' => 'available']);
        Animal::factory()->count(3)->create(['status' => 'adopted']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/animals/dashboard/statistics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'total',
                    'available',
                    'adopted',
                    'under_treatment',
                    'unavailable',
                    'by_size',
                ]
            ]);
    }

    public function test_admin_can_delete_animal(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $animal = Animal::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/animals/{$animal->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Animal removido com sucesso',
            ]);

        $this->assertDatabaseMissing('animals', [
            'id' => $animal->id,
        ]);
    }
}
