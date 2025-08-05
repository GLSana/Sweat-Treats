import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Database setup with better configuration
const dbPath = path.join(__dirname, 'cake_business.db');
const db = new Database(dbPath, { 
  verbose: console.log,
  fileMustExist: false 
});

// Enable foreign keys and better performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = 10000');
db.pragma('temp_store = MEMORY');

// Initialize database tables with better structure
db.exec(`
  CREATE TABLE IF NOT EXISTS ingredients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    unit TEXT NOT NULL,
    costPerUnit REAL NOT NULL CHECK (costPerUnit > 0),
    packageSize REAL NOT NULL CHECK (packageSize > 0),
    notes TEXT,
    category TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cakes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    weight REAL NOT NULL CHECK (weight > 0),
    occasion TEXT,
    description TEXT,
    totalCost REAL DEFAULT 0 CHECK (totalCost >= 0),
    profitMargin REAL DEFAULT 0 CHECK (profitMargin >= 0),
    sellingPrice REAL DEFAULT 0 CHECK (sellingPrice >= 0),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cake_ingredients (
    id TEXT PRIMARY KEY,
    cakeId TEXT NOT NULL,
    ingredientId TEXT NOT NULL,
    quantity REAL NOT NULL CHECK (quantity > 0),
    cost REAL NOT NULL CHECK (cost >= 0),
    FOREIGN KEY (cakeId) REFERENCES cakes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredientId) REFERENCES ingredients(id) ON DELETE CASCADE
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);
  CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
  CREATE INDEX IF NOT EXISTS idx_cakes_type ON cakes(type);
  CREATE INDEX IF NOT EXISTS idx_cakes_created_at ON cakes(createdAt);
  CREATE INDEX IF NOT EXISTS idx_cake_ingredients_cake_id ON cake_ingredients(cakeId);
  CREATE INDEX IF NOT EXISTS idx_cake_ingredients_ingredient_id ON cake_ingredients(ingredientId);
`);

