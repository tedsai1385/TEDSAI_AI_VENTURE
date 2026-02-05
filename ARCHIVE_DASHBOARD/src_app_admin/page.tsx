import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Sparkles,
    TrendingUp,
    AlertTriangle,
    Package,
    Clock,
    Plus,
    ClipboardList,
    FileText,
    Leaf
} from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-cortex-primary to-cortex-secondary rounded-xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-heading font-bold mb-2">
                            Bienvenue sur TEDSAI Cortex
                        </h1>
                        <p className="text-white/90">
                            Votre centre de commandement intelligent - De la Data à l'Assiette
                        </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold">99.9%</div>
                            <div className="text-sm text-white/80">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alertes Urgentes */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-cortex-danger" />
                    <h2 className="text-xl font-heading font-bold text-white">
                        Alertes & Actions Urgentes
                    </h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-cortex-danger/10 border border-cortex-danger/20 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cortex-danger animate-pulse" />
                            <div>
                                <p className="font-medium text-white">3 produits en rupture de stock</p>
                                <p className="text-sm text-dark-text-secondary">Basilic, Piment, Aubergines</p>
                            </div>
                        </div>
                        <Link href="/admin/garden/inventory">
                            <Button size="sm" className="bg-cortex-primary hover:bg-cortex-primary-dark">
                                Gérer
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-cortex-warning/10 border border-cortex-warning/20 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cortex-warning animate-pulse" />
                            <div>
                                <p className="font-medium text-white">2 commandes en attente de confirmation</p>
                                <p className="text-sm text-dark-text-secondary">Depuis plus de 15 minutes</p>
                            </div>
                        </div>
                        <Link href="/admin/restaurant/orders">
                            <Button size="sm" variant="outline" className="border-cortex-warning text-cortex-warning hover:bg-cortex-warning/10">
                                Voir
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-cortex-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-cortex-primary/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-cortex-primary" />
                        </div>
                        <span className="text-xs font-medium text-cortex-success">+12%</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">245,000</div>
                    <div className="text-sm text-dark-text-secondary">FCFA revenus (aujourd'hui)</div>
                </div>

                <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-cortex-secondary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-cortex-secondary/10 flex items-center justify-center">
                            <Package className="w-6 h-6 text-cortex-secondary" />
                        </div>
                        <span className="text-xs font-medium text-cortex-success">+8%</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">127kg</div>
                    <div className="text-sm text-dark-text-secondary">Stock disponible</div>
                </div>

                <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-cortex-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-cortex-primary/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-cortex-primary" />
                        </div>
                        <span className="text-xs font-medium text-cortex-danger">-5%</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">12</div>
                    <div className="text-sm text-dark-text-secondary">Commandes en cours</div>
                </div>

                <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-cortex-secondary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-cortex-secondary/10 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-cortex-secondary" />
                        </div>
                        <span className="text-xs font-medium text-cortex-success">+40%</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">156</div>
                    <div className="text-sm text-dark-text-secondary">Actions IA ce mois</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/shop/products/new" className="group">
                    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-cortex-primary transition-all hover:shadow-glow-green">
                        <div className="w-12 h-12 rounded-lg bg-cortex-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-cortex-primary" />
                        </div>
                        <h3 className="text-lg font-heading font-bold text-white mb-2">
                            Nouveau Produit
                        </h3>
                        <p className="text-sm text-dark-text-secondary">
                            Ajouter un produit à la boutique
                        </p>
                    </div>
                </Link>

                <Link href="/admin/blog/articles/new" className="group">
                    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-cortex-secondary transition-all hover:shadow-glow-gold">
                        <div className="w-12 h-12 rounded-lg bg-cortex-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-cortex-secondary" />
                        </div>
                        <h3 className="text-lg font-heading font-bold text-white mb-2">
                            Nouvel Article
                        </h3>
                        <p className="text-sm text-dark-text-secondary">
                            Rédiger un article pour l'Observatoire
                        </p>
                    </div>
                </Link>

                <Link href="/admin/garden/inventory" className="group">
                    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-cortex-success transition-all">
                        <div className="w-12 h-12 rounded-lg bg-cortex-success/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Leaf className="w-6 h-6 text-cortex-success" />
                        </div>
                        <h3 className="text-lg font-heading font-bold text-white mb-2">
                            Valider Récolte
                        </h3>
                        <p className="text-sm text-dark-text-secondary">
                            Enregistrer une nouvelle récolte
                        </p>
                    </div>
                </Link>
            </div>

            {/* Insights IA */}
            <div className="bg-gradient-to-br from-cortex-primary/10 to-cortex-secondary/10 border border-cortex-primary/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-cortex-secondary" />
                    <h2 className="text-xl font-heading font-bold text-white">
                        Insights IA du Jour
                    </h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-cortex-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <TrendingUp className="w-4 h-4 text-cortex-primary" />
                        </div>
                        <div>
                            <p className="text-white font-medium">
                                Le basilic se vend 30% mieux le samedi
                            </p>
                            <p className="text-sm text-dark-text-secondary">
                                Suggestion : Planifier récoltes pour vendredi matin
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-cortex-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <AlertTriangle className="w-4 h-4 text-cortex-warning" />
                        </div>
                        <div>
                            <p className="text-white font-medium">
                                Risque rupture piment dans 48h
                            </p>
                            <p className="text-sm text-dark-text-secondary">
                                Stock actuel : 2kg | Consommation moyenne : 1kg/jour
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-cortex-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Package className="w-4 h-4 text-cortex-success" />
                        </div>
                        <div>
                            <p className="text-white font-medium">
                                10kg tomates en surplus - Créer promo recommandé
                            </p>
                            <p className="text-sm text-dark-text-secondary">
                                Fraîcheur restante : 5 jours | Promo suggérée : -30%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
