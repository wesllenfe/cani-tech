<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Animal extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'breed',
        'age_months',
        'gender',
        'size',
        'color',
        'description',
        'status',
        'vaccinated',
        'neutered',
        'medical_notes',
        'photo_url',
        'weight',
        'entry_date',
        'adopted_by',
        'adopted_at'
    ];

    protected $casts = [
        'vaccinated' => 'boolean',
        'neutered' => 'boolean',
        'entry_date' => 'date',
        'adopted_at' => 'datetime',
        'weight' => 'decimal:2'
    ];

    public const GENDER_MALE = 'male';
    public const GENDER_FEMALE = 'female';

    public const SIZE_SMALL = 'small';
    public const SIZE_MEDIUM = 'medium';
    public const SIZE_LARGE = 'large';
    public const SIZE_EXTRA_LARGE = 'extra_large';

    public const STATUS_AVAILABLE = 'available';
    public const STATUS_ADOPTED = 'adopted';
    public const STATUS_UNDER_TREATMENT = 'under_treatment';
    public const STATUS_UNAVAILABLE = 'unavailable';

    public function adoptedBy()
    {
        return $this->belongsTo(User::class, 'adopted_by');
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_AVAILABLE);
    }

    public function scopeAdopted(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ADOPTED);
    }

    public function scopeBySize(Builder $query, string $size): Builder
    {
        return $query->where('size', $size);
    }

    public function scopeByGender(Builder $query, string $gender): Builder
    {
        return $query->where('gender', $gender);
    }

    public function getAgeYearsAttribute(): int
    {
        return (int) floor($this->age_months / 12);
    }

    public function getFormattedAgeAttribute(): string
    {
        $years = floor($this->age_months / 12);
        $months = $this->age_months % 12;

        if ($years > 0) {
            return $months > 0 ? "{$years} anos e {$months} meses" : "{$years} anos";
        }

        return "{$months} meses";
    }

    public function markAsAdopted(int $adopterId): bool
    {
        return $this->update([
            'status' => self::STATUS_ADOPTED,
            'adopted_by' => $adopterId,
            'adopted_at' => now()
        ]);
    }

    public function markAsAvailable(): bool
    {
        return $this->update([
            'status' => self::STATUS_AVAILABLE,
            'adopted_by' => null,
            'adopted_at' => null
        ]);
    }

    public function isAvailable(): bool
    {
        return $this->status === self::STATUS_AVAILABLE;
    }

    public function isAdopted(): bool
    {
        return $this->status === self::STATUS_ADOPTED;
    }
}
