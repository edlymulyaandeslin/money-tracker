import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
    { title: 'Create', href: '/products/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        unit: '',
        image: null as File | null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/products', { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Product" />

            <section className="w-full px-6 py-10 md:px-12 lg:px-20">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Tambah Product</h1>
                    <p className="mt-2 text-base text-muted-foreground">Masukkan informasi product baru pada form berikut.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Nama Produk */}
                    <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama produk" />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Unit */}
                    <div>
                        <Label htmlFor="unit">Satuan</Label>
                        <Select value={data.unit} onValueChange={(value) => setData('unit', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Satuan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={'botol'}>Botol</SelectItem>
                                <SelectItem value={'dus'}>Dus</SelectItem>
                                <SelectItem value={'kotak'}>Kotak</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.unit && <p className="mt-1 text-sm text-red-500">{errors.unit}</p>}
                    </div>

                    {/* Upload Gambar dengan Preview */}
                    <div className="md:col-span-2">
                        <Label htmlFor="image">Gambar Produk</Label>
                        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                        {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}

                        {previewUrl && (
                            <div className="mt-4">
                                <p className="mb-1 text-sm text-muted-foreground">Preview:</p>
                                <img
                                    src={previewUrl}
                                    alt="Preview Produk"
                                    className="h-48 w-auto rounded-lg border border-gray-300 object-contain dark:border-gray-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tombol Submit */}
                    <div className="mt-4 flex justify-end md:col-span-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
}