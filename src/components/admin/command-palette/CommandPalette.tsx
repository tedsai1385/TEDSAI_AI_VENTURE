'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/store/ui-store';
import {
    LayoutDashboard,
    Sprout,
    UtensilsCrossed,
    ShoppingBag,
    FileText,
    Users,
    Settings,
    Search,
    PlusCircle
} from 'lucide-react';

export function CommandPalette() {
    const router = useRouter();
    const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandPaletteOpen(!isCommandPaletteOpen);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [isCommandPaletteOpen, setCommandPaletteOpen]);

    const runCommand = React.useCallback((command: () => unknown) => {
        setCommandPaletteOpen(false);
        command();
    }, [setCommandPaletteOpen]);

    if (!isCommandPaletteOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setCommandPaletteOpen(false)}
            />

            <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-dark-surface shadow-2xl animate-fade-in ring-1 ring-white/10">
                <Command className="w-full">
                    <div className="flex items-center border-b border-white/10 px-4">
                        <Search className="mr-2 h-4 w-4 text-zinc-400" />
                        <Command.Input
                            placeholder="Rechercher une page ou lancer une action..."
                            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 text-white disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                        <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                            Aucun résultat trouvé.
                        </Command.Empty>

                        <div className="px-2 py-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            Navigation
                        </div>

                        <Command.Group>
                            <CommandItem onSelect={() => runCommand(() => router.push('/admin'))}>
                                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/admin/garden'))}>
                                <Sprout className="mr-2 h-4 w-4" /> Garden UI
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/admin/restaurant'))}>
                                <UtensilsCrossed className="mr-2 h-4 w-4" /> Restaurant
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/admin/shop'))}>
                                <ShoppingBag className="mr-2 h-4 w-4" /> Shop
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/admin/blog'))}>
                                <FileText className="mr-2 h-4 w-4" /> Blog / Observatoire
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/admin/users'))}>
                                <Users className="mr-2 h-4 w-4" /> Utilisateurs
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/admin/settings'))}>
                                <Settings className="mr-2 h-4 w-4" /> Paramètres
                            </CommandItem>
                        </Command.Group>

                        <div className="mt-2 px-2 py-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            Actions Rapides
                        </div>

                        <Command.Group>
                            <CommandItem onSelect={() => runCommand(() => router.push('/admin/shop/products/new'))}>
                                <PlusCircle className="mr-2 h-4 w-4 text-cortex-primary" /> Nouveau Produit
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push('/admin/blog/articles/new'))}>
                                <PlusCircle className="mr-2 h-4 w-4 text-cortex-secondary" /> Nouvel Article
                            </CommandItem>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </div>
    );
}

// Wrapper pour styliser les items CMDK car ils n'ont pas de class par default facilement accessible sans CSS global
function CommandItem({ children, onSelect }: { children: React.ReactNode, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm text-zinc-300 outline-none hover:bg-white/10 hover:text-white aria-selected:bg-white/10 aria-selected:text-white transition-colors"
        >
            {children}
        </Command.Item>
    );
}
