---
outline: 'deep'
---

# `RelationHelper`

`RelationHelper` gives you a simple way to query through your model relations
without re‑writing their filters in multiple places. It helps the backend and
frontend stay in sync, especially when a relation has extra conditions.

Here’s a common example:

```php
public function sentReminders()
{
    return $this->hasMany(Reminder::class)->where('status', 'sent');
}
```

There isn’t an easy "inverse" relation that includes the same `where` clause,
and hand‑built queries drift over time. If you later add
`->whereNull('archived_at')` to the relation, you’d need to hunt down and update
every caller.

With `RelationHelper`, you call the relation once and get a builder that already
has the right filters. If the relation changes, your calls automatically pick up
the new logic.

The helper underpins several generated UI components (for example the
[Relation Widgets](/generated-files/frontend/components/relation-widgets) and [Relation Add Dialogs](/generated-files/frontend/components/relation-add-dialogs)) to keep the frontend aligned with
backend logic without re-implementing filters.

## What you can do

### `fromRelation`

- What it looks like:

  ```php
  RelationHelper::fromRelation(
      Model|string $model,
      string|int $modelId,
      string $relation,
      Model|string $relatedModel
  )
  ```

- What it does: Loads the parent record, calls the relation, checks it’s the
  right kind of relation for the expected model, and returns the relation’s
  Eloquent Builder.
- When to use: You want the exact results your relation returns (including all
  its where/order scopes) without re‑writing those rules.

#### Example: Get a user’s sent reminders

```php
$reminders = RelationHelper::fromRelation(
    User::class,
    $userId,
    'sentReminders',
    Reminder::class
)->get();

$reminders->each(function (Reminder $reminder) {
    // Already scoped to status = 'sent' thanks to the relation definition
});
```

### `notFromRelation`

- What it looks like:

```php
RelationHelper::notFromRelation(
    Model|string $model,
    string|int $modelId,
    string $relation,
    Model|string $relatedModel
)
```

- What it does: Returns an Eloquent Builder for the related model that excludes records
  already linked by the relation (and validates the relation/expected model).
- When to use: You’re building a picker/selector and want “things I can still
  add,” while respecting the same relation filters.

#### Example: Find reminders not yet marked as sent

```php
$eligibleReminders = RelationHelper::notFromRelation(
    User::class,
    $userId,
    'sentReminders',
    Reminder::class
)->get();

// Presented to the UI for selection in a relation widget
```

## Where it’s used (controllers and widgets)

`RelationHelper` powers `CRUDControllerHelper::list()` for parameters like
`fromRelation` and `notFromRelation`. Generated relation widgets and relation
add dialogs make requests like:

```json
{
  "fromRelation": {
    "model": "App\\Models\\User",
    "id": 42,
    "relation": "sentReminders"
  }
}
```

By including the parent and expected related models, the server can validate the
relation and return precisely scoped records. If `sentReminders` changes, the
widgets pick it up automatically—no client code changes needed.

## See also

- [API - `RelationHelper`](/api/backend/relation-helper)
- [`CRUDControllerHelper`](/backend/crud-controller-helper)
- [Relation Add Dialogs](/generated-files/frontend/components/relation-add-dialogs)
- [Relation Widgets](/generated-files/frontend/components/relation-widgets)
