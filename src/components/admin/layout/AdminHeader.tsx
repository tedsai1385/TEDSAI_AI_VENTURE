'use client';

import { useUIStore } from '@/lib/store/ui-store';
import { Bell, Command, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AdminHeader() {
    const { setCommandPaletteOpen } = useUIStore();

    return (
        <header className="fixed top-0 right-0 left-0 md:left-72 h-16 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 z-40 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                {/* Command Palette Trigger */}
                <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="hidden md:flex items-center gap-2 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-400 hover:text-white hover:border-cortex-restaurant/50 transition-all w-full max-w-md group"
                >
                    <Search className="w-4 h-4" />
                    <span>Rechercher ou lancer une commande...</span>
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-1.5 font-mono text-[10px] font-medium text-neutral-400 group-hover:text-white">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="relative text-neutral-400 hover:text-white p-2">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-cortex-danger rounded-full animate-pulse" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-neutral-800 hover:ring-cortex-restaurant transition-all p-0 overflow-hidden">
                            <div className="h-full w-full bg-gradient-to-tr from-cortex-garden to-cortex-restaurant flex items-center justify-center font-bold text-white text-[10px]">
                                ADMIN
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-neutral-900 border-neutral-800 text-white" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Admin User</p>
                                <p className="text-xs leading-none text-neutral-400">admin@tedsai.cm</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-neutral-800" />
                        <DropdownMenuItem className="text-neutral-300 focus:text-white focus:bg-white/10 cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-neutral-300 focus:text-white focus:bg-white/10 cursor-pointer">
                            <Command className="mr-2 h-4 w-4" />
                            <span>Raccourcis</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
