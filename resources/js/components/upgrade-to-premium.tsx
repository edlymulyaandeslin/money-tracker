import { Link } from '@inertiajs/react';
import { Lock } from 'lucide-react';

export default function UpgradeToPremiumNotice() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-blue-400 bg-gradient-to-b from-blue-50 to-white p-8 text-center shadow-lg dark:border-blue-700 dark:from-blue-900/50 dark:to-gray-900">
            <Lock className="mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />

            <h2 className="mb-4 text-xl font-bold text-blue-800 dark:text-blue-300">Premium Access</h2>

            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">Dapatkan fitur eksklusif dan lihat ringkasan laporan bulanan lengkap.</p>

            <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Nikmati semua fitur premium tanpa batas</p>

            <Link
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
                href={'/premium'}
            >
                Upgrade Sekarang 🚀
            </Link>
        </div>
    );
}
