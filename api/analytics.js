// Simple analytics endpoint for Vercel
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return sample analytics data
    const analytics = {
      summary: {
        totalCakes: 3,
        totalIngredients: 10,
        avgCost: 25.50,
        costRange: 15.75,
        avgProfitMargin: 25,
        avgCostPerKg: 12.25,
        mostExpensiveCake: 35.25,
        cheapestCake: 19.50
      },
      topCostlyIngredients: [
        { name: 'Butter', costPerUnit: 850, unit: 'g', usageCount: 0 },
        { name: 'All Purpose Flour', costPerUnit: 450, unit: 'g', usageCount: 0 },
        { name: 'Caster Sugar', costPerUnit: 280, unit: 'g', usageCount: 0 }
      ],
      cakesByType: [
        { type: 'Birthday', count: 2, avgCost: 28.50 },
        { type: 'Wedding', count: 1, avgCost: 45.00 }
      ],
      mostPopularType: { type: 'Birthday', count: 2, avgCost: 28.50 }
    };

    return res.status(200).json(analytics);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}