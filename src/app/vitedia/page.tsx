'use client';

import React, { useState } from 'react';
import { VitediaHero } from '@/components/vitedia/VitediaHero';
import { PourquoiVitedia } from '@/components/vitedia/PourquoiVitedia';
import MenuDuJour from '@/components/vitedia/MenuDuJour';
import { TracabiliteAction } from '@/components/vitedia/TracabiliteAction';
import { ReservationForm } from '@/components/vitedia/ReservationForm';
import { OrderCheckoutForm } from '@/components/vitedia/OrderCheckoutForm';
import { CommandeLivraison } from '@/components/vitedia/CommandeLivraison';
import { TestimonialsCarousel } from '@/components/vitedia/TestimonialsCarousel';
import { VitediaGallery } from '@/components/vitedia/VitediaGallery';
import { Container } from '@/components/ui/Container';

import { useCart } from '@/context/CartContext';

export default function VitediaPage() {
    const { cart, clearCart } = useCart();

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <VitediaHero />

            <PourquoiVitedia />

            <MenuDuJour />

            <div id="booking-section" className="py-20 bg-neutral-50 scroll-mt-20">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Gauche : Réservation */}
                        <div className="space-y-6">
                            <ReservationForm isInline />
                        </div>

                        {/* Droite : Commande */}
                        <div id="order-form" className="space-y-6">
                            <OrderCheckoutForm
                                cart={cart.items}
                                total={cart.total}
                                onClear={clearCart}
                            />
                        </div>
                    </div>
                </Container>
            </div>

            <TracabiliteAction />
            <CommandeLivraison />
            <VitediaGallery />
            <TestimonialsCarousel />
        </main>
    );
}
