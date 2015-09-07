<?php

/*
  |--------------------------------------------------------------------------
  | Application Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register all of the routes for an application.
  | It's a breeze. Simply tell Laravel the URIs it should respond to
  | and give it the controller to call when that URI is requested.
  |
 */

Route::get('/', function () {
    return View::make('index_site');
});
Route::get('/players', 'PlayerController@index');
Route::post('/players', 'Auth\AuthController@postRegister');
Route::get('/players/{id}', 'PlayerController@show');

Route::get('/units', 'UnitController@index');

Route::get('/armies', 'ArmyController@index');
Route::get('/armies/{id}/fight', 'ArmyController@attack');
Route::get('/armies/{id}', 'ArmyController@show');
Route::put('/armies/{id}', 'ArmyController@update');
Route::put('/armies/{id}/buyUnits', 'ArmyController@buyUnits');



Route::get('/buildings', 'BuildingController@index');
Route::get('/buildings/{id}', 'BuildingController@show');

Route::post('/cities', 'CityController@store');
Route::get('/cities', 'CityController@index');
Route::get('/cities/{id}', 'CityController@show');
Route::get('/cities/{id}/get_buildings', 'CityController@getBuildingsForCity');
Route::put('/cities/{id}', 'CityController@update');

Route::get('/population', 'PopulationController@index');
Route::put('/population/{id}', 'PopulationController@update');
Route::get('/population/{id}', 'PopulationController@show');

Route::get('/test', 'TestController@index');
//Route::get('/test2', 'TestController@recount');
//Route::get('/test3', 'TestController@generateMap');
Route::get('/test4', 'TestController@getMap');
Route::get('/test5', 'TestController@push');
Route::get('/test6', 'TestController@runTestCommand');


Route::get('/session', 'PlayerController@showSession');
Route::post('/login', 'Auth\AuthController@postLogin');
Route::get('/logout', 'Auth\AuthController@getLogout');

Route::put('/positions/{id}', 'PositionController@update');
Route::get('/positions/{id}', 'PositionController@show');
Route::get('/positions/{id}/availableUnits', 'PositionController@getAvailableUnits');

Route::get('/resources/{id}', 'ResourceController@show');

Route::get('/queue/recount', 'QueueController@getNextRecount');
