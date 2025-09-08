import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Product } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
    { title: 'Edit', href: '/products/edit' },
];

export default function Edit({ product }: { product: Product }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { data, setData } = useForm({
        name: product?.name || '',
        sku: product?.sku || '',
        unit: product?.unit || '',
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

        setIsSubmitting(true);

        router.post(
            route('products.update', product.id),
            {
                ...data,
                _method: 'PUT',
            },
            {
                forceFormData: true,
                onFinish: () => {
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />

            <section className="w-full px-6 py-10 md:px-12 lg:px-20">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Edit Product</h1>
                    <p className="mt-2 text-base text-muted-foreground">Ubah informasi produk pada form berikut.</p>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Nama Produk */}
                    <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama produk" />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* SKU */}
                    <div>
                        <Label htmlFor="sku">Kode Produk</Label>
                        <Input id="sku" value={data.sku} readOnly placeholder="Kode Produk" />
                        {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku}</p>}
                    </div>

                    {/* Unit */}
                    <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={data.unit} onValueChange={(value) => setData('unit', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Unit" />
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
                        <Input id="image" type="file" onChange={handleImageChange} />
                        {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}

                        {previewUrl ? (
                            <div className="mt-4">
                                <p className="mb-1 text-sm text-muted-foreground">Preview:</p>
                                <img
                                    src={previewUrl}
                                    alt="Preview Produk"
                                    className="h-48 w-auto rounded-lg border border-gray-300 object-contain dark:border-gray-700"
                                />
                            </div>
                        ) : (
                            <div className="mt-4">
                                <p className="mb-1 text-sm text-muted-foreground">Preview:</p>
                                <img
                                    src={
                                        product.image
                                            ? `/storage/${product.image}`
                                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6xKMudVFtik4Lw_hXqz_VD2tZtPlBDezD0w&s'
                                    }
                                    alt="Preview Produk"
                                    className="h-48 w-auto rounded-lg border border-gray-300 object-contain dark:border-gray-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tombol Submit */}
                    <div className="mt-4 flex justify-end md:col-span-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
}