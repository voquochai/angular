<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomeController@index')->name('home.index');
Route::get('/dashboard', 'HomeController@dashboard')->name('home.dashboard');
Route::get('/kids', 'HomeController@kids')->name('home.kids');
Route::get('/parents', 'HomeController@parents')->name('home.parents');
Route::get('/attendances', 'HomeController@attendances')->name('home.attendances');


Route::get('/home', 'HomeController@index')->name('home');

Route::group(['prefix' => 'api', 'as' => 'api.'], function() {
//    Route::get('/users', 'UserController@index')->name('user.index');
//    Route::post('/users', 'UserController@store')->name('user.store');
//    Route::put('/users/{id}', 'UserController@update')->name('user.update');
//    Route::get('/users/{id}', 'UserController@show')->name('user.show');
//    Route::delete('/users/{id}', 'UserController@delete')->name('user.delete');

    Route::get('/parents', 'ParentController@index')->name('parent.index');
    Route::post('/parents', 'ParentController@store')->name('parent.store');
    Route::put('/parents/{id}', 'ParentController@update')->name('parent.update');
    Route::get('/parents/{id}', 'ParentController@show')->name('parent.show');
    Route::delete('/parents/{id}', 'ParentController@delete')->name('parent.delete');

    Route::get('/kids', 'KidController@index')->name('kid.index');
    Route::post('/kids', 'KidController@store')->name('kid.store');
    Route::put('/kids/{id}', 'KidController@update')->name('kid.update');
    Route::get('/kids/{id}', 'KidController@show')->name('kid.show');
    Route::delete('/kids/{id}', 'KidController@delete')->name('kid.delete');

    Route::get('/attendances', 'AttendanceController@index')->name('attendance.index');
    Route::get('/attendances/all-kids', 'AttendanceController@allKids')->name('attendance.allKids');
//    Route::post('/attendances', 'AttendanceController@store')->name('attendance.store');
    Route::post('/attendances/start', 'AttendanceController@start')->name('attendance.start');
    Route::post('/attendances/end', 'AttendanceController@end')->name('attendance.end');
    Route::post('/attendances/off', 'AttendanceController@off')->name('attendance.off');
    Route::put('/attendances/{id}', 'AttendanceController@update')->name('attendance.update');
    Route::get('/attendances/{id}', 'AttendanceController@show')->name('attendance.show');
    Route::delete('/attendances/{id}', 'AttendanceController@delete')->name('attendance.delete');


    Route::get('/products', 'ProductController@index')->name('product.index');
    Route::post('/products', 'ProductController@store')->name('product.store');
    Route::put('/products/{id}', 'ProductController@update')->name('product.update');
    Route::get('/products/{id}', 'ProductController@show')->name('product.show');
    Route::delete('/products/{id}', 'ProductController@delete')->name('product.delete');

    Route::get('/dashboard', 'DashboardController@index')->name('dashboard.index');
});