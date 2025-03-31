<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicacionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

Route::get('/', function () {
    $publicacion = Session::get('publicacion', null);
    return Inertia::render('Home', ['publicacion' => $publicacion]);
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
Route::post('/comentarios', [PublicacionController::class, 'cargarComentarios'])->name('publicacion.comentarios')->middleware('auth');



require __DIR__.'/auth.php';
