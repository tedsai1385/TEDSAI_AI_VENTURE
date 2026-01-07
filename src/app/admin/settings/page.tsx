'use client';
import React from 'react';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Paramètres Globaux</h1>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <div className="font-medium text-gray-900">Mode Maintenance</div>
                        <div className="text-sm text-gray-500">Désactiver l'accès public au site</div>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300" />
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                </div>
                <div className="p-6">
                    <button className="text-red-600 font-medium hover:text-red-700">Supprimer le cache du site</button>
                </div>
            </div>
        </div>
    );
}
