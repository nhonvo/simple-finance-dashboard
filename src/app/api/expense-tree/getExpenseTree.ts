import { FetchTransactionsParams } from "src/shared/types/FetchTransactionsParams";
import { getTransactions } from "../transactions/getTransactions";
import { Transaction } from "src/shared/types/Transaction";

// ============================================================================
// 1. DEFINE CATEGORIZATION RULES (Maintainability)
//    This structure is much easier to read and update.
// ============================================================================
const CATEGORIZATION_RULES: Record<string, string[]> = {
    // Standardized Category: [keywords, ...]
    "Rent": ["tiền nhà", "tran minh dat", "ho nguyen duy"],
    "Management Fees": ["phí quản lý"],
    "Utilities": ["tiền điện nước", "tiền điện", "nước"],
    "Internet": ["internet", "wifi", "fpt telecom", "cn cty cp vien thong fpt"],
    "Healthcare": ["thuốc", "sức khỏe", "đo mắt", "khám tai", "benh vien da khoa", "nha khoa"],
    "Pharmacy": ["long châu"],
    "Insurance": ["bao hiem"],
    "Telecommunications": ["vinaphone"],
    "Vehicle Maintenance": ["nhớt", "sửa xe", "honda head", "rửa xe"],
    "Transportation": ["xăng", "xe hoàng đạt", "xe phương trang"],
    "Food": ["sendo", "bhx", "phong ký 2", "mì tôm", "cuốn thịt nướng", "canh chua", "canh cá lóc", "xiên bẩn", "xôi", "utop", "phở gia truyền"],
    "Restaurant": ["quán gỏi cá lăn", "hương biển"],
    "Beverages": ["chè", "mixue", "suncha", "tàu hủ", "cafe máy", "café", "nước dừa", "rau má", "sinh tố", "sữa hạt", "trà", "cây đồ uống", "coca"],
    "Supermarket": ["coopmart", "emart", "siêu thị", "winmart"],
    "Convenience Store": ["circlek", "familymart", "gs25", "7eleven"],
    "Shopping": ["tiktok", "click buy", "mazo", "shopee", "simime shop", "chạm lá", "cellphones"],
    "Entertainment": ["an choi", "bhc cinema", "cinestar"],
    "Gifts": ["ngày 8/3"],
    "Gym": ["bbgym2"],
    "Barber": ["hiệp gà barber", "đông tây barber"],
    "Education": ["hutech", "truong dai hoc cong nghe tphcm"],
    "Investment": ["vps", "vps-vo thuong truong nhon"],
    "Banking": ["tpbank", "visa"],
    "Bank Transfer": ["tk tgtt cn cong hoa"],
    "Personal Transfer": ["nguyen le tan binh", "pham minh thu"],
    "Team Expenses": ["nguyen thi my nhan", "ha thi my tram"],
    "Online Services": ["cty cp dich vu di dong truc tuyen"],
    "Quy Nhon Trip": ["quy nhon trip"],
    "Personal": ["vo thuong truong nhon"],
    "Cash Withdrawal": ["rut tien bang qrc", "cash"],
};

// Direct mapping for tx.category field. This is the highest priority.
const DIRECT_CATEGORY_MAP: Record<string, string> = {
    "saving": "Savings",
    "team": "Team Expenses",
    "invest": "Investment",
    "foodoffice": "Food (Office)",
    "food": "Food",
    "rent": "Rent",
    "cash": "Cash",
    "health": "Healthcare",
    "education": "Education",
    "shopping": "Shopping",
    "income": "Income", // Note: This will be filtered out by the debit > 0 check
};

// const INTERNAL_TRANSFER_CATEGORIES = new Set([
//     'Investment',
//     'Savings',
//     'Cash Withdrawal',
//     'Personal Transfer',
//     'Bank Transfer',
// ]);

// ============================================================================
// 2. PRE-COMPUTE LOOKUP MAP (Performance)
//    This runs only ONCE when the server starts, not per transaction.
// ============================================================================
const KEYWORD_TO_CATEGORY_MAP = new Map<string, string>();
for (const category in CATEGORIZATION_RULES) {
    for (const keyword of CATEGORIZATION_RULES[category]) {
        KEYWORD_TO_CATEGORY_MAP.set(keyword.toLowerCase(), category);
    }
}
// For optimal performance, sort keywords by length descending.
// This ensures that "xe phương trang" is matched before "xe".
const SORTED_KEYWORDS = Array.from(KEYWORD_TO_CATEGORY_MAP.keys()).sort((a, b) => b.length - a.length);


// ============================================================================
// 3. REFACTORED CATEGORIZATION LOGIC (Clarity & Readability)
// ============================================================================
function categorizeExpense(tx: Transaction): string {
    const categoryLower = tx.category?.toLowerCase();
    const descriptionLower = tx.counter_account?.toLowerCase();

    // Priority 1: Direct match from the transaction's 'category' field.
    if (categoryLower && DIRECT_CATEGORY_MAP[categoryLower]) {
        return DIRECT_CATEGORY_MAP[categoryLower];
    }

    // Priority 2: Keyword match in the transaction's description/counter_account.
    if (descriptionLower) {
        for (const keyword of SORTED_KEYWORDS) {
            if (descriptionLower.includes(keyword)) {
                return KEYWORD_TO_CATEGORY_MAP.get(keyword)!;
            }
        }
    }

    // Priority 3: Default category.
    return "Others";
}


// ============================================================================
// 4. ENHANCED `getExpenseTree` FUNCTION
// ============================================================================
interface ExpenseTreeItem {
    name: string;
    size: number;
}

export async function getExpenseTree(params: FetchTransactionsParams): Promise<ExpenseTreeItem[]> {
    try {
        const transactions = await getTransactions(params);
        const categoryTotals = new Map<string, number>();

        for (const tx of transactions) {
            const expenseCategory = categorizeExpense(tx);

            // if (INTERNAL_TRANSFER_CATEGORIES.has(expenseCategory)) {
            //     continue;
            // }

            const currentTotal = categoryTotals.get(expenseCategory) || 0;
            categoryTotals.set(expenseCategory, currentTotal + tx.debit - tx.credit);
        }

        const result: ExpenseTreeItem[] = Array.from(categoryTotals.entries())
            .map(([name, size]) => ({ name, size }));

        return result;
    } catch (error) {
        console.error(`Error computing expense tree: ${error}`);
        return [];
    }
}