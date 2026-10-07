# Routes

Routes are generated for every module and added to the main `api.php` file.

```php
<?php

Route::resource('/addresses', AddressController::class)->parameters([
    'addresses' => 'entity',
])->except('index', 'create', 'edit');
Route::put('/addresses/{entity}/{relation}', [AddressController::class, 'updateRelation']);
Route::post('/addresses/list', [AddressController::class, 'list']);
```

The routes handle request routing to CRUD controllers.

- See also
  - [Backend - CRUD Controllers](/backend/crud-controllers)
  - [Generated Files - Controllers](/generated-files/backend/controllers)
```
