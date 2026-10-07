# Models

Models are generated for each module based on the module specification.

```php
<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory, Searchable;

    protected $table = 'plans';

    protected $guarded = [];

    protected $searchable = [
        'name',
        'price',
        'interval',
        'stripe_price_id',
    ];

    public function purchases()
    {
        return $this->hasMany(Purchase::class, 'plan_id');
    }
}
```

The generated models have `$guarded = []` to allow mass assignment.

The `$searchable` property is used to define which fields should be searchable
based on the module specification.

If there are any columns that should be cast, they will be added to the `$casts`
property.

The models will also have all the relationships defined in the module specification.
