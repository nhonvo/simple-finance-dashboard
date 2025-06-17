'use client';

import React, { useState, useMemo } from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import { BLUE_COLORS } from 'src/shared/types/color';
import { formatCurrency } from 'src/shared/utilities/formatData';

// --- TYPE DEFINITIONS ---
interface ExpenseItem {
    name: string;
    size: number;
}

interface ExpenseTreeMapProps {
    data: ExpenseItem[];
}

interface ChartProps {
    // Props passed by Recharts
    x: number; y: number; width: number; height: number;
    name: string; size: number; index: number;
    // Custom props we pass down for interactivity
    hoveredItem: string | null;
    setHoveredItem: (name: string | null) => void;
}

// --- CUSTOM CONTENT RENDERER ---
const CustomizedContent = (props: ChartProps) => {
    const { x, y, width, height, name, size, index, hoveredItem, setHoveredItem } = props;

    // Check if the current item is being hovered
    const isHovered = hoveredItem === name;

    return (
        <g
            onMouseEnter={() => setHoveredItem(name)}
            onMouseLeave={() => setHoveredItem(null)}
        >
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: BLUE_COLORS[index % BLUE_COLORS.length],
                    stroke: '#fff',
                    strokeWidth: 2,
                    // Highlight the box if it's being hovered
                    opacity: isHovered ? 1.0 : 0.85,
                    filter: isHovered ? 'brightness(1.2)' : 'none',
                    transition: 'opacity 0.2s, filter 0.2s',
                }}
                rx={4}
                ry={4}
            />
            {/* The title tooltip is always useful */}
            <title>{`${name}: ${formatCurrency(size)}`}</title>
        </g>
    );
};

// --- MAIN COMPONENT ---
const ExpenseTreeMap: React.FC<ExpenseTreeMapProps> = ({ data }) => {
    // State to track the currently hovered item
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const sortedData = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => b.size - a.size);
    }, [data]);

    return (
        <div className="flex flex-col md:flex-row w-full h-[450px] gap-6">
            {/* Chart Container */}
            <div className="w-full md:w-2/3 h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={sortedData}
                        dataKey="size"
                        stroke="#fff"
                        content={
                            <CustomizedContent
                                // Pass interactive state and setters to the content renderer
                                hoveredItem={hoveredItem}
                                setHoveredItem={setHoveredItem}
                                // Default props (Recharts replaces these)
                                x={0} y={0} width={0} height={0} name={''} size={0} index={0}
                            />
                        }
                        isAnimationActive={false} // Animation can feel laggy with hover effects
                    />
                </ResponsiveContainer>
            </div>

            {/* Interactive List Container */}
            <div className="w-full md:w-1/3 h-full overflow-y-auto border rounded-lg p-2 bg-gray-50">
                <h3 className="font-bold p-2 sticky top-0 bg-gray-50">All Categories</h3>
                <ul>
                    {sortedData.map((item, index) => (
                        <li
                            key={item.name}
                            onMouseEnter={() => setHoveredItem(item.name)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`flex justify-between p-2 rounded-md cursor-pointer transition-BLUE_COLORS ${hoveredItem === item.name ? 'bg-blue-200' : 'hover:bg-gray-200'
                                }`}
                        >
                            <span className="flex items-center">
                                <span
                                    className="w-3 h-3 rounded-full mr-2 inline-block"
                                    style={{ backgroundColor: BLUE_COLORS[index % BLUE_COLORS.length] }}
                                ></span>
                                {item.name}
                            </span>
                            <span className="font-mono text-sm">{formatCurrency(item.size)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ExpenseTreeMap;