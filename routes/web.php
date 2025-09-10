<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\KeuanganController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PremiumFeatureController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('keuangan', KeuanganController::class);

    Route::get('cetak-laporan/{periode}', [LaporanController::class, 'index'])->name('cetak-laporan');

    Route::get('premium', [PremiumFeatureController::class, 'index'])->name('premium');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';