<!DOCTYPE html>
<html lang="id">

    <head>
        <meta charset="UTF-8">
        <title>Laporan Keuangan {{ $periode }}</title>
        <style>
            body {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 13px;
                color: #333;
                margin: 40px;
                background: #fff;
            }

            h1 {
                text-align: center;
                font-size: 20px;
                margin: 0;
                color: #222;
            }

            h2 {
                text-align: center;
                font-size: 14px;
                margin: 4px 0 20px;
                font-weight: normal;
                color: #666;
            }

            /* tabel transaksi */
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }

            table th,
            table td {
                border: 1px solid #ddd;
                padding: 8px 10px;
            }

            table th {
                background: #f7f7f7;
                font-weight: bold;
                text-align: center;
                font-size: 12px;
            }

            table tr:nth-child(even) {
                background: #fafafa;
            }

            .text-center {
                text-align: center;
            }

            .text-right {
                text-align: right;
            }

            /* badge jenis */
            .badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: bold;
            }

            .pemasukan {
                background: #e6f7ed;
                color: #207544;
            }

            .pengeluaran {
                background: #fdeaea;
                color: #a32626;
            }

            /* ringkasan */
            .summary {
                margin-top: 20px;
                float: right;
                width: 280px;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 14px 18px;
                background: #fafafa;
            }

            .summary h3 {
                margin: 0 0 10px;
                font-size: 14px;
                text-align: center;
                color: #333;
                border-bottom: 1px solid #ddd;
                padding-bottom: 6px;
            }

            .summary-row {
                display: flex;
                justify-content: space-between;
                margin: 6px 0;
                font-size: 13px;
            }

            .green {
                color: #207544;
                font-weight: bold;
            }

            .red {
                color: #a32626;
                font-weight: bold;
            }

            .saldo {
                border-top: 1px solid #ddd;
                margin-top: 10px;
                padding-top: 8px;
                font-weight: bold;
            }

            /* clear float */
            .clearfix::after {
                content: "";
                display: block;
                clear: both;
            }
        </style>
    </head>

    <body>
        <h1>Laporan Keuangan Pribadi</h1>
        <h2>Periode: {{ $periode }}</h2>

        <div class="clearfix">
            <!-- tabel transaksi -->
            <table>
                <thead>
                    <tr>
                        <th style="width: 15%;">Tanggal</th>
                        <th style="width: 15%;">Jenis</th>
                        <th style="width: 45%;">Deskripsi</th>
                        <th style="width: 25%;">Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($transactions as $tx)
                        <tr>
                            <td class="text-center">{{ \Carbon\Carbon::parse($tx->tanggal)->format('d-m-Y') }}</td>
                            <td class="text-center">
                                <span class="badge {{ strtolower($tx->jenis) }}">
                                    {{ $tx->jenis }}
                                </span>
                            </td>
                            <td>{{ $tx->deskripsi }}</td>
                            <td class="text-right">
                                Rp {{ number_format($tx->jumlah, 0, ',', '.') }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="text-center">Tidak ada data</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

            <!-- ringkasan -->
            <div class="summary">
                <h3>Ringkasan Bulanan</h3>
                <div class="summary-row">
                    <span>Total Pemasukan:</span>
                    <span class="green">Rp {{ number_format($totalPemasukan, 0, ',', '.') }}</span>
                </div>
                <div class="summary-row">
                    <span>Total Pengeluaran:</span>
                    <span class="red">Rp {{ number_format($totalPengeluaran, 0, ',', '.') }}</span>
                </div>
                <div class="summary-row saldo">
                    <span>Saldo Akhir:</span>
                    <span>Rp {{ number_format($saldo, 0, ',', '.') }}</span>
                </div>
            </div>
        </div>
    </body>

</html>
