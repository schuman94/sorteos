<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicacionController;
use App\Http\Controllers\SorteoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

Route::get('/', function () {
    // Rescatamos los datos de la publicación de la sesión en caso de que existan y los borramos de la sesión
    $publicacionData = Session::pull('publicacionData', null);

    return Inertia::render('Home', ['publicacionDataSession' => $publicacionData]);
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
Route::post('/sorteo', [PublicacionController::class, 'cargarComentarios'])->name('publicacion.comentarios')->middleware('auth');
Route::get('/comentarios', [PublicacionController::class, 'visualizarComentarios'])->name('comentarios.visualizar');
Route::post('/sorteo/iniciar', [SorteoController::class, 'iniciar'])->name('sorteo.iniciar');


require __DIR__.'/auth.php';
