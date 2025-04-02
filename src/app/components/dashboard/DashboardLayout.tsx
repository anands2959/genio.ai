'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    href: string;
}

const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '/dashboard-icon.svg', href: '/dashboard' },
    { id: 'blog', label: 'Blog Generation', icon: '/content-icon.svg', href: '/dashboard/blog' },
    { id: 'voice', label: 'Voice Generation', icon: '/voice-icon.svg', href: '/dashboard/voice' },
    { id: 'video', label: 'Video Generation', icon: '/video-icon.svg', href: '/dashboard/video' },
    { id: 'image', label: 'Image Generation', icon: '/image-icon.svg', href: '/dashboard/image' },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [creditsUsed] = useState(750); // This would be fetched from your backend
    const [totalCredits] = useState(1000); // This would be fetched from your backend
    const profileRef = useRef<HTMLDivElement>(null);

    const activeItem = menuItems.find(item => item.href === pathname)?.id || 'dashboard';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900/90 to-black/90">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 h-screen bg-black/20 backdrop-blur-lg border-r border-white/20 fixed shadow-lg shadow-purple-500/5">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/20 bg-gradient-to-r from-black/10 to-purple-500/5">
                        <div className="flex items-center space-x-2">
                            <Image src="/genio-logo.svg" alt="Genio AI Logo" width={32} height={32} className="rounded-lg" />
                            <span className="text-xl font-bold gradient-text">Genio AI</span>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="p-4 space-y-2 bg-gradient-to-b from-black/10 to-transparent">
                        {menuItems.map((item, index) => (
                            <div key={item.id}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${activeItem === item.id
                                            ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/20 text-white shadow-lg shadow-purple-500/20 border border-white/10'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-purple-500/10'}`}
                                >
                                    <div className={`p-2 rounded-lg ${activeItem === item.id ? 'bg-purple-500/30 shadow-lg shadow-purple-500/20' : 'bg-black/30'}`}>
                                        <Image src={item.icon} alt={item.label} width={20} height={20} className="transition-transform group-hover:scale-110 invert" />
                                    </div>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </div>
                        ))}
                    </nav>

                    {/* Credits Usage Section */}

                    <div className="absolute bottom-15 left-0 right-0 p-4 border-t border-white/10 bg-black/30 backdrop-blur-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Credits Used</span>
                                <span className="text-white font-medium">{creditsUsed}/{totalCredits}</span>
                            </div>
                            <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                                    style={{ width: `${(creditsUsed / totalCredits) * 100}%` }}
                                />
                            </div>
                            <Link href="/dashboard/billing" className="block mt-10 w-full px-4 py-3 text-center text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 border border-white/10">
                                Upgrade Plan
                            </Link>

                        </div>


                    </div>

                </div>

                {/* Header */}
                <div className="fixed top-0 right-0 ml-64 w-[calc(100%-16rem)] bg-black/20 backdrop-blur-lg border-b border-white/20 shadow-lg shadow-purple-500/5 z-10">
                    <div className="flex justify-end items-center p-4 pr-8">
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="w-8 h-8 rounded-full bg-purple-500/80 flex items-center justify-center">
                                    <Image src="/user-icon.svg" alt="User Avatar" width={25} height={25} className="rounded-full text-white invert" />
                                </div>
                                {/* <span className="text-white hover:text-white">The Anand</span> */}
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-black/80 backdrop-blur-lg border border-white/20 shadow-xl shadow-purple-500/30 ring-1 ring-purple-500/20">
                                    <div className="p-4 border-b border-white/20 bg-gradient-to-r from-black/20 to-purple-500/5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden">
                                                <Image src={session?.user?.image || "/user-icon.svg"} alt="User Avatar" width={40} height={40} className="rounded-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{session?.user?.name || 'Guest User'}</div>
                                                <div className="text-sm text-gray-400">{session?.user?.email || 'No email'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-gradient-to-b from-black/10 to-transparent">
                                        <Link href="/dashboard/profile" className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 flex items-center space-x-3">
                                            <Image src="/profile-icon.svg" alt="Profile" width={18} height={18} className="text-gray-400 group-hover:text-white invert" />
                                            <span>Profile Settings</span>
                                        </Link>
                                        <Link href="/dashboard/billing" className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 flex items-center space-x-3">
                                            <Image src="/billing-icon.svg" alt="Billing" width={18} height={18} className="text-gray-400 group-hover:text-white invert" />
                                            <span>Billing</span>
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                signOut({ redirect: false }).then(() => {
                                                    router.push('/');
                                                });
                                            }} 
                                            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all duration-300 flex items-center space-x-3"
                                        >
                                            <Image src="/logout-icon.svg" alt="Logout" width={18} height={18} className="text-red-400 group-hover:text-red-300 invert" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 ml-64 p-8 mt-16 bg-gradient-to-b from-transparent to-black/20">
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;