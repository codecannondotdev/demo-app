<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Searchable
{
    /**
     * Scope a query that matches a LIKE search of term.
     *
     * @param  Builder  $query
     * @param  string  $term
     * @return Builder
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
