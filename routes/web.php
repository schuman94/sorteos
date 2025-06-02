<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicacionController;
use App\Http\Controllers\SorteoController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CertificadoController;
use App\Http\Controllers\ColeccionController;
use App\Http\Controllers\PremioController;
use App\Http\Controllers\RascaController;
use App\Http\Controllers\RuletaController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Session;
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
Route::post('/cargar-comentarios', [PublicacionController::class, 'cargarComentarios'])->middleware('auth')->name('publicacion.comentarios');
Route::get('/comentarios', [PublicacionController::class, 'visualizarComentarios'])->middleware('auth')->name('comentarios.visualizar');

Route::get('/sorteo', function () {
    $publicacion = Session::get('publicacion');
    if ($publicacion) {
        return Inertia::render('Sorteo/Sorteo', [
            'publicacion' => $publicacion,
        ]);
    }
    return redirect()->route('home');
})->middleware('auth')->name('sorteo');

Route::get('/sorteo-manual', function () {
    return Inertia::render('Sorteo/Manual');
})->middleware('auth')->name('sorteo.manual');

Route::middleware('auth')->group(function () {
    Route::post('/sorteo/iniciar', [SorteoController::class, 'iniciar'])->name('sorteo.iniciar');
    Route::post('/sorteo-manual/iniciar', [SorteoController::class, 'iniciar_manual'])->name('sorteo.manual.iniciar');
    Route::get('/historial', [SorteoController::class, 'historial'])->name('sorteo.historial');
    Route::get('/sorteo/{sorteo}', [SorteoController::class, 'show'])->name('sorteo.show');
    Route::delete('/sorteos/{sorteo}', [SorteoController::class, 'destroy'])->name('sorteo.destroy');
});

Route::middleware(['auth', AdminMiddleware::class])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::get('/admin/users/{user}', [UserController::class, 'show'])->name('admin.users.show');
    Route::put('/admin/users/{user}/hacer-admin', [UserController::class, 'hacerAdmin'])->name('admin.users.hacer');
    Route::put('/admin/users/{user}/deshacer-admin', [UserController::class, 'deshacerAdmin'])->name('admin.users.deshacer');
    Route::get('/admin/users/{user}/historial', [SorteoController::class, 'historialAdmin'])->name('admin.users.historial');
    Route::delete('/admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::get('/admin/eliminados', [UserController::class, 'eliminados'])->name('admin.users.eliminados');
    Route::post('/admin/eliminados/{user}/restaurar', [UserController::class, 'restaurar'])->name('admin.users.restaurar');
});

Route::get('/certificado/{codigo}', [CertificadoController::class, 'show'])->name('certificado.show');

Route::get('/ruleta', [RuletaController::class, 'inicio'])->name('ruleta');

Route::middleware(['auth'])->group(function () {
    Route::get('/ruletas', [RuletaController::class, 'index'])->name('ruletas.index');
    Route::post('/ruleta/guardar', [RuletaController::class, 'guardar'])->name('ruleta.guardar');
    Route::post('/ruletas', [RuletaController::class, 'store'])->name('ruletas.store');
    Route::put('/ruletas/{ruleta}', [RuletaController::class, 'update'])->name('ruletas.update');
    Route::delete('/ruletas/{ruleta}', [RuletaController::class, 'destroy'])->name('ruletas.destroy');
});

Route::middleware('auth')->group(function () {
    Route::resource('colecciones', ColeccionController::class)->parameters([
        'colecciones' => 'coleccion',
    ]);
    Route::post('/colecciones/{coleccion}/proporcionar-rascas', [ColeccionController::class, 'proporcionarRascas'])->name('colecciones.proporcionarRascas');
    Route::get('colecciones/{coleccion}/rascas', [ColeccionController::class, 'rascasProporcionados'])->name('colecciones.rascasProporcionados');
    Route::put('/colecciones/{coleccion}/toggle-estado', [ColeccionController::class, 'toggleEstado'])->name('colecciones.toggleEstado');
});

Route::middleware('auth')->group(function () {
    Route::resource('premios', PremioController::class);
    Route::post('/premios/store-and-load', [PremioController::class, 'storeAndLoad'])->name('premios.storeAndLoad');
});

Route::middleware('auth')->group(function () {
    Route::get('/rascas/{codigo}', [RascaController::class, 'show'])->name('rascas.show');
    Route::put('/rascar/{codigo}', [RascaController::class, 'rascar'])->name('rascas.rascar');
    Route::get('/mis-rascas-premiados', [RascaController::class, 'premiados'])->name('rascas.premiados');
});

require __DIR__ . '/auth.php';
