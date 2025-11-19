<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTreatmentRequest;
use App\Http\Requests\UpdateTreatmentRequest;
use App\Models\Treatment;
use Illuminate\Http\Request;

class TreatmentController extends Controller
{
    private $crudControllerHelper;

    public function __construct()
    {
        $this->crudControllerHelper = new CRUDControllerHelper(new Treatment);
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
    public function show(Treatment $entity)
    {
        return $this->crudControllerHelper->show($entity);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTreatmentRequest $request)
    {
        return $this->crudControllerHelper->store($request);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTreatmentRequest $request, Treatment $entity)
    {
        return $this->crudControllerHelper->update($request, $entity);
    }

    /**
     * Update the specified resource relations in storage.
     */
    public function updateRelation(Request $request, Treatment $entity, string $relation)
    {
        return $this->crudControllerHelper->updateRelation($request, $entity, $relation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Treatment $entity)
    {
        return $this->crudControllerHelper->destroy($entity);
    }
}
