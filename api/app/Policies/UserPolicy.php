<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function list(User $authUser): bool
    {
        return true;
    }

    public function show(User $authUser, User $user): bool
    {
        return true;
    }

    public function store(User $authUser): bool
    {
        return $authUser->isAdmin();
    }

    public function update(User $authUser, User $user): bool
    {
        return $authUser->isAdmin() || $user->id == $authUser->id;
    }

    public function updateRelation(User $authUser, User $user): bool
    {
        return $authUser->isAdmin() || $user->id == $authUser->id;
    }

    public function destroy(User $authUser, User $user): bool
    {
        return $authUser->isAdmin() || $user->id == $authUser->id;
    }
}
