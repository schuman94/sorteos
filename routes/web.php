<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicacionController;
use App\Http\Controllers\SorteoController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CertificadoController;
use App\Http\Controllers\ColeccionController;
use App\Http\Controllers\PremioController;
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
    Route::get('/admin/users/{user}/historial', [UserController::class, 'historial'])->name('admin.users.historial');
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
    Route::get('/colecciones', [ColeccionController::class, 'index'])->name('colecciones.index');
    Route::get('/colecciones/create', [ColeccionController::class, 'create'])->name('colecciones.create');
    Route::post('/colecciones', [ColeccionController::class, 'store'])->name('colecciones.store');
    Route::get('/colecciones/{coleccion}', [ColeccionController::class, 'show'])->name('colecciones.show');
});

Route::middleware('auth')->group(function () {
    Route::get('/premios', [PremioController::class, 'index'])->name('premios.index');
    Route::post('/premios', [PremioController::class, 'store'])->name('premios.store');
    Route::get('/premios/create', [PremioController::class, 'create'])->name('premios.create');
    Route::get('/premios/{premio}', [PremioController::class, 'show'])->name('premios.show');
    Route::get('/premios/{premio}/edit', [PremioController::class, 'edit'])->name('premios.edit');
    Route::put('/premios/{premio}', [PremioController::class, 'update'])->name('premios.update');
    Route::delete('/premios/{premio}', [PremioController::class, 'destroy'])->name('premios.destroy');
    Route::post('/premios/store-and-load', [PremioController::class, 'storeAndLoad'])->name('premios.storeAndLoad');
});


require __DIR__ . '/auth.php';