// Seed data with better error handling
const seedData = () => {
  try {
    const ingredientCount = db.prepare("SELECT COUNT(*) as count FROM ingredients").get();
    
    if (ingredientCount.count === 0) {
      const insertIngredient = db.prepare(`
        INSERT INTO ingredients (id, name, unit, costPerUnit, packageSize, notes, category)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const ingredients = [
        [uuidv4(), 'All Purpose Flour', 'g', 450, 1000, 'Premium quality flour', 'Dry Ingredients'],
        [uuidv4(), 'Caster Sugar', 'g', 280, 1000, 'Fine white sugar', 'Sweeteners'],
        [uuidv4(), 'Butter', 'g', 850, 500, 'Unsalted butter', 'Dairy'],
        [uuidv4(), 'Eggs', 'pcs', 35, 1, 'Large fresh eggs', 'Dairy'],
        [uuidv4(), 'Vanilla Extract', 'ml', 15, 1, 'Pure vanilla extract', 'Flavorings'],
        [uuidv4(), 'Baking Powder', 'g', 8, 1, 'Double acting', 'Leavening'],
        [uuidv4(), 'Cocoa Powder', 'g', 12, 1, 'Unsweetened cocoa', 'Dry Ingredients'],
        [uuidv4(), 'Heavy Cream', 'ml', 2.5, 1, 'Fresh dairy cream', 'Dairy'],
        [uuidv4(), 'Cream Cheese', 'g', 3.2, 1, 'Philadelphia cream cheese', 'Dairy'],
        [uuidv4(), 'Powdered Sugar', 'g', 0.65, 1, 'Confectioner\'s sugar', 'Sweeteners']
      ];

      const transaction = db.transaction(() => {
        ingredients.forEach(ingredient => {
          insertIngredient.run(...ingredient);
        });
      });

      transaction();
      console.log('Database seeded with sample ingredients');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedData();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, 'dist')));

// Ingredients endpoints
app.get('/api/ingredients', (req, res) => {
  try {
    const ingredients = db.prepare('SELECT * FROM ingredients ORDER BY name').all();
    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

app.post('/api/ingredients', (req, res) => {
  try {
    const { name, unit, costPerUnit, packageSize, notes, category } = req.body;
    
    // Validation
    if (!name || !unit || !costPerUnit || !packageSize) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (costPerUnit <= 0 || packageSize <= 0) {
      return res.status(400).json({ error: 'Cost and package size must be positive' });
    }
    
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO ingredients (id, name, unit, costPerUnit, packageSize, notes, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, name.trim(), unit, costPerUnit, packageSize, notes || '', category || '');
    
    const ingredient = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(id);
    res.status(201).json(ingredient);
  } catch (error) {
    console.error('Error creating ingredient:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Ingredient with this name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create ingredient' });
    }
  }
});

app.put('/api/ingredients/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, costPerUnit, packageSize, notes, category } = req.body;
    
    // Validation
    if (!name || !unit || !costPerUnit || !packageSize) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (costPerUnit <= 0 || packageSize <= 0) {
      return res.status(400).json({ error: 'Cost and package size must be positive' });
    }
    
    const stmt = db.prepare(`
      UPDATE ingredients 
      SET name = ?, unit = ?, costPerUnit = ?, packageSize = ?, notes = ?, category = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(name.trim(), unit, costPerUnit, packageSize, notes || '', category || '', id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    const ingredient = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(id);
    res.json(ingredient);
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

app.delete('/api/ingredients/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM ingredients WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

// Cakes endpoints
app.get('/api/cakes', (req, res) => {
  try {
    const cakes = db.prepare(`
      SELECT c.*, 
             GROUP_CONCAT(ci.ingredientId || ':' || ci.quantity || ':' || ci.cost) as ingredients
      FROM cakes c
      LEFT JOIN cake_ingredients ci ON c.id = ci.cakeId
      GROUP BY c.id
      ORDER BY c.createdAt DESC
    `).all();
    
    const cakesWithIngredients = cakes.map(cake => ({
      ...cake,
      ingredients: cake.ingredients ? cake.ingredients.split(',').map(ing => {
        const [ingredientId, quantity, cost] = ing.split(':');
        return { ingredientId, quantity: parseFloat(quantity), cost: parseFloat(cost) };
      }) : []
    }));
    
    res.json(cakesWithIngredients);
  } catch (error) {
    console.error('Error fetching cakes:', error);
    res.status(500).json({ error: 'Failed to fetch cakes' });
  }
});

app.post('/api/cakes', (req, res) => {
  try {
    const { name, type, weight, occasion, description, ingredients, profitMargin } = req.body;
    
    // Validation
    if (!name || !type || !weight || !ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (weight <= 0) {
      return res.status(400).json({ error: 'Weight must be positive' });
    }
    
    const id = uuidv4();
    
    const totalCost = ingredients.reduce((sum, ing) => sum + ing.cost, 0);
    const sellingPrice = totalCost * (1 + (profitMargin || 0) / 100);
    
    const insertCake = db.prepare(`
      INSERT INTO cakes (id, name, type, weight, occasion, description, totalCost, profitMargin, sellingPrice)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertCakeIngredient = db.prepare(`
      INSERT INTO cake_ingredients (id, cakeId, ingredientId, quantity, cost)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const transaction = db.transaction(() => {
      insertCake.run(id, name.trim(), type, weight, occasion || '', description || '', totalCost, profitMargin || 0, sellingPrice);
      
      ingredients.forEach(ing => {
        insertCakeIngredient.run(uuidv4(), id, ing.ingredientId, ing.quantity, ing.cost);
      });
    });
    
    transaction();
    
    const cake = db.prepare('SELECT * FROM cakes WHERE id = ?').get(id);
    res.status(201).json(cake);
  } catch (error) {
    console.error('Error creating cake:', error);
    res.status(500).json({ error: 'Failed to create cake budget' });
  }
});

app.delete('/api/cakes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM cakes WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cake not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting cake:', error);
    res.status(500).json({ error: 'Failed to delete cake' });
  }
});

// Analytics endpoints
app.get('/api/analytics', (req, res) => {
  try {
    const totalCakes = db.prepare('SELECT COUNT(*) as count FROM cakes').get().count;
    const totalIngredients = db.prepare('SELECT COUNT(*) as count FROM ingredients').get().count;
    
    // Get detailed cake statistics with meaningful metrics
    const cakeStats = db.prepare(`
      SELECT 
        COUNT(*) as totalCakes,
        AVG(totalCost) as avgCost,
        MAX(totalCost) as mostExpensiveCake,
        MIN(totalCost) as cheapestCake,
        AVG(profitMargin) as avgProfitMargin,
        AVG(totalCost / weight) as avgCostPerKg
      FROM cakes
    `).get();
    
    const topCostlyIngredients = db.prepare(`
      SELECT i.name, i.costPerUnit, i.unit, COUNT(ci.ingredientId) as usageCount
      FROM ingredients i
      LEFT JOIN cake_ingredients ci ON i.id = ci.ingredientId
      GROUP BY i.id
      ORDER BY i.costPerUnit DESC
      LIMIT 5
    `).all();
    
    const cakesByType = db.prepare(`
      SELECT type, COUNT(*) as count, AVG(totalCost) as avgCost
      FROM cakes
      GROUP BY type
      ORDER BY count DESC
    `).all();
    
    // Get most popular cake type
    const mostPopularType = cakesByType.length > 0 ? cakesByType[0] : null;
    
    // Calculate meaningful metrics
    const avgCost = cakeStats.avgCost || 0;
    const mostExpensiveCake = cakeStats.mostExpensiveCake || 0;
    const cheapestCake = cakeStats.cheapestCake || 0;
    const avgProfitMargin = cakeStats.avgProfitMargin || 0;
    const avgCostPerKg = cakeStats.avgCostPerKg || 0;
    const costRange = mostExpensiveCake - cheapestCake;
    
    res.json({
      summary: {
        totalCakes: totalCakes || 0,
        totalIngredients: totalIngredients || 0,
        avgCost: Math.round(avgCost * 100) / 100,
        costRange: Math.round(costRange * 100) / 100,
        avgProfitMargin: Math.round(avgProfitMargin * 100) / 100,
        avgCostPerKg: Math.round(avgCostPerKg * 100) / 100,
        mostExpensiveCake: Math.round(mostExpensiveCake * 100) / 100,
        cheapestCake: Math.round(cheapestCake * 100) / 100
      },
      topCostlyIngredients,
      cakesByType,
      mostPopularType
    });
  } catch (error) {
    console.error('Error in analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});