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

        $transactions = Keuangan::where('user_id', $user->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->latest()
            ->paginate(5);

        $totalPemasukan = Keuangan::where('user_id', $user->id)
            ->where('jenis', 'Pemasukan')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->sum('jumlah');

        $totalPengeluaran = Keuangan::where('user_id', $user->id)
            ->where('jenis', 'Pengeluaran')
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