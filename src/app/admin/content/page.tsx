'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Image as ImageIcon,
    Plus,
    Edit,
    Trash2,
    Eye,
    MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ContentAdmin() {
    const [posts] = useState([
        { id: 1, title: 'L\'IA dans l\'agriculture', status: 'published', views: 1240, comments: 12, date: '15 Jan 2026' },
        { id: 2, title: 'Recette : Poulet DG', status: 'published', views: 850, comments: 8, date: '12 Jan 2026' },
        { id: 3, title: 'Nouveaux horaires', status: 'draft', views: 0, comments: 0, date: '10 Jan 2026' },
        { id: 4, title: 'Interview Dr. TED', status: 'scheduled', views: 0, comments: 0, date: '20 Jan 2026' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contenu & Blog</h1>
                    <p className="text-gray-500 text-sm">Gérez les articles, pages et médias du site.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-gray-900 hover:bg-black text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvel Article
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Posts List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Articles</h3>
                            <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">Total: {posts.length}</span>
                        </div>
                        <div>
                            {posts.map((post, i) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span>{post.date}</span>
                                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                                                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.comments}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={
                                            post.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                                                post.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-gray-50 text-gray-700 border-gray-200'
                                        }>
                                            {post.status === 'published' ? 'Publié' : post.status === 'scheduled' ? 'Planifié' : 'Brouillon'}
                                        </Badge>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600"><Edit className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Media Library Widget */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Médiathèque</h3>
                        <Button variant="ghost" size="sm" className="text-xs h-7">Voir tout</Button>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden group cursor-pointer">
                                <Image
                                    src="/assets/images/placeholder_dish.webp"
                                    alt="Media"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform"
                                />
                            </div>
                        ))}
                        <div className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors">
                            <Plus className="w-6 h-6 mb-1" />
                            <span className="text-xs">Upload</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
