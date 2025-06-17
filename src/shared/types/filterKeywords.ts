import { Transaction } from "./Transaction";

export const excludeSavingInvestFilters: [keyof Transaction, string][] = [
    ['description', 'TAT TOAN TAI KHOAN TIET KIEM'],
    ['description', 'TRA LAI TIEN GUI TK'],
    ['description', 'tiền nhận hộ cty'],
    ['description', 'đầu tư'],
    ['category', 'saving'],
    ['category', 'invest'],
];

export const cleanFilters: [keyof Transaction, string][] = [
    ['description', 'TAT TOAN TAI KHOAN TIET KIEM'],
    ['description', 'CONG TY TNHH PHAN MEM FPT '],
    ['description', 'TRA LAI TIEN GUI TK'],
    ['description', 'Tiết kiệm Điện tử'],
    ['description', 'tiền nhận hộ cty'],
    ['description', 'đầu tư'],
    ['category', 'saving'],
    ['category', 'invest'],
];

export const savingFilters: [keyof Transaction, string][] = [
    ['description', 'TAT TOAN TAI KHOAN TIET KIEM'],
    ['description', 'TRA LAI TIEN GUI TK'],
    ['description', 'Tiết kiệm Điện tử'],
    ['category', 'saving'],
];

export const investFilters: [keyof Transaction, string][] = [
    ['description', 'đầu tư'],
    ['category', 'invest'],
];
