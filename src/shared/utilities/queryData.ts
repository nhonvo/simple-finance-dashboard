// Define the types for our sorting options
export type SortDirection = 'asc' | 'desc';

export interface SortCriterion<T> {
    key: keyof T;
    direction?: SortDirection; // Direction is optional, defaults to 'asc'
}

// Update the main options interface
export interface QueryOptions<T> {
    filterFn?: (item: T) => boolean;
    orderBy?: SortCriterion<T>[]; // Replaces sortBy and orderDesc
    offset?: number;
    limit?: number;
}

// Define a type for values that can be safely compared
type ComparablePrimitive = string | number | Date | boolean | null | undefined;

function compareValues(a: ComparablePrimitive, b: ComparablePrimitive): number {
    // Treat null/undefined as "less than" everything else
    if (a === null || a === undefined) return -1;
    if (b === null || b === undefined) return 1;

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

export function queryCollection<T>(data: T[], options: QueryOptions<T>): T[] {
    let result = data;

    // 1. Filtering
    if (options.filterFn) {
        result = result.filter(options.filterFn);
    }

    // 2. Sorting (New "orderBy" logic)
    if (options.orderBy && options.orderBy.length > 0 && data.length > 0) {
        result = [...result].sort((a, b) => {
            for (const criterion of options.orderBy!) {
                const { key, direction = 'asc' } = criterion;
                const order = direction === 'asc' ? 1 : -1;

                const comparison = compareValues(a[key] as ComparablePrimitive, b[key] as ComparablePrimitive);

                // If the values are not equal, we've found our sort order
                if (comparison !== 0) {
                    return comparison * order;
                }
            }
            // If all orderBy criteria were equal, maintain original order
            return 0;
        });
    }

    // 3. Pagination
    if (typeof options.offset === 'number') {
        result = options.limit != null
            ? result.slice(options.offset, options.offset + options.limit)
            : result.slice(options.offset);
    } else if (typeof options.limit === 'number') {
        result = result.slice(0, options.limit);
    }

    return result;
}