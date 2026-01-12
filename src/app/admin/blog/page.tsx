'use client';

import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import PageHeader from '@/components/dashboard/PageHeader';
import { Newspaper, CheckCircle, XCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    author: string;
    status: 'draft' | 'pending' | 'published' | 'rejected';
    createdAt: any;
    category?: string;
}

export default function AdminBlogPage() {
    const [mounted, setMounted] = useState(false);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('pending');

    useEffect(() => {
        setMounted(true);
        const q = filter === 'all'
            ? query(collection(db, 'observatoire_posts'))
            : query(collection(db, 'observatoire_posts'), where('status', '==', filter));

        const unsub = onSnapshot(q, (snap) => {
            const postsList = snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
            setPosts(postsList.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
        });

        return () => unsub();
    }, [filter]);

    const handlePublish = async (id: string) => {
        try {
            await updateDoc(doc(db, 'observatoire_posts', id), {
                status: 'published',
                publishedAt: new Date()
            });
            alert('✅ Article publié !');
        } catch (error) {
            console.error('Error publishing post:', error);
            alert('❌ Erreur lors de la publication');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Raison du rejet (optionnel):');
        try {
            await updateDoc(doc(db, 'observatoire_posts', id), {
                status: 'rejected',
                rejectionReason: reason || 'Non spécifié'
            });
            alert('✅ Article rejeté');
        } catch (error) {
            console.error('Error rejecting post:', error);
            alert('❌ Erreur');
        }
    };

    if (!mounted) return null;

    return (
        <AdminGuard>
            <PageHeader
                title="Gestion Blog / Observatoire"
                subtitle="Validez ou rejetez les articles avant publication."
                icon={Newspaper}
            />

            {/* Filters */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === 'pending'
                            ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                >
                    En attente ({posts.filter(p => p.status === 'pending').length})
                </button>
                <button
                    onClick={() => setFilter('published')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === 'published'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                >
                    Publiés
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === 'all'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                >
                    Tous
                </button>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
                {posts.map((post, idx) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <span>Par {post.author || 'Anonyme'}</span>
                                    <span>•</span>
                                    <span>{post.createdAt?.toDate?.().toLocaleDateString() || 'Date inconnue'}</span>
                                    {post.category && (
                                        <>
                                            <span>•</span>
                                            <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
                                                {post.category}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {post.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handlePublish(post.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all"
                                        >
                                            <CheckCircle size={16} />
                                            Publier
                                        </button>
                                        <button
                                            onClick={() => handleReject(post.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-all"
                                        >
                                            <XCircle size={16} />
                                            Rejeter
                                        </button>
                                    </>
                                )}
                                {post.status === 'published' && (
                                    <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                                        ✓ Publié
                                    </span>
                                )}
                                {post.status === 'rejected' && (
                                    <span className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                                        ✗ Rejeté
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-slate-300 line-clamp-3">{post.content?.substring(0, 200)}...</p>
                    </motion.div>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-16">
                    <Newspaper className="mx-auto text-slate-600 mb-4" size={64} />
                    <p className="text-slate-400">Aucun article à afficher</p>
                </div>
            )}
        </AdminGuard>
    );
}
