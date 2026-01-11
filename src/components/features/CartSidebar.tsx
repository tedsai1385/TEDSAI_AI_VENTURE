import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import styles from './CartSidebar.module.css';
import { loadStripe } from '@stripe/stripe-js';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
    const { cart, updateQuantity, removeItem } = useCart();
    const items = cart.items;
    const total = cart.total;

    const handleCheckout = async () => {
        try {
            const stripe = await stripePromise;
            if (!stripe) throw new Error('Stripe failed to initialize.');

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: cart.items }),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }

            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Une erreur est survenue lors de la redirection vers le paiement.');
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            <i className="fa-solid fa-bag-shopping" style={{ color: '#00B207' }}></i>
                            Mon Panier ({items.length})
                        </h2>
                        <button onClick={onClose} className={styles.closeBtn}>
                            <i className="fa-solid fa-times"></i>
                        </button>
                    </div>

                    {/* Items List */}
                    <div className={styles.itemsList}>
                        {items.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <i className="fa-solid fa-basket-shopping"></i>
                                </div>
                                <p className="text-xl font-medium">Votre panier est vide</p>
                                <button onClick={onClose} className={styles.continueBtn}>
                                    Continuer mes achats
                                </button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.imageContainer}>
                                        <Image
                                            src={item.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800'}
                                            alt={item.name}
                                            fill
                                            className={styles.itemImage}
                                        />
                                    </div>

                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemHeader}>
                                            <h4 className={styles.itemName}>{item.name}</h4>
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className={styles.removeBtn}
                                            >
                                                <i className="fa-solid fa-times-circle text-lg"></i>
                                            </button>
                                        </div>
                                        <p className={styles.itemVariety}>{item.variety}</p>

                                        <div className={styles.itemControls}>
                                            <div className={styles.quantityControl}>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    className={styles.qtyBtn}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className={styles.qtyValue}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className={styles.qtyBtn}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className={styles.itemPrice}>
                                                {(item.price * item.quantity).toLocaleString()} XAF
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className={styles.footer}>
                            <div className={styles.totalRow}>
                                <span>Sous-total:</span>
                                <span>{cart.subtotal.toLocaleString()} XAF</span>
                            </div>
                            <div className={styles.totalRow} style={{ fontSize: '0.9rem', color: '#666' }}>
                                <span>Livraison:</span>
                                <span>{cart.shipping.toLocaleString()} XAF</span>
                            </div>
                            <div className={styles.totalRow} style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                                <span>Total:</span>
                                <span>{total.toLocaleString()} XAF</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className={styles.checkoutBtn}
                            >
                                Passer à la caisse
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
