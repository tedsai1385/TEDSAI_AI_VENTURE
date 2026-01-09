'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';

export default function BlogPostPage() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'observatoire_posts', id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                } else {
                    alert('Article non trouvé');
                    router.push('/observatoire');
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
    );

    if (!post) return null;

    return (
        <article className="min-h-screen bg-white pt-24 pb-20">
            {/* Hero Header */}
            <div className="relative h-[400px] w-full bg-gray-900 overflow-hidden mb-12">
                <img
                    src={post.image || 'https://via.placeholder.com/1200x500'}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-4xl w-full text-center text-white">
                        <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            {post.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
                            <span><i className="fa-solid fa-user mr-2"></i>{post.author}</span>
                            <span>•</span>
                            <span><i className="fa-solid fa-calendar mr-2"></i>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6">
                <div
                    className="prose prose-lg prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Navigation Footer */}
                <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between">
                    <Link href="/observatoire" className="flex items-center text-gray-600 hover:text-blue-900 font-medium transition-colors">
                        <i className="fa-solid fa-arrow-left mr-3"></i> Retour à les articles
                    </Link>
                </div>
            </div>
        </article>
    );
}
