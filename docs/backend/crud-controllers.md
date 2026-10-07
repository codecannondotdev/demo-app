---
outline: 'deep'
---

# CRUD Controllers

During development, we found that a lot of time was spent writing CRUD controllers.

Common functionality like sorting a list, applying filters, appending relations
and similar common tasks were repeated over and over again, taking valuable time
from our back-end developers. We decided to design an API that allows front-end
developers to interact with most common back-end functioonality without needing
to write custom controllers or routes.

We provide convenient request parameters and backend handlers on all controllers,
which can be used to query the database in powerful ways without writing a single
line of PHP. We try to blur the line between front-end and back-end development,
while maintaining a clear separation and enabling developers to configure just
how much power they want to provide via the CRUD APIs.

This is an example of a CRUD controller:

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;

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
        return $this->crudControllerHelper->list($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $this->crudControllerHelper->show($user);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        return $this->crudControllerHelper->store($request);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        return $this->crudControllerHelper->update($request, $user);
    }

    /**
     * Update the specified resource relations in storage.
     */
    public function updateRelation(Request $request, User $user, string $relation)
    {
        return $this->crudControllerHelper->updateRelation($request, $user, $relation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->crudControllerHelper->destroy($user);
    }
}
```

As you can see all we have to do is create a new instance of the `CRUDControllerHelper`
and pass the model to it. The helper will take care of the rest.

We can then use the default `CRUDControllerHelper` methods to handle the requests,
or we can modify the handler to include some additional logic.

- See also
  - [Backend - `CRUDControllerHelper`](/backend/crud-controller-helper)
