<?php

namespace App\Http\Controllers;

use App\Models\Keuangan;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class LaporanController extends Controller
{
    public function index($periode)
    {
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
    }
}