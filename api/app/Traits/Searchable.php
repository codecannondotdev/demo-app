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
