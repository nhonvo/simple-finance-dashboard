'use client'; // Required to use hooks like usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import the correct hook

const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/house-fee', label: 'House Fee' },
    { href: '/save-invest', label: 'Saving & Investment' },
];

export default function Sidebar() {
    const pathname = usePathname(); // Use the Next.js hook to get the current path

    return (
        <nav className="flex flex-col gap-2 p-4">
            {links.map(({ href, label }) => (
                <Link
                    key={href}
                    href={href}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-200 ${
                        // Use a simpler check for the active link
                        pathname === href
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600'
                    }`}
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
}