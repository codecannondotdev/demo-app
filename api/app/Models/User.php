<?php

namespace App\Models;

use App\Notifications\CustomVerifyEmail;
use App\Traits\Searchable;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'password',
    'role',
])]
#[Hidden([
    'password',
    'remember_token',
    'two_factor_recovery_codes',
    'two_factor_secret',
    'two_factor_confirmed_at',
    'email_verified_at',
])]
class User extends Authenticatable implements CanResetPassword, MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, Searchable;

    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail);
    }

    protected $appends = ['verified'];

    protected $searchable = [
        'name',
        'email',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin()
    {
        return $this->role == 'admin';
    }

    public function getVerifiedAttribute(): bool
    {
        return $this->hasVerifiedEmail();
    }
}
