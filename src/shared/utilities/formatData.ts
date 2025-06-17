export const formatCurrency 
    = (num: number) => num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`; // Format as dd/MM
}
