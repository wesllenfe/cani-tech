<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type'
    ];

    protected $casts = [
        'type' => 'string'
    ];

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}
