import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LayoutDashboard, Leaf, UtensilsCrossed, ShoppingBag, LineChart, Users, Settings, LogOut, Menu, Sparkles, FileText, Image as ImageIcon, ChevronDown, ChevronRight, Sprout } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { useState, useEffect } from 'react';

interface SidebarProps {
    className?: string;
    pathname: string;
    router: any;
    open: boolean;
    setOpen: (open: boolean) => void;
    expandedGroups: string[];
    toggleGroup: (label: string) => void;
    routes: any[];
}

const SidebarContent = ({ pathname, router, open, setOpen, expandedGroups, toggleGroup, routes }: SidebarProps) => (
    <div className="space-y-4 py-4 flex flex-col h-full bg-neutral-900 text-white border-r border-neutral-800 shadow-xl">
        <div className="px-3 py-2 flex-1 overflow-y-auto">
            <Link href="/admin" className="flex items-center gap-3 pl-3 mb-10 group">
                <div className="relative w-10 h-10 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-cortex-garden to-cortex-restaurant rounded-xl opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-neutral-950 w-full h-full rounded-xl flex items-center justify-center border border-neutral-800 overflow-hidden shadow-lg p-1">
                        <Image
                            src="/assets/images/logos/tedsai_logo.jpg"
                            alt="TEDSAI"
                            width={40}
                            height={40}
                            className="object-cover rounded-sm"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold font-heading tracking-tight leading-none">
                        TEDSAI <span className="text-cortex-restaurant">Cortex</span>
                    </h1>
                    <p className="text-[9px] text-neutral-500 font-mono mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        SYS: OPERATIONAL v2.0
                    </p>
                </div>
            </Link>

            <div className="space-y-1">
                {routes.map((route) => {
                    const hasSubRoutes = !!route.subRoutes;
                    const isExpanded = expandedGroups.includes(route.label);
                    const safePathname = pathname || '';
                    const isActive = safePathname === route.href || (route.subRoutes?.some((sr: any) => safePathname === sr.href));

                    return (
                        <div key={route.label} className="space-y-1">
                            <div
                                onClick={() => hasSubRoutes ? toggleGroup(route.label) : (setOpen(false), router.push(route.href))}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200",
                                    isActive && !hasSubRoutes ? "bg-white/10 text-white" : "text-neutral-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3 transition-transform group-hover:scale-110", route.color)} />
                                    {route.label}
                                </div>
                                {hasSubRoutes ? (
                                    isExpanded ? <ChevronDown className="h-4 w-4 text-neutral-600" /> : <ChevronRight className="h-4 w-4 text-neutral-600" />
                                ) : (
                                    isActive && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-cortex-restaurant shadow-[0_0_8px] shadow-cortex-restaurant" />
                                    )
                                )}
                            </div>

                            {/* Sub Routes Rendering */}
                            {hasSubRoutes && isExpanded && (
                                <div className="ml-8 space-y-1 border-l border-neutral-800 pl-2 mt-1 animate-slide-up">
                                    {route.subRoutes.map((sub: any) => (
                                        <Link
                                            key={sub.href}
                                            href={sub.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "text-[13px] flex p-2 w-full justify-start font-medium cursor-pointer hover:text-white rounded-md transition-colors",
                                                safePathname === sub.href ? "text-cortex-restaurant font-bold" : "text-neutral-500"
                                            )}
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="px-3 py-4 border-t border-neutral-800/50 bg-black/20">
            <button
                onClick={() => {
                    localStorage.removeItem('admin-authenticated');
                    router.push('/admin/auth/login');
                }}
                className="flex items-center w-full px-3 py-3 text-sm font-medium text-neutral-500 hover:text-white hover:bg-red-500/10 rounded-lg transition-all group"
            >
                <LogOut className="h-5 w-5 mr-3 text-red-500 group-hover:rotate-12 transition-transform" />
                Déconnexion
            </button>
        </div>
    </div>
);

export function AdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<string[]>(['Restaurant', 'SelecTED Garden']);

    const routes = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin', color: 'text-sky-500' },
        {
            label: 'SelecTED Garden',
            icon: Leaf,
            href: '/admin/garden',
            color: 'text-cortex-primary',
            subRoutes: [
                { label: 'Dashboard', href: '/admin/garden' },
                { label: 'Gérer Catalogue', href: '/admin/garden/harvests' },
            ]
        },
        {
            label: 'Restaurant',
            icon: UtensilsCrossed,
            href: '/admin/orders/board',
            color: 'text-[#D4A017]',
            subRoutes: [
                { label: 'Flux Commandes', href: '/admin/orders/board' },
                { label: 'Réservations', href: '/admin/reservations' },
                { label: 'Gestion Menu', href: '/admin/menu' },
                { label: 'Gallerie & Photos', href: '/admin/restaurant' },
            ]
        },
        {
            label: 'Shop',
            icon: ShoppingBag,
            href: '/admin/shop',
            color: 'text-[#0A2540]',
            subRoutes: [
                { label: 'Aperçu / Promos', href: '/admin/shop' },
                { label: 'Nos Trésors', href: '/admin/shop/products' },
                { label: 'Gérer les Packs', href: '/admin/shop/packs' },
            ]
        },
        {
            label: 'Observatoire',
            icon: LineChart,
            href: '/admin/observatoire',
            color: 'text-[#4B0082]',
            subRoutes: [
                { label: 'Dashboard Data', href: '/admin/observatoire' },
                { label: 'Gérer Articles', href: '/admin/observatoire/articles' },
                { label: 'Métriques Live', href: '/admin/observatoire/metrics' },
            ]
        },
        { label: 'Blog', icon: FileText, href: '/admin/blog', color: 'text-zinc-400' },
        { label: 'Portfolio Infog.', icon: ImageIcon, href: '/admin/portfolio/infographie', color: 'text-[#FF4500]' },
        { label: 'Utilisateurs', icon: Users, href: '/admin/users', color: 'text-zinc-500' },
        { label: 'Paramètres', icon: Settings, href: '/admin/settings', color: 'text-zinc-600' },
    ];

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev =>
            prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
        );
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50">
                <SidebarContent
                    pathname={pathname || ''}
                    router={router}
                    open={open}
                    setOpen={setOpen}
                    expandedGroups={expandedGroups}
                    toggleGroup={toggleGroup}
                    routes={routes}
                />
            </div>

            {/* Mobile Sheet */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800 w-10 h-10 p-0 flex items-center justify-center">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-neutral-900 border-r-neutral-800 w-72">
                        <SidebarContent
                            pathname={pathname || ''}
                            router={router}
                            open={open}
                            setOpen={setOpen}
                            expandedGroups={expandedGroups}
                            toggleGroup={toggleGroup}
                            routes={routes}
                        />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
