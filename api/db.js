import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
  },
  {
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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

// Initialize data files
export const initializeData = () => {
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

// Ingredients functions
export const getIngredients = () => {
  try {
    initializeData();
    const data = fs.readFileSync(INGREDIENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading ingredients:', error);
    return sampleIngredients;
  }
};

export const createIngredient = (ingredientData) => {
  try {
    const ingredients = getIngredients();
    const newIngredient = {
      id: uuidv4(),
      ...ingredientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    ingredients.push(newIngredient);
    fs.writeFileSync(INGREDIENTS_FILE, JSON.stringify(ingredients, null, 2));
    return newIngredient;
  } catch (error) {
    console.error('Error creating ingredient:', error);
    throw error;
  }
};

export const updateIngredient = (id, ingredientData) => {
  try {
    const ingredients = getIngredients();
    const index = ingredients.findIndex(ing => ing.id === id);
    
    if (index === -1) {
      throw new Error('Ingredient not found');
    }
    
    ingredients[index] = {
      ...ingredients[index],
      ...ingredientData,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(INGREDIENTS_FILE, JSON.stringify(ingredients, null, 2));
    return ingredients[index];
  } catch (error) {
    console.error('Error updating ingredient:', error);
    throw error;
  }
};

export const deleteIngredient = (id) => {
  try {
    const ingredients = getIngredients();
    const filteredIngredients = ingredients.filter(ing => ing.id !== id);
    
    if (filteredIngredients.length === ingredients.length) {
      throw new Error('Ingredient not found');
    }
    
    fs.writeFileSync(INGREDIENTS_FILE, JSON.stringify(filteredIngredients, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    throw error;
  }
};

// Cakes functions
export const getCakes = () => {
  try {
    initializeData();
    const data = fs.readFileSync(CAKES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cakes:', error);
    return [];
  }
};

export const createCake = (cakeData) => {
  try {
    const cakes = getCakes();
    const { ingredients, profitMargin, ...otherData } = cakeData;
    
    const totalCost = ingredients.reduce((sum, ing) => sum + ing.cost, 0);
    const sellingPrice = totalCost * (1 + (profitMargin || 0) / 100);
    
    const newCake = {
      id: uuidv4(),
      ...otherData,
      totalCost,
      profitMargin: profitMargin || 0,
      sellingPrice,
      ingredients,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    cakes.push(newCake);
    fs.writeFileSync(CAKES_FILE, JSON.stringify(cakes, null, 2));
    return newCake;
  } catch (error) {
    console.error('Error creating cake:', error);
    throw error;
  }
};

export const deleteCake = (id) => {
  try {
    const cakes = getCakes();
    const filteredCakes = cakes.filter(cake => cake.id !== id);
    
    if (filteredCakes.length === cakes.length) {
      throw new Error('Cake not found');
    }
    
    fs.writeFileSync(CAKES_FILE, JSON.stringify(filteredCakes, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting cake:', error);
    throw error;
  }
};

// Analytics functions
export const getAnalytics = () => {
  try {
    const ingredients = getIngredients();
    const cakes = getCakes();
    
    const totalCakes = cakes.length;
    const totalIngredients = ingredients.length;
    
    // Calculate cake statistics
    const avgCost = totalCakes > 0 ? cakes.reduce((sum, cake) => sum + cake.totalCost, 0) / totalCakes : 0;
    const mostExpensiveCake = totalCakes > 0 ? Math.max(...cakes.map(cake => cake.totalCost)) : 0;
    const cheapestCake = totalCakes > 0 ? Math.min(...cakes.map(cake => cake.totalCost)) : 0;
    const avgProfitMargin = totalCakes > 0 ? cakes.reduce((sum, cake) => sum + cake.profitMargin, 0) / totalCakes : 0;
    const avgCostPerKg = totalCakes > 0 ? cakes.reduce((sum, cake) => sum + (cake.totalCost / cake.weight), 0) / totalCakes : 0;
    const costRange = mostExpensiveCake - cheapestCake;
    
    // Top costly ingredients
    const topCostlyIngredients = ingredients
      .sort((a, b) => b.costPerUnit - a.costPerUnit)
      .slice(0, 5)
      .map(ing => ({
        name: ing.name,
        costPerUnit: ing.costPerUnit,
        unit: ing.unit,
        usageCount: 0 // We'll calculate this if needed
      }));
    
    // Cakes by type
    const cakesByType = {};
    cakes.forEach(cake => {
      if (!cakesByType[cake.type]) {
        cakesByType[cake.type] = { count: 0, totalCost: 0 };
      }
      cakesByType[cake.type].count++;
      cakesByType[cake.type].totalCost += cake.totalCost;
    });
    
    const cakesByTypeArray = Object.entries(cakesByType).map(([type, data]) => ({
      type,
      count: data.count,
      avgCost: data.totalCost / data.count
    })).sort((a, b) => b.count - a.count);
    
    const mostPopularType = cakesByTypeArray.length > 0 ? cakesByTypeArray[0] : null;
    
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
      topCostlyIngredients,
      cakesByType: cakesByTypeArray,
      mostPopularType
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