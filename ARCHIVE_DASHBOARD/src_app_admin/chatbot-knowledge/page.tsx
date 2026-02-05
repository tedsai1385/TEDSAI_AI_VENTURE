'use client'

import { useState, useEffect } from 'react';
import { adminDb } from '@/lib/firebase/admin';

interface KnowledgeEntry {
    id: string;
    question: string;
    answer: string;
    category: 'ia' | 'restaurant' | 'garden' | 'elevage' | 'epicerie' | 'general';
    keywords: string[];
    priority: 'high' | 'normal' | 'low';
    active: boolean;
    createdAt: any;
    updatedAt: any;
}

export default function ChatbotKnowledgePage() {
    const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<KnowledgeEntry>>({
        question: '',
        answer: '',
        category: 'general',
        keywords: [],
        priority: 'normal',
        active: true
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    useEffect(() => {
        loadKnowledge();
    }, []);

    const loadKnowledge = async () => {
        setLoading(true);
        try {
            // Note: En production, utilisez une API route pour accéder à adminDb côté serveur
            // Pour ce POC, on simule avec un appel API
            const response = await fetch('/api/chatbot/knowledge');
            const data = await response.json();
            setKnowledge(data);
        } catch (error) {
            console.error('Error loading knowledge:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId ? `/api/chatbot/knowledge/${editingId}` : '/api/chatbot/knowledge';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                loadKnowledge();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving knowledge:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) return;

        try {
            await fetch(`/api/chatbot/knowledge/${id}`, { method: 'DELETE' });
            loadKnowledge();
        } catch (error) {
            console.error('Error deleting knowledge:', error);
        }
    };

    const handleEdit = (entry: KnowledgeEntry) => {
        setEditingId(entry.id);
        setFormData(entry);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            question: '',
            answer: '',
            category: 'general',
            keywords: [],
            priority: 'normal',
            active: true
        });
    };

    const filteredKnowledge = knowledge.filter(entry => {
        const matchesSearch = entry.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">🤖 Gestion Base de Connaissances Chatbot</h1>
                <p className="text-gray-600">Ajoutez et gérez les connaissances du chatbot TED</p>
            </div>

            {/* Formulaire d'ajout/modification */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? '✏️ Modifier une connaissance' : '➕ Ajouter une connaissance'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Question</label>
                            <input
                                type="text"
                                required
                                className="w-full border rounded px-3 py-2"
                                placeholder="Ex: Comment réserver chez viTEDia ?"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Catégorie</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                            >
                                <option value="general">Général</option>
                                <option value="ia">Intelligence Artificielle</option>
                                <option value="restaurant">Restaurant viTEDia</option>
                                <option value="garden">garden SelecTED</option>
                                <option value="elevage">Élevage</option>
                                <option value="epicerie">Épicerie</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Réponse</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Réponse complète à la question..."
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Mots-clés (séparés par virgule)</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="réservation, booking, table"
                                value={formData.keywords?.join(', ')}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value.split(',').map(k => k.trim()) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Priorité</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                            >
                                <option value="low">Basse</option>
                                <option value="normal">Normale</option>
                                <option value="high">Haute</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                />
                                <span className="text-sm">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            {editingId ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                            >
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="🔍 Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="all">Toutes les catégories</option>
                            <option value="ia">IA</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="garden">garden</option>
                            <option value="elevage">Élevage</option>
                            <option value="epicerie">Épicerie</option>
                            <option value="general">Général</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Liste des connaissances */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center py-8">Chargement...</p>
                ) : filteredKnowledge.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">Aucune connaissance trouvée</p>
                ) : (
                    filteredKnowledge.map((entry) => (
                        <div key={entry.id} className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-1 text-xs rounded ${entry.category === 'ia' ? 'bg-blue-100 text-blue-800' :
                                                entry.category === 'restaurant' ? 'bg-red-100 text-red-800' :
                                                    entry.category === 'garden' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {entry.category}
                                        </span>
                                        <span className={`px-2 py-1 text-xs rounded ${entry.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                entry.priority === 'low' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-blue-50 text-blue-600'
                                            }`}>
                                            {entry.priority}
                                        </span>
                                        {!entry.active && (
                                            <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-600">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-lg">Q: {entry.question}</h3>
                                    <p className="text-gray-700 mt-1">R: {entry.answer}</p>
                                    {entry.keywords && entry.keywords.length > 0 && (
                                        <div className="mt-2 flex gap-1 flex-wrap">
                                            {entry.keywords.map((keyword, i) => (
                                                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(entry)}
                                        className="text-blue-600 hover:text-blue-800 p-2"
                                        title="Modifier"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="text-red-600 hover:text-red-800 p-2"
                                        title="Supprimer"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Stats */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">📊 Statistiques</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="ml-2 font-semibold">{knowledge.length}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Actives:</span>
                        <span className="ml-2 font-semibold">{knowledge.filter(k => k.active).length}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Priorité haute:</span>
                        <span className="ml-2 font-semibold">{knowledge.filter(k => k.priority === 'high').length}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Affichées:</span>
                        <span className="ml-2 font-semibold">{filteredKnowledge.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
