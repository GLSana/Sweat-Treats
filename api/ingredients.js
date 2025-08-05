// Simple ingredients endpoint for Vercel
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return sample ingredients data
    const ingredients = [
      {
        id: '1',
        name: 'All Purpose Flour',
        unit: 'g',
        costPerUnit: 450,
        packageSize: 1000,
        notes: 'Premium quality flour',
        category: 'Dry Ingredients',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Caster Sugar',
        unit: 'g',
        costPerUnit: 280,
        packageSize: 1000,
        notes: 'Fine white sugar',
        category: 'Sweeteners',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Butter',
        unit: 'g',
        costPerUnit: 850,
        packageSize: 500,
        notes: 'Unsalted butter',
        category: 'Dairy',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Eggs',
        unit: 'pcs',
        costPerUnit: 35,
        packageSize: 1,
        notes: 'Large fresh eggs',
        category: 'Dairy',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Vanilla Extract',
        unit: 'ml',
        costPerUnit: 15,
        packageSize: 1,
        notes: 'Pure vanilla extract',
        category: 'Flavorings',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Baking Powder',
        unit: 'g',
        costPerUnit: 8,
        packageSize: 1,
        notes: 'Double acting',
        category: 'Leavening',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '7',
        name: 'Cocoa Powder',
        unit: 'g',
        costPerUnit: 12,
        packageSize: 1,
        notes: 'Unsweetened cocoa',
        category: 'Dry Ingredients',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '8',
        name: 'Heavy Cream',
        unit: 'ml',
        costPerUnit: 2.5,
        packageSize: 1,
        notes: 'Fresh dairy cream',
        category: 'Dairy',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '9',
        name: 'Cream Cheese',
        unit: 'g',
        costPerUnit: 3.2,
        packageSize: 1,
        notes: 'Philadelphia cream cheese',
        category: 'Dairy',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '10',
        name: 'Powdered Sugar',
        unit: 'g',
        costPerUnit: 0.65,
        packageSize: 1,
        notes: 'Confectioner\'s sugar',
        category: 'Sweeteners',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return res.status(200).json(ingredients);
  }

  return res.status(405).json({ error: 'Method not allowed for now' });
}