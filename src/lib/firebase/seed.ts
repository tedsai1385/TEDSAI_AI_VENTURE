import { db } from './config';
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';

const initialProducts = [
    {
        name: "Basilic Genovese",
        description: "Le roi des pestos. Feuilles larges, arôme puissant, récolté à 06h30.",
        price: "4 500 FCFA / kg",
        tag: "Aromate",
        inStock: true,
        quantity: 5,
        unit: "kg",
        image: "/images/products/basilic.jpg"
    },
    {
        name: "Laitue Romaine",
        description: "Croquante, sucrée, récoltée ce matin. Zéro pesticide.",
        price: "2 500 FCFA / kg",
        tag: "Hydro",
        inStock: true,
        quantity: 12,
        unit: "kg",
        image: "/images/products/laitue.jpg"
    },
    {
        name: "Tomates Cerises",
        description: "Explosion de sucre. Récoltées chaque matin dans notre SelecTED Garden.",
        price: "5 000 FCFA / kg",
        tag: "Saison",
        inStock: true,
        quantity: 8,
        unit: "kg",
        image: "/images/products/tomates.jpg"
    },
    {
        name: "Tilapia (500g)",
        description: "Pêché à la demande. Garanti sans antibiotiques.",
        price: "2 800 FCFA / pièce",
        tag: "Aquaponie",
        inStock: true,
        quantity: 20,
        unit: "pièce",
        image: "/images/products/tilapia.jpg"
    }
];

export const seedProducts = async () => {
    try {
        const q = query(collection(db, 'garden_products'), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("Seeding initial products...");
            for (const product of initialProducts) {
                await addDoc(collection(db, 'garden_products'), {
                    ...product,
                    createdAt: serverTimestamp()
                });
            }
            console.log("Seeding complete!");
        } else {
            console.log("Database already has products, skipping seed.");
        }
    } catch (error) {
        console.error("Error seeding products:", error);
    }
};
