import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Home() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Money Tracker" />
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <h1 className="text-xl font-bold tracking-tight">💰 Money Tracker</h1>
                    <nav className="flex items-center gap-4 text-sm">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-4 py-2 text-sm font-medium hover:text-green-600">
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700"
                                >
                                    Mulai Gratis
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero */}
                <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Kelola Keuanganmu dengan Mudah</h2>
                    <p className="mb-6 max-w-2xl text-base text-gray-600 dark:text-gray-400">
                        Catat pemasukan, kelola pengeluaran, dan pantau saldo bulanan secara cepat dan aman. Money Tracker membantu kamu lebih bijak
                        dalam mengelola keuangan pribadi.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href={auth.user ? route('dashboard') : route('register')}
                            className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-green-700"
                        >
                            {auth.user ? 'Buka Dashboard' : 'Coba Sekarang'}
                        </Link>
                        <a
                            href="#fitur"
                            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            Lihat Fitur
                        </a>
                    </div>
                </section>

                {/* Features */}
                <section id="fitur" className="bg-gray-50 px-6 py-16 dark:bg-gray-900">
                    <div className="mx-auto max-w-5xl text-center">
                        <h3 className="mb-8 text-2xl font-bold">Fitur Utama</h3>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h4 className="mb-2 text-lg font-semibold">📊 Ringkasan Bulanan</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Lihat pemasukan, pengeluaran, dan saldo akhir dengan grafik sederhana.
                                </p>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h4 className="mb-2 text-lg font-semibold">💵 Catat Transaksi</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Tambahkan pemasukan dan pengeluaran harian dengan cepat dan mudah.
                                </p>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h4 className="mb-2 text-lg font-semibold">📑 Laporan PDF</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Cetak laporan bulanan dalam format PDF untuk dokumentasi atau arsip.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 px-6 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    © {new Date().getFullYear()} Money Tracker. All rights reserved.
                </footer>
            </div>
        </>
    );
}
