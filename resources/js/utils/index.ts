export function formatPrice(value: number | string): string {
    if (!value) return 'Rp 0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });
}

export const formatDateToHumanReadable = (date: string): string => {
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatBulan = (bulanStr: string) => {
    const [tahun, bulan] = bulanStr.split('-');
    const date = new Date(tahun, bulan - 1); // bulan dimulai dari 0
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
};
