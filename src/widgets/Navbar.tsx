'use client';

import React from 'react';

// The Navbar now needs a prop to handle the menu button click
interface NavbarProps {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <div className="flex items-center justify-between h-full px-4">
            {/* Hamburger Menu Button - Visible only on mobile (hidden on md screens and up) */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                aria-label="Open sidebar"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Your existing Navbar content */}
            <div className="text-lg font-semibold">Financial Dashboard</div>
            <div>
                {/* User Profile / Other Icons */}
            </div>
        </div>
    );
}