import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Keuangan, PaginatedData, type BreadcrumbItem } from '@/types';
import { formatPrice } from '@/utils';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Keuangan', href: '#' },
];

export default function TransactionsPage({
    transactions,
    totalPemasukan,
    totalPengeluaran,
}: {
    transactions: PaginatedData<Keuangan>;
    totalPemasukan: number;
    totalPengeluaran: number;
}) {
    const { props } = usePage<{ keuangan: PaginatedData<Keuangan>; search?: string }>();
    const initialSearch = props.search || '';
    const [search, setSearch] = useState(initialSearch);
    const [selectedTransaksi, setSelectedTransaksi] = useState<Keuangan | null>(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    // Debounce search
    useEffect(() => {
        if (search !== initialSearch) {
            const delayDebounce = setTimeout(() => {
                router.get('/dashboard', { search }, { preserveState: true, replace: true });
            }, 400);

            return () => clearTimeout(delayDebounce);
        }
    }, [search, initialSearch]);

    const [filterType, setFilterType] = useState('all');

    const { data, setData, processing, post, errors } = useForm({
        jenis: 'Pemasukan',
        deskripsi: '',
        jumlah: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('keuangan.store'), {
            onSuccess: () => {
                setData('jenis', 'Pemasukan');
                setData('deskripsi', '');
                setData('jumlah', '');
            },
        });
    };

    const handleDelete = () => {
        if (!selectedTransaksi) return;

        router.delete(`/keuangan/${selectedTransaksi.id}`, {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setSelectedTransaksi(null);
            },
            onError: (err) => {
                console.error('Gagal hapus transaksi:', err);
                alert('Gagal menghapus transaksi. Coba lagi.');
            },
        });
    };

    // filter + search hanya untuk tampil (client-side)
    const filteredData = transactions.data.filter((tx) => {
        const matchFilter = filterType === 'all' || tx.jenis === filterType;
        const matchSearch = search === '' || tx.deskripsi.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
                {/* Judul */}
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Pemasukan & Pengeluaran</h2>

                {/* Ringkasan */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-green-100 bg-green-50 p-4 shadow-sm dark:border-green-800 dark:bg-green-900/30">
                        <h3 className="mb-1 font-medium text-gray-700 dark:text-gray-300">Total Pemasukan</h3>
                        <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{formatPrice(totalPemasukan)}</p>
                    </div>
                    <div className="rounded-xl border border-red-100 bg-red-50 p-4 shadow-sm dark:border-red-800 dark:bg-red-900/30">
                        <h3 className="mb-1 font-medium text-gray-700 dark:text-gray-300">Total Pengeluaran</h3>
                        <p className="text-2xl font-semibold text-red-500 dark:text-red-400">{formatPrice(totalPengeluaran)}</p>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm dark:border-blue-800 dark:bg-blue-900/30">
                        <h3 className="mb-1 font-medium text-gray-700 dark:text-gray-300">Sisa Saldo</h3>
                        <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{formatPrice(totalPemasukan - totalPengeluaran)}</p>
                    </div>
                </div>

                {/* Form Input */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Jenis</label>
                            <select
                                value={data.jenis}
                                onChange={(e) => setData('jenis', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 focus:border-green-300 focus:ring-2 focus:ring-green-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-400"
                            >
                                <option value={'Pemasukan'}>Pemasukan</option>
                                <option value={'Pengeluaran'}>Pengeluaran</option>
                            </select>
                            {errors.jenis && <div className="mt-1 text-sm text-red-500">{errors.jenis}</div>}
                        </div>
                        <div>
                            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Jumlah</label>
                            <input
                                type="number"
                                value={data.jumlah}
                                onChange={(e) => setData('jumlah', e.target.value)}
                                min={1000}
                                placeholder="Rp 0.00"
                                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 focus:border-green-300 focus:ring-2 focus:ring-green-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-400"
                                required
                            />
                            {errors.jumlah && <div className="mt-1 text-sm text-red-500">{errors.jumlah}</div>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
                            <textarea
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                placeholder="Contoh: Gaji"
                                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 focus:border-green-300 focus:ring-2 focus:ring-green-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-400"
                                required
                            />
                            {errors.deskripsi && <div className="mt-1 text-sm text-red-500">{errors.deskripsi}</div>}
                        </div>
                        <div className="text-right md:col-span-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-green-500 px-6 py-2 text-white shadow-sm transition hover:bg-green-600 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-700 dark:text-gray-300">Filter:</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white p-1 text-gray-800 focus:border-green-300 focus:ring-2 focus:ring-green-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-400"
                        >
                            <option value="all">Semua</option>
                            <option value="Pemasukan">Pemasukan</option>
                            <option value="Pengeluaran">Pengeluaran</option>
                        </select>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white py-1 pr-3 pl-8 text-gray-800 focus:ring-2 focus:ring-green-200 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-green-400"
                        />
                        <Search className="absolute top-2 left-2 text-gray-400 dark:text-gray-500" size={16} />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                        <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Tanggal</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Jenis</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Deskripsi</th>
                                <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">Jumlah</th>
                                <th className="px-4 py-2 text-right font-medium text-gray-600 dark:text-gray-300">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((tx, i) => (
                                <tr key={i} className="transition hover:bg-gray-50 dark:hover:bg-gray-700/70">
                                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{tx.tanggal}</td>
                                    <td
                                        className={`px-4 py-3 ${
                                            tx.jenis === 'Pengeluaran' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                                        }`}
                                    >
                                        {tx.jenis}
                                    </td>
                                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{tx.deskripsi}</td>
                                    <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100">Rp {tx.jumlah.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedTransaksi(tx);
                                                setOpenDeleteModal(true);
                                            }}
                                            className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                        Data kosong
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination bawaan Laravel */}
                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                        {transactions.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`rounded px-3 py-1 text-sm transition ${
                                    link.active
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            <Modal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                title="Konfirmasi Hapus"
                size="sm"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setOpenDeleteModal(false)} variant="secondary">
                            Batal
                        </Button>
                        <Button onClick={handleDelete} className="bg-red-700 hover:bg-red-800">
                            Hapus
                        </Button>
                    </div>
                }
            >
                Apakah Anda yakin ingin menghapus catatan transaksi{' '}
                <strong className="text-red-600 dark:text-red-400">{selectedTransaksi?.deskripsi}</strong>? Tindakan ini tidak dapat dibatalkan.
            </Modal>
        </AppLayout>
    );
}
