'use client';

import React, { useState, useEffect } from 'react';
import './observatoire.css';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import PostEditor from '@/components/admin/PostEditor';

const Observatoire = () => {
    const [filter, setFilter] = useState('all');
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitOpen, setIsSubmitOpen] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, 'observatoire_posts'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const fetchedPosts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Fallback Mock Data if empty (to not leave page blank initially)
                if (fetchedPosts.length === 0) {
                    setPosts([
                        {
                            id: 'mock-1',
                            category: 'IA',
                            title: "L'IA au secours de l'agriculture camerounaise",
                            excerpt: "Comment les algorithmes prédictifs transforment la gestion des récoltes...",
                            author: "Dr. Hamadou",
                            createdAt: new Date().toISOString(),
                            likes: 42,
                            comments: 5,
                            image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        },
                        {
                            id: 'mock-2',
                            category: 'Économie',
                            title: "Impact du digital sur le PIB du Cameroun",
                            excerpt: "Analyse des secteurs porteurs et des freins à l'innovation technologique...",
                            author: "Tedsai Research",
                            createdAt: new Date().toISOString(),
                            likes: 128,
                            comments: 12,
                            image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }
                    ]);
                } else {
                    setPosts(fetchedPosts);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.category === filter);

    const categories = ['all', 'IA', 'Économie', 'Gastronomie', 'Agro-Tech'];

    const handleLike = (id: string) => {
        // Optimistic UI update
        // In real app, write to Firestore
        setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
    };

    return (
        <div style={{ paddingBottom: '100px' }}>
            {/* Hero */}
            <section className="obs-hero-v2">
                <div className="hero-container container">
                    <div className="hero-text">
                        <h1>Nos Analyses & Insights</h1>
                        <p>Découvrez les tendances deep-tech, agro-pastorales et économiques qui façonnent l'Afrique de demain. Données réelles, impact concret.</p>
                    </div>
                    <div className="hero-image" style={{ display: 'block' }}>
                        <img src="https://img.freepik.com/free-vector/blogging-concept-illustration_114360-1038.jpg?w=800" alt="Analyses" style={{ maxWidth: '400px', borderRadius: '20px' }} />
                    </div>
                </div>
            </section>

            {/* Category Nav */}
            <div className="category-nav">
                <div className="pills-container container">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`pill ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat === 'all' ? 'Tous' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Chargement des analyses...</div>
                ) : (
                    <div className="obs-grid">
                        {filteredPosts.map(post => (
                            <Link href={`/observatoire/${post.id}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="obs-card">
                                    <div className="card-img">
                                        <img src={post.image || 'https://via.placeholder.com/400'} alt={post.title} />
                                        <span className="category-badge">{post.category}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="card-meta">Par {post.author} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</div>
                                        <h3 className="card-title">{post.title}</h3>
                                        <p className="card-excerpt">{post.excerpt || (post.content ? post.content.substring(0, 100) + '...' : '')}</p>
                                    </div>
                                    <div className="card-social">
                                        <button className="social-btn" onClick={(e) => { e.preventDefault(); handleLike(post.id); }}>
                                            <i className="fa-solid fa-heart"></i> {post.likes || 0}
                                        </button>
                                        <button className="social-btn">
                                            <i className="fa-solid fa-comment"></i> {post.comments || 0}
                                        </button>
                                        <button className="social-btn">
                                            <i className="fa-solid fa-share-nodes"></i>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            {/* FAB for Public Submission */}
            <button
                className="fab-submit"
                onClick={() => setIsSubmitOpen(true)}
                title="Proposer un article"
                style={{
                    position: 'fixed',
                    bottom: '100px', // Adjusted to be above mobile nav
                    right: '2rem',
                    background: '#0A2463', // obs-primary
                    color: 'white',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(10, 36, 99, 0.4)',
                    cursor: 'pointer',
                    zIndex: 100,
                    border: 'none',
                    fontSize: '1.5rem'
                }}
            >
                <i className="fa-solid fa-plus"></i>
            </button>

            {/* Submission Modal */}
            {isSubmitOpen && (
                <PostEditor
                    onClose={() => setIsSubmitOpen(false)}
                    onSuccess={() => {
                        setIsSubmitOpen(false);
                        alert("Votre article a été soumis pour modération. Merci !");
                    }}
                    defaultStatus="pending"
                />
            )}
        </div>
    );
};

export default Observatoire;
