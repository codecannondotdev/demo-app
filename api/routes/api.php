<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\NurseController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TreatmentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::get('/', function () {
    return redirect(config('app.ui_url'));
});

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/clear-data', function () {
        Artisan::call('migrate:fresh', [
            '--force' => true,
        ]);
        Artisan::call('db:seed', [
            '--class' => 'UserSeeder',
            '--force' => true,
        ]);
    });

    Route::resource('/users', UserController::class)->except('index', 'create', 'edit');
    Route::put('/users/{entity}/{relation}', [UserController::class, 'updateRelation']);
    Route::post('/users/list', [UserController::class, 'list']);

    Route::resource('/patients', PatientController::class)->parameters([
        'patients' => 'entity',
    ])->except('index', 'create', 'edit');
    Route::put('/patients/{entity}/{relation}', [PatientController::class, 'updateRelation']);
    Route::post('/patients/list', [PatientController::class, 'list']);

    Route::resource('/doctors', DoctorController::class)->parameters([
        'doctors' => 'entity',
    ])->except('index', 'create', 'edit');
    Route::put('/doctors/{entity}/{relation}', [DoctorController::class, 'updateRelation']);
    Route::post('/doctors/list', [DoctorController::class, 'list']);

    Route::resource('/nurses', NurseController::class)->parameters([
        'nurses' => 'entity',
    ])->except('index', 'create', 'edit');
    Route::put('/nurses/{entity}/{relation}', [NurseController::class, 'updateRelation']);
    Route::post('/nurses/list', [NurseController::class, 'list']);

    Route::resource('/departments', DepartmentController::class)->parameters([
        'departments' => 'entity',
    ])->except('index', 'create', 'edit');
    Route::put('/departments/{entity}/{relation}', [DepartmentController::class, 'updateRelation']);
    Route::post('/departments/list', [DepartmentController::class, 'list']);

    Route::resource('/appointments', AppointmentController::class)->parameters([
        'appointments' => 'entity',
    ])->except('index', 'create', 'edit');
    Route::put('/appointments/{entity}/{relation}', [AppointmentController::class, 'updateRelation']);
    Route::post('/appointments/list', [AppointmentController::class, 'list']);

    Route::resource('/treatments', TreatmentController::class)->parameters([
        'treatments' => 'entity',
    ])->except('index', 'create', 'edit');
    Route::put('/treatments/{entity}/{relation}', [TreatmentController::class, 'updateRelation']);
    Route::post('/treatments/list', [TreatmentController::class, 'list']);

    Route::resource('/medications', MedicationController::class)->parameters([
        'medications' => 'entity',
    ])->except('index', 'create', 'edit');
    Route::put('/medications/{entity}/{relation}', [MedicationController::class, 'updateRelation']);
    Route::post('/medications/list', [MedicationController::class, 'list']);

    Route::resource('/billings', BillingController::class)->parameters([
        'billings' => 'entity',
    ])->except('index', 'create', 'edit');
    Route::put('/billings/{entity}/{relation}', [BillingController::class, 'updateRelation']);
    Route::post('/billings/list', [BillingController::class, 'list']);

    Route::resource('/tags', TagController::class)->parameters([
        'tags' => 'entity',
    ])->except('index', 'create', 'edit');
    Route::put('/tags/{entity}/{relation}', [TagController::class, 'updateRelation']);
    Route::post('/tags/list', [TagController::class, 'list']);
});
