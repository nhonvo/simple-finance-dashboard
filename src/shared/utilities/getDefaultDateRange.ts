export function getDefaultDateRange(): { start_date: string; end_date: string } {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const endDate = new Date(currentYear, currentMonth, 19); // 19th of current month
    const startMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const startYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const startDate = new Date(startYear, startMonth, 19); // 19th of previous month

    // Format to 'YYYY-MM-DD'
    const format = (date: Date) => date.toISOString().split('T')[0];

    return {
        start_date: format(startDate),
        end_date: format(endDate),
    };
}
