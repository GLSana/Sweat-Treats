import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { API_ENDPOINTS } from '../../config/api';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  packageSize: number;
}

interface CakeIngredient {
  ingredientId: string;
  quantity: number;
  cost: number;
}

interface CakeFormProps {
  onClose: () => void;
}

export const CakeForm: React.FC<CakeFormProps> = ({ onClose }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Birthday Cake',
    weight: '',
    occasion: '',
    description: '',
    profitMargin: '25'
  });
  const [cakeIngredients, setCakeIngredients] = useState<CakeIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ingredients);
      if (!response.ok) {
        throw new Error('Failed to fetch ingredients');
      }
      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setError('Failed to load ingredients. Please try again.');
    }
  };

  const addIngredient = () => {
    if (ingredients.length > 0) {
      setCakeIngredients([...cakeIngredients, {
        ingredientId: ingredients[0].id,
        quantity: 0,
        cost: 0
      }]);
    }
  };

  const removeIngredient = (index: number) => {
    setCakeIngredients(cakeIngredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof CakeIngredient, value: string) => {
    const updated = [...cakeIngredients];
    const ingredient = ingredients.find(ing => ing.id === updated[index].ingredientId);
    
    if (field === 'ingredientId') {
      updated[index].ingredientId = value;
      const newIngredient = ingredients.find(ing => ing.id === value);
      if (newIngredient && updated[index].quantity > 0) {
        const costPerUnit = newIngredient.costPerUnit / newIngredient.packageSize;
        updated[index].cost = costPerUnit * updated[index].quantity;
      }
    } else if (field === 'quantity') {
      updated[index].quantity = parseFloat(value) || 0;
      if (ingredient) {
        const costPerUnit = ingredient.costPerUnit / ingredient.packageSize;
        updated[index].cost = costPerUnit * updated[index].quantity;
      }
    }
    
    setCakeIngredients(updated);
  };

  const totalCost = cakeIngredients.reduce((sum, ing) => sum + ing.cost, 0);
  const profitMargin = parseFloat(formData.profitMargin) || 0;
  const sellingPrice = totalCost * (1 + profitMargin / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Cake name is required');
      setLoading(false);
      return;
    }

    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      setError('Valid weight is required');
      setLoading(false);
      return;
    }

    if (cakeIngredients.length === 0) {
      setError('At least one ingredient is required');
      setLoading(false);
      return;
    }

    const validIngredients = cakeIngredients.filter(ing => ing.quantity > 0);
    if (validIngredients.length === 0) {
      setError('At least one ingredient with quantity > 0 is required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.cakes, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          weight: parseFloat(formData.weight),
          profitMargin: parseFloat(formData.profitMargin),
          ingredients: validIngredients
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create cake budget');
      }

      onClose();
    } catch (error) {
      console.error('Error saving cake:', error);
      setError(error instanceof Error ? error.message : 'Failed to create cake budget');
    } finally {
      setLoading(false);
    }
  };

  const cakeTypes = [
    'Birthday Cake',
    'Wedding Cake',
    'Bento Cake',
    'Cup Cake',
    'Custom Cake'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Create Cake Budget</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cake Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Chocolate Birthday Cake"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cake Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {cakeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (grams) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occasion
              </label>
              <input
                type="text"
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Birthday, Anniversary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={3}
              placeholder="Describe the cake details..."
            />
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Ingredients</h3>
              <button
                type="button"
                onClick={addIngredient}
                disabled={ingredients.length === 0}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ingredient</span>
              </button>
            </div>

            {ingredients.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p>No ingredients available. Please add ingredients first.</p>
              </div>
            )}

            <div className="space-y-3">
              {cakeIngredients.map((cakeIngredient, index) => {
                const ingredient = ingredients.find(ing => ing.id === cakeIngredient.ingredientId);
                
                return (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <select
                      value={cakeIngredient.ingredientId}
                      onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {ingredients.map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name}</option>
                      ))}
                    </select>

                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={cakeIngredient.quantity}
                        onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500 min-w-8">
                        {ingredient?.unit}
                      </span>
                    </div>

                    <div className="min-w-20 text-right">
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(cakeIngredient.cost)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {cakeIngredients.length === 0 && ingredients.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No ingredients added yet. Click "Add Ingredient" to start.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-pink-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profit Margin (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.profitMargin}
                  onChange={(e) => setFormData({ ...formData, profitMargin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-semibold text-gray-800">{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Profit ({profitMargin}%):</span>
                <span className="font-semibold text-green-600">{formatCurrency(sellingPrice - totalCost)}</span>
              </div>
              <div className="flex justify-between items-center text-lg border-t pt-2">
                <span className="font-semibold text-gray-800">Selling Price:</span>
                <span className="font-bold text-pink-600">{formatCurrency(sellingPrice)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || cakeIngredients.length === 0 || ingredients.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Cake Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};