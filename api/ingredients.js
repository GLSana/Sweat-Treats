const { getIngredients, createIngredient, updateIngredient, deleteIngredient } = require('./db.js');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const ingredients = getIngredients();
        return res.json(ingredients);
      
      case 'POST':
        const { name, unit, costPerUnit, packageSize, notes, category } = req.body;
        
        // Validation
        if (!name || !unit || !costPerUnit || !packageSize) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        if (costPerUnit <= 0 || packageSize <= 0) {
          return res.status(400).json({ error: 'Cost and package size must be positive' });
        }
        
        // Check for duplicate names
        const existingIngredients = getIngredients();
        if (existingIngredients.some(ing => ing.name.toLowerCase() === name.toLowerCase().trim())) {
          return res.status(400).json({ error: 'Ingredient with this name already exists' });
        }
        
        const newIngredient = createIngredient({
          name: name.trim(),
          unit,
          costPerUnit,
          packageSize,
          notes: notes || '',
          category: category || ''
        });
        
        return res.status(201).json(newIngredient);
      
      case 'PUT':
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'Ingredient ID is required' });
        }
        
        const updateData = req.body;
        
        // Validation for update
        if (updateData.name && !updateData.name.trim()) {
          return res.status(400).json({ error: 'Name cannot be empty' });
        }
        
        if (updateData.costPerUnit && updateData.costPerUnit <= 0) {
          return res.status(400).json({ error: 'Cost per unit must be positive' });
        }
        
        if (updateData.packageSize && updateData.packageSize <= 0) {
          return res.status(400).json({ error: 'Package size must be positive' });
        }
        
        // Check for duplicate names (excluding current ingredient)
        if (updateData.name) {
          const existingIngredients = getIngredients();
          if (existingIngredients.some(ing => ing.id !== id && ing.name.toLowerCase() === updateData.name.toLowerCase().trim())) {
            return res.status(400).json({ error: 'Ingredient with this name already exists' });
          }
        }
        
        const updatedIngredient = updateIngredient(id, {
          ...updateData,
          name: updateData.name ? updateData.name.trim() : undefined
        });
        
        return res.json(updatedIngredient);
      
      case 'DELETE':
        const { id: deleteId } = req.query;
        if (!deleteId) {
          return res.status(400).json({ error: 'Ingredient ID is required' });
        }
        
        deleteIngredient(deleteId);
        return res.status(204).end();
      
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Ingredients API Error:', error);
    
    if (error.message === 'Ingredient not found') {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};