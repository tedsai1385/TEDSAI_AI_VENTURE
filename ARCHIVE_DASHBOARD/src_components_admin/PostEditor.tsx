'use client';

import React, { useState } from 'react';
import { db, storage } from '@/lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface PostEditorProps {
    onClose: () => void;
    onSuccess: () => void;
    defaultStatus?: 'published' | 'pending';
}

export default function PostEditor({ onClose, onSuccess, defaultStatus = 'published' }: PostEditorProps) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('IA');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('Ted Admin');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // Categories mapping
    const categories = ['IA', 'Économie', 'Gastronomie', 'Agro-Tech', 'Actualité'];

    // Simple Rich Text Command Wrapper
    const execCmd = (command: string, value: any = null) => {
        document.execCommand(command, false, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Get content from editable div
        const contentHtml = document.getElementById('editor-content')?.innerHTML || '';

        try {
            let imageUrl = '';
            if (coverImage) {
                const storageRef = ref(storage, `blog/${Date.now()}_${coverImage.name}`);
                await uploadBytes(storageRef, coverImage);
                imageUrl = await getDownloadURL(storageRef);
            }

            await addDoc(collection(db, 'observatoire_posts'), {
                title,
                category,
                excerpt: summary,
                content: contentHtml,
                author,
                image: imageUrl || 'https://via.placeholder.com/800x400',
                createdAt: new Date().toISOString(),
                likes: 0,
                status: defaultStatus
            });

            onSuccess();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Erreur lors de la publication');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-[2000] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-50">
                <h2 className="text-xl font-bold text-gray-800">Rédiger un Article</h2>
                <div className="flex gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Fermer</button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Publication...' : 'Publier'}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-8 space-y-8">
                {/* Meta Data */}
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Titre de l'article"
                        className="w-full text-4xl font-bold border-none outline-none placeholder-gray-300"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        autoFocus
                    />
                    <div className="flex gap-4">
                        <select
                            className="p-2 border rounded-lg bg-gray-50"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Auteur"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            className="p-2 border rounded-lg flex-1"
                        />
                    </div>
                    <textarea
                        className="w-full p-4 border rounded-lg bg-gray-50 text-sm"
                        placeholder="Court résumé pour la carte (excerte)..."
                        rows={2}
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                    />
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <label className="block text-sm font-medium mb-2 text-gray-600">Image de couverture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setCoverImage(e.target.files?.[0] || null)}
                        />
                    </div>
                </div>

                {/* Editor */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm min-h-[500px] flex flex-col">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2 flex-wrap sticky top-0">
                        <ToolButton icon="fa-bold" onClick={() => execCmd('bold')} />
                        <ToolButton icon="fa-italic" onClick={() => execCmd('italic')} />
                        <ToolButton icon="fa-underline" onClick={() => execCmd('underline')} />
                        <div className="w-px bg-gray-300 mx-2"></div>
                        <ToolButton icon="fa-list-ul" onClick={() => execCmd('insertUnorderedList')} />
                        <ToolButton icon="fa-list-ol" onClick={() => execCmd('insertOrderedList')} />
                        <div className="w-px bg-gray-300 mx-2"></div>
                        <ToolButton icon="fa-h1" onClick={() => execCmd('formatBlock', 'H2')} label="H2" />
                        <ToolButton icon="fa-paragraph" onClick={() => execCmd('formatBlock', 'P')} label="P" />
                        <div className="w-px bg-gray-300 mx-2"></div>
                        <ToolButton icon="fa-link" onClick={() => {
                            const url = prompt('URL:');
                            if (url) execCmd('createLink', url);
                        }} />
                    </div>

                    {/* Content Area */}
                    <div
                        id="editor-content"
                        contentEditable
                        className="flex-1 p-8 outline-none prose max-w-none"
                    >
                        <p>Commencez à rédiger votre article ici...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ToolButton = ({ icon, onClick, label }: any) => (
    <button
        type="button"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className="p-2 text-gray-600 hover:bg-gray-200 rounded flex items-center justify-center min-w-[32px]"
        title={label || icon}
    >
        {label ? <span className="font-bold text-sm">{label}</span> : <i className={`fa-solid ${icon}`}></i>}
    </button>
);
