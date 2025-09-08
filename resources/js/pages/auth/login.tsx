import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Left Section */}
                <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-br from-green-600 to-emerald-700 p-12 text-white lg:flex">
                    <img src="/img/logo-removebg.png" alt="logo" className="size-60" />
                    <h1 className="mb-6 text-4xl leading-tight font-bold">Money Tracker</h1>
                    <p className="text-lg text-green-100">
                        Kelola keuanganmu dengan lebih mudah. Catat pemasukan, kontrol pengeluaran, dan pantau saldo setiap saat.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex w-full items-center justify-center lg:w-1/2">
                    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Selamat Datang</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Masuk ke akunmu untuk melanjutkan</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                    className="mt-1"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={route('password.request')}
                                            className="text-sm font-medium text-green-600 hover:underline dark:text-green-400"
                                        >
                                            Lupa password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="mt-1"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" name="remember" checked={data.remember} onClick={() => setData('remember', !data.remember)} />
                                <Label htmlFor="remember">Ingat saya</Label>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Masuk
                            </Button>
                        </form>

                        {/* Register */}
                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Belum punya akun?{' '}
                            <TextLink href={route('register')} className="font-medium text-green-600 hover:underline dark:text-green-400">
                                Daftar
                            </TextLink>
                        </p>

                        {/* Status */}
                        {status && <div className="mt-4 text-center text-sm font-medium text-green-600 dark:text-green-400">{status}</div>}
                    </div>
                </div>
            </div>
        </>
    );
}
