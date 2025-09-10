import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { CheckCircle, Lock, Unlock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Fitur Premium', href: '#' }];

export default function PremiumFeatures() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        'Ringkasan laporan bulanan detail',
        'Export laporan bulanan ke PDF',
        'Akses tak terbatas ke semua fitur',
        'Prioritas support',
        'Update fitur terbaru lebih awal',
    ];

    const handleUpgradeToPremium = async () => {
        const data = await axios.post(route('upgrade-premium'));
        const snapToken = data.data;

        snap.pay(snapToken, {
            onSuccess: function (result) {
                router.post(route('webhook'), result);
            },
            onPending: function () {},
            onError: function (result) {
                router.post(route('webhook'), result);
            },
            onClose: function () {
                console.log('customer closed the popup without finishing the payment');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Premium" />
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-950">
                {/* Hero */}
                {Boolean(auth.user?.is_premium) === true ? (
                    <div className="mx-auto max-w-3xl text-center">
                        <Unlock className="mx-auto mb-6 h-16 w-16 text-blue-600 dark:text-blue-400" />
                        <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Akun Premium <span className="text-blue-600 dark:text-blue-400">Aktif</span>
                        </h1>

                        <p className="mb-4 font-semibold text-gray-600 dark:text-gray-400">Berlaku: Lifetime access</p>

                        {/* Daftar Fitur */}
                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-8 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                            <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
                                Kamu sudah memiliki akses penuh ke semua fitur eksklusif.
                            </h2>
                            <ul className="space-y-4">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500" />
                                        <span className="text-base">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto max-w-3xl text-center">
                        <Lock className="mx-auto mb-6 h-16 w-16 text-blue-600 dark:text-blue-400" />
                        <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Upgrade ke Premium</h1>
                        <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
                            Nikmati laporan detail, grafik keuangan, dan fitur eksklusif lainnya hanya{' '}
                            <span className="text-base font-semibold text-blue-600 dark:text-blue-400">Rp 50.000</span>
                        </p>
                    </div>
                )}

                {/* Content */}
                {Boolean(auth.user?.is_premium) !== true && (
                    <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
                        {/* Daftar Fitur */}
                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-8 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                            <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">Apa yang kamu dapatkan</h2>
                            <ul className="space-y-4">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500" />
                                        <span className="text-base">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Pricing Card */}
                        <div className="relative flex flex-col items-center justify-center rounded-2xl border border-blue-400 bg-gradient-to-b from-blue-50 to-white p-10 shadow-xl dark:border-blue-700 dark:from-blue-900/40 dark:to-gray-900">
                            {/* Badge */}
                            <span className="absolute -top-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-xs font-bold tracking-wide text-white uppercase shadow">
                                Best Value
                            </span>
                            <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">Premium Plan</h2>
                            <p className="mb-8 text-5xl font-extrabold text-blue-600 dark:text-blue-400">Rp 50K</p>
                            <Button
                                className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                                onClick={handleUpgradeToPremium}
                            >
                                Upgrade Sekarang ✨
                            </Button>
                            <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">Berlangganan sekali akses selamanya!</p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
