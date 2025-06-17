'use client'; // This is our new client component

import { useState } from 'react';
import Navbar from 'src/widgets/Navbar';
import Sidebar from 'src/widgets/Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative flex">
            {/* Sidebar: positioned differently on mobile vs desktop */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:relative md:translate-x-0
                `}
            >
                <Sidebar />
            </aside>

            {/* Overlay for mobile to close sidebar on click */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <div className="flex flex-col flex-1">
                {/* Top Navbar */}
                <header className="sticky top-0 z-20 h-16 border-b bg-white shadow-sm">
                    <Navbar onMenuClick={() => setSidebarOpen(true)} />
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}