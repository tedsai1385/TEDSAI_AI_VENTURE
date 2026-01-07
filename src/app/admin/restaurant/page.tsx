'use client';
import React from 'react';

export default function AdminRestaurantPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Restaurant viTEDia</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    + Nouveau Plat
                </button>
            </div>
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm">
                <i className="fa-solid fa-utensils text-4xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900">Module Restaurant</h3>
                <p className="text-gray-500 mt-2">Gestion du menu, des commandes et des réservations.</p>
            </div>
        </div>
    );
}
