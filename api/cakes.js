const { getCakes, createCake, deleteCake } = require('./db.js');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const cakes = getCakes();
        return res.json(cakes);
      
      case 'POST':
        const { name, type, weight, occasion, description, ingredients, profitMargin } = req.body;
        
        // Validation
        if (!name || !type || !weight || !ingredients || ingredients.length === 0) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        if (weight <= 0) {
          return res.status(400).json({ error: 'Weight must be positive' });
        }
        
        // Validate ingredients array
        for (const ingredient of ingredients) {
          if (!ingredient.ingredientId || !ingredient.quantity || !ingredient.cost) {
            return res.status(400).json({ error: 'Invalid ingredient data' });
          }
          
          if (ingredient.quantity <= 0 || ingredient.cost < 0) {
            return res.status(400).json({ error: 'Ingredient quantity must be positive and cost cannot be negative' });
          }
        }
        
        const newCake = createCake({
          name: name.trim(),
          type,
          weight,
          occasion: occasion || '',
          description: description || '',
          ingredients,
          profitMargin: profitMargin || 0
        });
        
        return res.status(201).json(newCake);
      
      case 'DELETE':
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'Cake ID is required' });
        }
        
        deleteCake(id);
        return res.status(204).end();
      
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Cakes API Error:', error);
    
    if (error.message === 'Cake not found') {
      return res.status(404).json({ error: 'Cake not found' });
    }
    
    return res.status(500).json({ error: 'Failed to process cake request' });
  }
}