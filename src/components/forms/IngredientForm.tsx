import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  packageSize: number;
  notes: string;
  category: string;
}

interface IngredientFormProps {
  ingredient?: Ingredient | null;
  onClose: () => void;
}

export const IngredientForm: React.FC<IngredientFormProps> = ({ ingredient, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: 'g',
    costPerUnit: '',
    packageSize: '',
    notes: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        unit: ingredient.unit,
        costPerUnit: ingredient.costPerUnit.toString(),
        packageSize: ingredient.packageSize.toString(),
        notes: ingredient.notes,
        category: ingredient.category
      });
    }
  }, [ingredient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Ingredient name is required');
      setLoading(false);
      return;
    }

    if (!formData.costPerUnit || parseFloat(formData.costPerUnit) <= 0) {
      setError('Valid cost per package is required');
      setLoading(false);
      return;
    }

    if (!formData.packageSize || parseFloat(formData.packageSize) <= 0) {
      setError('Valid package size is required');
      setLoading(false);
      return;
    }

    try {
      const url = ingredient 
        ? `${API_ENDPOINTS.ingredients}/${ingredient.id}`
        : API_ENDPOINTS.ingredients;
      
      const method = ingredient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          costPerUnit: parseFloat(formData.costPerUnit),
          packageSize: parseFloat(formData.packageSize)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save ingredient');
      }

      onClose();
    } catch (error) {
      console.error('Error saving ingredient:', error);
      setError(error instanceof Error ? error.message : 'Failed to save ingredient');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Dry Ingredients',
    'Dairy',
    'Sweeteners',
    'Flavorings',
    'Leavening',
    'Decorations',
    'Fruits',
    'Nuts',
    'Other'
  ];

  const units = ['g', 'ml', 'pcs', 'kg', 'L', 'tsp', 'tbsp', 'cups'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {ingredient ? 'Edit Ingredient' : 'Add New Ingredient'}
          </h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredient Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., All Purpose Flour"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <select
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Size *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.packageSize}
                onChange={(e) => setFormData({ ...formData, packageSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost per Package (LKR) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={formData.costPerUnit}
              onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="450.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={3}
              placeholder="Additional notes about this ingredient..."
            />
          </div>

          {/* Cost Preview */}
          {formData.costPerUnit && formData.packageSize && parseFloat(formData.costPerUnit) > 0 && parseFloat(formData.packageSize) > 0 && (
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Cost Breakdown:</p>
              <p className="text-lg font-semibold text-pink-600">
                LKR {(parseFloat(formData.costPerUnit) / parseFloat(formData.packageSize)).toFixed(2)} per {formData.unit}
              </p>
            </div>
          )}

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
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (ingredient ? 'Update' : 'Add')} Ingredient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};