<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicacionController;
use App\Http\Controllers\SorteoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/buscar-publicacion', [PublicacionController::class, 'buscar'])->name('publicacion.buscar');
Route::post('/sorteo', [PublicacionController::class, 'cargarComentarios'])->middleware('auth')->name('publicacion.comentarios');
Route::get('/comentarios', [PublicacionController::class, 'visualizarComentarios'])->middleware('auth')->name('comentarios.visualizar');
Route::post('/sorteo/iniciar', [SorteoController::class, 'iniciar'])->middleware('auth')->name('sorteo.iniciar');

Route::get('/sorteo', function () {
    return redirect()->route('home');
});

Route::get('/historial', [SorteoController::class, 'historial'])->middleware('auth')->name('sorteo.historial');

Route::get('/sorteo/{sorteo}', [SorteoController::class, 'show'])->middleware('auth')->name('sorteo.show');
Route::delete('/sorteos/{sorteo}', [SorteoController::class, 'destroy'])->name('sorteo.destroy');


require __DIR__.'/auth.php';
