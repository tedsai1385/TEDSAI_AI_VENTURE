'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { DishProps } from './DishCard';

interface DishCustomizationModalProps {
    dish: DishProps;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (quantity: number, options: any) => void;
}

export default function DishCustomizationModal({ dish, isOpen, onClose, onConfirm }: DishCustomizationModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [cooking, setCooking] = useState('a-point');
    const [sides, setSides] = useState<string[]>([]);
    const [instructions, setInstructions] = useState('');

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleSideToggle = (side: string) => {
        setSides(prev =>
            prev.includes(side)
                ? prev.filter(s => s !== side)
                : [...prev, side]
        );
    };

    const handleConfirm = () => {
        onConfirm(quantity, {
            cooking,
            sides,
            instructions
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-serif font-bold text-amber-900">Personnalisez votre plat</DialogTitle>
                    <DialogDescription>
                        {dish.name} - {formatCurrency(dish.price)}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Cooking Level - Only for Meat/Fish */}
                    {['Signature', 'Grillades'].includes(dish.category) && (
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Cuisson</Label>
                            <RadioGroup value={cooking} onValueChange={setCooking} className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="saignant" id="saignant" />
                                    <Label htmlFor="saignant">Saignant</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="a-point" id="a-point" />
                                    <Label htmlFor="a-point">À point</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bien-cuit" id="bien-cuit" />
                                    <Label htmlFor="bien-cuit">Bien cuit</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    {/* Sides */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Accompagnements (Inclus)</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Frites Maison', 'Riz Parfumé', 'Plantains Frits', 'Légumes Sautés', 'Miondo', 'Bâton de Manioc'].map((side) => (
                                <div key={side} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-amber-50 cursor-pointer" onClick={() => handleSideToggle(side)}>
                                    <Checkbox id={side} checked={sides.includes(side)} onCheckedChange={() => handleSideToggle(side)} />
                                    <Label htmlFor={side} className="cursor-pointer text-sm">{side}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="space-y-3">
                        <Label htmlFor="instructions" className="text-base font-semibold">Instructions Spéciales</Label>
                        <Textarea
                            id="instructions"
                            placeholder="Sans sel, sauce à part, allergies..."
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="resize-none"
                        />
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                        <span className="font-semibold text-gray-700">Quantité</span>
                        <div className="flex items-center gap-4">
                            <Button size="sm" variant="outline" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => handleQuantityChange(1)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between items-center border-t pt-4">
                    <div className="text-lg font-bold text-amber-800">
                        Total: {formatCurrency(dish.price * quantity)}
                    </div>
                    <Button onClick={handleConfirm} className="bg-amber-600 hover:bg-amber-700 text-white gap-2 rounded-full px-6">
                        Ajouter au Panier <ShoppingCart className="w-4 h-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
