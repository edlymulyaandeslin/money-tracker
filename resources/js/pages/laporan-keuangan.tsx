import UpgradeToPremiumNotice from '@/components/upgrade-to-premium';
import AppLayout from '@/layouts/app-layout';
import { Keuangan, SharedData, type BreadcrumbItem } from '@/types';
import { formatBulan } from '@/utils';
import { Head, usePage } from '@inertiajs/react';
import { Printer, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Keuangan', href: '/laporan-keuangan' },
    { title: 'Laporan Bulanan', href: '#' },
];

export default function TransactionsPage({ transactions }: { transactions: Keuangan[] }) {
    const [selectedMonth, setSelectedMonth] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { auth } = usePage<SharedData>().props;

    // Grouping transaksi per bulan
    const summary = useMemo(() => {
        const grouped = transactions.reduce(
            (acc, curr) => {
                const bulan = curr.tanggal.slice(0, 7); // contoh: "2025-01"
                if (!acc[bulan]) {
                    acc[bulan] = { pemasukan: 0, pengeluaran: 0, transactions: [] };
                }
                if (curr.jenis === 'Pemasukan') {
                    acc[bulan].pemasukan += curr.jumlah;
                } else {
                    acc[bulan].pengeluaran += curr.jumlah;
                }
                acc[bulan].transactions.push(curr);
                return acc;
            },
            {} as Record<string, any>,
        );

        return Object.entries(grouped)
            .map(([bulan, value]) => ({
                bulan,
                pemasukan: value.pemasukan,
                pengeluaran: value.pengeluaran,
                saldo: value.pemasukan - value.pengeluaran,
                details: value.transactions.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()),
            }))
            .sort((a, b) => (a.bulan < b.bulan ? 1 : -1));
    }, [transactions]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Keuangan" />

            <div className="px-6 py-4">
                <div className="no-print space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Laporan Keuangan Bulanan</h2>

                    {Boolean(auth.user.is_premium) !== true ? (
                        <UpgradeToPremiumNotice />
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-600 dark:bg-gray-800">
                            <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                                <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700/60 dark:text-gray-200">
                                    <tr>
                                        <th className="p-2 text-left">Bulan</th>
                                        <th className="p-2 text-left">Pemasukan</th>
                                        <th className="p-2 text-left">Pengeluaran</th>
                                        <th className="p-2 text-left">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summary.map((item, i) => (
                                        <tr
                                            key={item.bulan}
                                            className={`cursor-pointer ${
                                                i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'
                                            } hover:bg-gray-100 dark:hover:bg-gray-600/70`}
                                            onClick={() => {
                                                setSelectedMonth(item);
                                                setShowModal(true);
                                            }}
                                        >
                                            <td className="p-2">{formatBulan(item.bulan)}</td>
                                            <td className="p-2 text-green-600">Rp {item.pemasukan.toLocaleString('id-ID')}</td>
                                            <td className="p-2 text-red-600">Rp {item.pengeluaran.toLocaleString('id-ID')}</td>
                                            <td className="p-2 font-semibold">Rp {item.saldo.toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                    {summary.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                Belum ada transaksi bulan ini
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail */}
            {showModal && selectedMonth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="print-area relative w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {/* Tombol Aksi */}
                        <div className="no-print absolute top-4 right-4 flex gap-2">
                            <a
                                href={route('cetak-laporan', selectedMonth.bulan)}
                                target="_blank"
                                className="p-2 text-gray-500 transition hover:text-green-600"
                            >
                                <Printer size={20} />
                            </a>
                            <button onClick={() => setShowModal(false)} className="p-2 text-gray-500 transition hover:text-red-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Header Modal */}
                        <div className="mb-4 border-b border-gray-200 pb-3 text-center dark:border-gray-600">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Detail Transaksi</h2>
                            <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatBulan(selectedMonth.bulan)}</p>
                        </div>

                        {/* Tabel Detail */}
                        <div className="max-h-[60vh] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700/60 dark:text-gray-200">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Tanggal</th>
                                        <th className="px-3 py-2 text-left">Jenis</th>
                                        <th className="px-3 py-2 text-left">Deskripsi</th>
                                        <th className="px-3 py-2 text-right">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedMonth.details.map((item: Keuangan, index: number) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                                            <td className="px-3 py-2">{item.tanggal}</td>
                                            <td
                                                className={`px-3 py-2 font-medium ${
                                                    item.jenis === 'Pengeluaran' ? 'text-red-600' : 'text-green-600'
                                                }`}
                                            >
                                                {item.jenis}
                                            </td>
                                            <td className="px-3 py-2">{item.deskripsi}</td>
                                            <td className="px-3 py-2 text-right">Rp {item.jumlah.toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Ringkasan */}
                        <div className="mt-6 border-t border-gray-200 pt-4 text-sm dark:border-gray-600">
                            <div className="flex justify-end">
                                <div className="w-64 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Total Pemasukan:</span>
                                        <span className="font-semibold text-green-600">Rp {selectedMonth.pemasukan.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Pengeluaran:</span>
                                        <span className="font-semibold text-red-600">Rp {selectedMonth.pengeluaran.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 dark:border-gray-600">
                                        <span className="font-bold">Saldo Akhir:</span>
                                        <span className="font-bold">Rp {selectedMonth.saldo.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
