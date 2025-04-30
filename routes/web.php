<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicacionController;
use App\Http\Controllers\SorteoController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CertificadoController;
use App\Http\Controllers\RuletaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\AdminMiddleware;

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

Route::get('/sorteo-manual', function () {
    return Inertia::render('Sorteo/Manual');
})->middleware('auth')->name('sorteo.manual');

Route::post('/sorteo-manual/iniciar', [SorteoController::class, 'iniciar_manual'])->middleware('auth')->name('sorteo.manual.iniciar');

Route::get('/sorteo', function () {
    return redirect()->route('home');
});

Route::get('/historial', [SorteoController::class, 'historial'])->middleware('auth')->name('sorteo.historial');

Route::get('/sorteo/{sorteo}', [SorteoController::class, 'show'])->middleware('auth')->name('sorteo.show');
Route::delete('/sorteos/{sorteo}', [SorteoController::class, 'destroy'])->name('sorteo.destroy');

Route::middleware(['auth',AdminMiddleware::class])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::get('/admin/users/{user}', [UserController::class, 'show'])->name('admin.users.show');
    Route::get('/admin/users/{user}/historial', [UserController::class, 'historial'])->name('admin.users.historial');

});

Route::get('/certificado/{codigo}', [CertificadoController::class, 'show'])->name('certificado.show');

Route::middleware('auth')->group(function () {
    Route::post('/ruleta/guardar', [RuletaController::class, 'guardar'])->name('ruleta.guardar');
});

Route::get('/ruleta', [RuletaController::class, 'inicio'])->name('ruleta');

Route::middleware(['auth'])->group(function () {
    Route::get('/ruletas', [RuletaController::class, 'index'])->name('ruletas.index');
    Route::post('/ruletas', [RuletaController::class, 'store'])->name('ruletas.store');
    Route::put('/ruletas/{ruleta}', [RuletaController::class, 'update'])->name('ruletas.update');
    Route::delete('/ruletas/{ruleta}', [RuletaController::class, 'destroy'])->name('ruletas.destroy');
});


require __DIR__.'/auth.php';
