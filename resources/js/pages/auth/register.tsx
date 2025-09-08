import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Left Section */}
                <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-br from-green-600 to-emerald-700 p-12 text-white lg:flex">
                    <img src="/img/logo-removebg.png" alt="logo" className="size-60" />
                    <h1 className="mb-6 text-4xl leading-tight font-bold">Buat Akun Baru</h1>
                    <p className="text-lg text-green-100">
                        Mulai kelola keuanganmu dengan mudah. Gratis untuk digunakan, transparan, dan selalu bisa diandalkan.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex w-full items-center justify-center lg:w-1/2">
                    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Daftar Akun</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Masukkan detailmu untuk membuat akun baru</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Nama lengkap"
                                    className="mt-1"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="you@example.com"
                                    className="mt-1"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Password */}
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="••••••••"
                                    className="mt-1"
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="••••••••"
                                    className="mt-1"
                                />
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Buat Akun
                            </Button>
                        </form>

                        {/* Login link */}
                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Sudah punya akun?{' '}
                            <TextLink href={route('login')} className="font-medium text-green-600 hover:underline dark:text-green-400">
                                Masuk
                            </TextLink>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
