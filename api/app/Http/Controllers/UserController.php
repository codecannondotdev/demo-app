<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    private $crudControllerHelper;

    public function __construct()
    {
        $this->crudControllerHelper = new CRUDControllerHelper(new User);
    }

    /**
     * Display a listing of the resource.
     */
    public function list(Request $request)
    {
        Gate::authorize('list', User::class);

        return $this->crudControllerHelper->list($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        Gate::authorize('show', $user);

        return $this->crudControllerHelper->show($user);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        Gate::authorize('store', User::class);

        $user = $this->crudControllerHelper->store($request);
        $user->email_verified_at = now();
        $user->save();

        return $user;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update', $user);

        return $this->crudControllerHelper->update($request, $user);
    }

    /**
     * Update the specified resource relations in storage.
     */
    public function updateRelation(Request $request, User $entity, string $relation)
    {
        Gate::authorize('updateRelation', $entity);

        return $this->crudControllerHelper->updateRelation($request, $entity, $relation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        Gate::authorize('destroy', $user);

        if ($user->isAdmin() && User::where('role', 'admin')->count() === 1) {
            return response()->json(['message' => 'You cannot delete the only admin user.'], 403);
        }

        $this->crudControllerHelper->destroy($user);
    }
}
