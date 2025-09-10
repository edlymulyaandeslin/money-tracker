<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Keuangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
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
    }
}