'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { TransactionFiltersProps } from 'src/features/dashboard/types/TransactionFiltersProps';

type Props = {
    filters: TransactionFiltersProps;
    handleChange: <K extends keyof TransactionFiltersProps>(key: K, value: string | boolean | number) => void;
};

export default function TransactionFilters({ filters, handleChange }: Props) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleLocalChange = <K extends keyof TransactionFiltersProps>(key: K, value: string | boolean | number) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        Object.entries(localFilters).forEach(([key, value]) => {
            handleChange(key as keyof TransactionFiltersProps, value);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // prevent page reload
        applyFilters();
    };

    return (
        <form onSubmit={handleSubmit}>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                        type="date"
                        name="start_date"
                        value={localFilters.start_date}
                        onChange={(e) => handleLocalChange('start_date', e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                        type="date"
                        name="end_date"
                        value={localFilters.end_date}
                        onChange={(e) => handleLocalChange('end_date', e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="limit">Limit</Label>
                    <Input
                        type="number"
                        name="limit"
                        value={localFilters.limit}
                        onChange={(e) => handleLocalChange('limit', Number(e.target.value))}
                    />
                </div>

                <div>
                    <Label htmlFor="offset">Offset</Label>
                    <Input
                        type="number"
                        name="offset"
                        value={localFilters.offset}
                        onChange={(e) => handleLocalChange('offset', Number(e.target.value))}
                    />
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <Switch
                        checked={localFilters.clean}
                        onCheckedChange={(value) => handleLocalChange('clean', value)}
                        id="clean"
                    />
                    <Label htmlFor="clean">Clean</Label>
                </div>

                <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                        type="text"
                        name="query"
                        placeholder="Search description..."
                        value={localFilters.query || ''}
                        onChange={(e) => handleLocalChange('query', e.target.value)}
                    />
                </div>

                <div className="col-span-full">
                    <Button type="submit">Apply Filters</Button>
                </div>
            </section>
        </form>
    );
}
