<?php

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Keuangan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KeuanganController;
use Barryvdh\DomPDF\Facade\Pdf;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {

        $bulan = Carbon::now()->month;
        $tahun = Carbon::now()->year;
        $user = Auth::user();

        $transactions = Keuangan::whereMonth('tanggal', $bulan)
            ->where('user_id', $user->id)
            ->whereYear('tanggal', $tahun)
            ->latest()
            ->paginate(5);

        $totalPemasukan = Keuangan::where('jenis', 'Pemasukan')
            ->where('user_id', $user->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->sum('jumlah');

        $totalPengeluaran = Keuangan::where('jenis', 'Pengeluaran')
            ->where('user_id', $user->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->sum('jumlah');


        return Inertia::render('dashboard', [
            'transactions' => $transactions,
            'totalPemasukan' => $totalPemasukan,
            'totalPengeluaran' => $totalPengeluaran,
        ]);
    })->name('dashboard');

    Route::resource('keuangan', KeuanganController::class);

    Route::get('cetak-laporan/{periode}', function ($periode) {

        [$tahun, $bulan] = explode('-', $periode);

        $transactions = Keuangan::where('user_id', Auth::user()->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->orderBy('tanggal', 'asc')
            ->get();

        $totalPemasukan = $transactions->where('jenis', 'Pemasukan')->sum('jumlah');
        $totalPengeluaran = $transactions->where('jenis', 'Pengeluaran')->sum('jumlah');
        $saldo = $totalPemasukan - $totalPengeluaran;

        $pdf = Pdf::loadView('pdf.cetak-lap-keuangan', [
            'transactions'    => $transactions,
            'periode'         => $periode,
            'totalPemasukan'  => $totalPemasukan,
            'totalPengeluaran' => $totalPengeluaran,
            'saldo'           => $saldo,
        ]);

        return $pdf->stream("laporan-keuangan-{$periode}.pdf");
    })->name('cetak-laporan');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
