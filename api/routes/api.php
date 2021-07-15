<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/tasks', [\App\Http\Controllers\Api\TaskController::class, 'index']);
Route::middleware('auth:api')
    ->post('/task', [\App\Http\Controllers\Api\TaskController::class, 'store']);
Route::patch('/task/{id}', [\App\Http\Controllers\Api\TaskController::class, 'update']);
Route::delete('/task/{id}', [\App\Http\Controllers\Api\TaskController::class, 'destroy']);

Route::middleware('auth:api')
    ->post('/task-seen', [\App\Http\Controllers\Api\SeenController::class, 'store']);

Route::post('/signup', [\App\Http\Controllers\Api\UsersController::class, 'signup']);
Route::post('/login', [\App\Http\Controllers\Api\UsersController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\Api\UsersController::class, 'logout']);

Route::middleware('auth:api')->get('/user', [\App\Http\Controllers\Api\UsersController::class, 'user']);
Route::middleware( 'auth:api')->post('/logout', [\App\Http\Controllers\Api\UsersController::class, 'logout']);
