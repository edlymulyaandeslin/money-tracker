import DataTable from '@/components/data-table';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type User } from '@/types';
import { formatDateToHumanReadable } from '@/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User',
        href: '/users',
    },
];

export default function Index({ users }: { users: PaginatedData<User> }) {
    const { props } = usePage<{ users: PaginatedData<User>; search?: string }>();
    const initialSearch = props.search || '';
    const [search, setSearch] = useState(initialSearch);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Debounce search
    useEffect(() => {
        if (search !== initialSearch) {
            const delayDebounce = setTimeout(() => {
                router.get('/users', { search }, { preserveState: true, replace: true });
            }, 400);

            return () => clearTimeout(delayDebounce);
        }
    }, [search, initialSearch]);

    const handleDelete = () => {
        if (!selectedUser) return;

        router.delete(`/users/${selectedUser.id}`, {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setSelectedUser(null);
            },
            onError: (err) => {
                console.error('Gagal hapus users:', err);
                alert('Gagal menghapus users. Coba lagi.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data User" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Data User</h2>
                    <Link
                        href="/users/create"
                        className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
                    >
                        + Tambah User
                    </Link>
                </div>

                <input
                    type="text"
                    placeholder="Cari users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <DataTable
                    data={users.data}
                    from={users.from}
                    to={users.to}
                    total={users.total}
                    links={users.links}
                    columns={[
                        {
                            title: '#',
                            render: (_, index) => <span className="text-sm">{index}</span>,
                        },
                        {
                            title: 'Nama',
                            render: (user) => <span className="text-sm font-medium">{user.name}</span>,
                        },
                        {
                            title: 'Email',
                            render: (user) => <span className="text-sm font-medium">{user.email}</span>,
                        },
                        {
                            title: 'Role',
                            render: (user) => (
                                <span
                                    className={`rounded-full px-2 py-1 text-sm font-medium ${user.role == 'super' ? 'bg-orange-600' : 'bg-blue-600'}`}
                                >
                                    {user.role}
                                </span>
                            ),
                        },
                        {
                            title: 'Aksi',
                            className: 'text-right',
                            render: (user) => (
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setOpenDetailModal(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                        Lihat
                                    </button>
                                    <Link
                                        href={`/users/${user.id}/edit`}
                                        className="inline-flex items-center rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setOpenDeleteModal(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* Modal Detail User (baru diimplementasikan dari UserIndex) */}
            <Modal isOpen={openDetailModal} onClose={() => setOpenDetailModal(false)} title="Detail User" size="lg">
                {selectedUser && (
                    <div className="space-y-6 rounded-lg bg-white py-6 text-sm text-gray-700 dark:bg-zinc-900 dark:text-gray-200">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Nama</span>
                                <span className="text-base font-semibold">{selectedUser.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
                                <span className="text-base font-semibold">{selectedUser.email}</span>
                            </div>
                            <div className="flex w-fit flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Role</span>
                                <span
                                    className={`w-fit rounded-full px-2 py-0.5 text-sm font-medium text-white ${
                                        {
                                            super: 'bg-orange-600',
                                            user: 'bg-blue-600',
                                        }[selectedUser.role] || 'bg-gray-600'
                                    }`}
                                >
                                    {selectedUser.role}
                                </span>
                            </div>
                            <div className="flex w-fit flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Jenis Akun</span>

                                {Boolean(selectedUser.is_premium) === true ? (
                                    <span className="inline-flex w-fit items-center rounded-full bg-gradient-to-r from-blue-400 to-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                        Premium
                                    </span>
                                ) : (
                                    <span className="inline-flex w-fit items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200">
                                        Free
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Dibuat Pada</span>
                                <span className="text-base">
                                    {selectedUser.created_at ? formatDateToHumanReadable(selectedUser.created_at) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Diperbarui Pada</span>
                                <span className="text-base">
                                    {selectedUser.updated_at ? formatDateToHumanReadable(selectedUser.updated_at) : 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant={'secondary'} onClick={() => setOpenDetailModal(false)} className="cursor-pointer">
                                Tutup
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

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
                Apakah Anda yakin ingin menghapus users <strong className="text-red-600 dark:text-red-400">{selectedUser?.name}</strong>? Tindakan ini
                tidak dapat dibatalkan.
            </Modal>
        </AppLayout>
    );
}
