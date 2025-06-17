'use client';

import { useMemo, useState } from 'react';

// Define options for the hook to make it configurable
type PaginationOptions = {
    initialPage?: number;
    itemsPerPage: number;
};

export const usePagination = <T>(
    data: T[],
    options: PaginationOptions
) => {
    const { itemsPerPage, initialPage = 1 } = options;
    const [currentPage, setCurrentPage] = useState(initialPage);

    // useMemo ensures this is only recalculated if the data array changes
    const totalPages = useMemo(
        () => Math.ceil(data.length / itemsPerPage),
        [data.length, itemsPerPage]
    );

    // useMemo prevents re-slicing the array on every render
    const paginatedData = useMemo(() => {
        const offset = (currentPage - 1) * itemsPerPage;
        return data.slice(offset, offset + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    const handlePageChange = (newPage: number) => {
        // Boundary checks are still important
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return {
        // Clearer return names
        paginatedData,
        currentPage,
        totalPages,
        handlePageChange,
        setCurrentPage, // Also useful to return the setter
    };
};