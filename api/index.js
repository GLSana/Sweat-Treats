const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = '/tmp';
const INGREDIENTS_FILE = path.join(DATA_DIR, 'ingredients.json');
const CAKES_FILE = path.join(DATA_DIR, 'cakes.json');

// Sample data
const sampleIngredients = [
  {
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
    name: 'Vanilla Extract',
    unit: 'ml',
    costPerUnit: 15,
    packageSize: 1,
    notes: 'Pure vanilla extract',
    category: 'Flavorings',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Database functions
const initializeData = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(INGREDIENTS_FILE)) {
      fs.writeFileSync(INGREDIENTS_FILE, JSON.stringify(sampleIngredients, null, 2));
    }
    
    if (!fs.existsSync(CAKES_FILE)) {
      fs.writeFileSync(CAKES_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

const getIngredients = () => {
  try {
    initializeData();
    const data = fs.readFileSync(INGREDIENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading ingredients:', error);
    return sampleIngredients;
  }
};

const getCakes = () => {
  try {
    initializeData();
    const data = fs.readFileSync(CAKES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cakes:', error);
    return [];
  }
};

const getAnalytics = () => {
  try {
    const ingredients = getIngredients();
    const cakes = getCakes();
    
    const totalCakes = cakes.length;
    const totalIngredients = ingredients.length;
    
    // Calculate cake statistics
    const avgCost = totalCakes > 0 ? cakes.reduce((sum, cake) => sum + (cake.totalCost || 0), 0) / totalCakes : 0;
    const mostExpensiveCake = totalCakes > 0 ? Math.max(...cakes.map(cake => cake.totalCost || 0)) : 0;
    const cheapestCake = totalCakes > 0 ? Math.min(...cakes.map(cake => cake.totalCost || 0)) : 0;
    const avgProfitMargin = totalCakes > 0 ? cakes.reduce((sum, cake) => sum + (cake.profitMargin || 0), 0) / totalCakes : 0;
    const avgCostPerKg = totalCakes > 0 ? cakes.reduce((sum, cake) => sum + ((cake.totalCost || 0) / (cake.weight || 1)), 0) / totalCakes : 0;
    const costRange = mostExpensiveCake - cheapestCake;
    
    return {
      summary: {
        totalCakes,
        totalIngredients,
        avgCost: Math.round(avgCost * 100) / 100,
        costRange: Math.round(costRange * 100) / 100,
        avgProfitMargin: Math.round(avgProfitMargin * 100) / 100,
        avgCostPerKg: Math.round(avgCostPerKg * 100) / 100,
        mostExpensiveCake: Math.round(mostExpensiveCake * 100) / 100,
        cheapestCake: Math.round(cheapestCake * 100) / 100
      },
      topCostlyIngredients: ingredients.slice(0, 5),
      cakesByType: [],
      mostPopularType: null
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return {
      summary: {
        totalCakes: 0,
        totalIngredients: 0,
        avgCost: 0,
        costRange: 0,
        avgProfitMargin: 0,
        avgCostPerKg: 0,
        mostExpensiveCake: 0,
        cheapestCake: 0
      },
      topCostlyIngredients: [],
      cakesByType: [],
      mostPopularType: null
    };
  }
};

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  
  try {
    // Route handling
    if (url === '/api' || url === '/api/') {
      return res.json({ message: 'Sweet Treats API is working!', timestamp: new Date().toISOString() });
    }
    
    if (url === '/api/analytics' || url.startsWith('/api/analytics')) {
      if (method === 'GET') {
        const analytics = getAnalytics();
        return res.json(analytics);
      }
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    if (url === '/api/ingredients' || url.startsWith('/api/ingredients')) {
      if (method === 'GET') {
        const ingredients = getIngredients();
        return res.json(ingredients);
      }
      return res.status(405).json({ error: 'Method not allowed for now' });
    }
    
    if (url === '/api/cakes' || url.startsWith('/api/cakes')) {
      if (method === 'GET') {
        const cakes = getCakes();
        return res.json(cakes);
      }
      return res.status(405).json({ error: 'Method not allowed for now' });
    }
    
    // Default response
    return res.status(404).json({ error: 'API endpoint not found', url, method });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};