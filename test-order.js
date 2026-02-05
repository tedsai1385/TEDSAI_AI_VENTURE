// Test script to create a sample order in Firestore
// Run this to verify order synchronization

const testOrder = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        items: [
            { name: 'Poulet DG', price: 3500, quantity: 1 },
            { name: 'Ndolé', price: 2500, quantity: 2 }
        ],
        customerData: {
            name: 'Test Client',
            phone: '+237670000000',
            email: 'test@tedsai.cm',
            notes: 'Commande de test pour vérifier la synchronisation'
        },
        paymentMethod: 'card'
    })
};

console.log('🧪 Test Order Payload:');
console.log(JSON.stringify(testOrder, null, 2));
console.log('\n📡 Send this to: POST http://localhost:3001/api/restaurant/checkout');
console.log('\nOu utilisez cette commande curl:');
console.log(`
curl -X POST http://localhost:3001/api/restaurant/checkout \\
  -H "Content-Type: application/json" \\
  -d '${testOrder.body}'
`);
