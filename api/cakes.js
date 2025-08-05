// Simple cakes endpoint for Vercel
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return sample cakes data
    const cakes = [
      {
        id: '1',
        name: 'Chocolate Birthday Cake',
        type: 'Birthday',
        weight: 1.5,
        occasion: 'Birthday Party',
        description: 'Rich chocolate cake with vanilla frosting',
        totalCost: 28.50,
        profitMargin: 25,
        sellingPrice: 35.63,
        ingredients: [
          { ingredientId: '1', quantity: 300, cost: 1.35 },
          { ingredientId: '2', quantity: 200, cost: 0.56 },
          { ingredientId: '3', quantity: 150, cost: 2.55 }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Vanilla Wedding Cake',
        type: 'Wedding',
        weight: 3.0,
        occasion: 'Wedding Reception',
        description: 'Three-tier vanilla cake with buttercream',
        totalCost: 45.00,
        profitMargin: 30,
        sellingPrice: 58.50,
        ingredients: [
          { ingredientId: '1', quantity: 600, cost: 2.70 },
          { ingredientId: '2', quantity: 400, cost: 1.12 },
          { ingredientId: '3', quantity: 300, cost: 5.10 }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Red Velvet Cupcakes',
        type: 'Cupcakes',
        weight: 0.8,
        occasion: 'Office Party',
        description: 'Dozen red velvet cupcakes with cream cheese frosting',
        totalCost: 19.50,
        profitMargin: 20,
        sellingPrice: 23.40,
        ingredients: [
          { ingredientId: '1', quantity: 200, cost: 0.90 },
          { ingredientId: '2', quantity: 150, cost: 0.42 },
          { ingredientId: '9', quantity: 100, cost: 0.32 }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return res.status(200).json(cakes);
  }

  return res.status(405).json({ error: 'Method not allowed for now' });
}