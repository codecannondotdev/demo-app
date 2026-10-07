---
outline: 'deep'
---

# `Searchable`

The `Searchable` trait adds a `search` scope to a model that allows you to search
for models based on a search query.

## Usage

To use the `Searchable` trait in a model, you can add it to the model class and
define a `$searchable` property.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use Searchable;

    protected $searchable = [
        'title',
        'content',
    ];
}
```

### `search`

The `search` scope is a scope that allows you to search for models based on a
search query.

```php
<?php

$posts = Post::search('lorem')->get();
```

The `search` scope will search for the query in the columns defined in the
`$searchable` property of the model.

## Implementation

The `Searchable` trait performs a `LIKE` search that is implemented like this:

```php
<?php

namespace App\Traits;

trait Searchable
{
    /**
     * Scope a query that matches a LIKE search of term.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $term
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, $term)
    {
        return $query->where(function ($query) use ($term) {
            foreach ($this->searchable as $column) {
                $query->orWhere($column, 'LIKE', '%'.$term.'%');
            }

            return $query;
        });
    }
}
```
