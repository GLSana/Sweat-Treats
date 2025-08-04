import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

interface CakeIngredient {
  ingredientId: string;
  quantity: number;
  cost: number;
}

interface Cake {
  id: string;
  name: string;
  type: string;
  weight: number;
  occasion: string;
  description: string;
  totalCost: number;
  profitMargin: number;
  sellingPrice: number;
  ingredients: CakeIngredient[];
  createdAt: string;
}

interface Ingredient {
  id: string;
  name: string;
  unit: string;
}

interface CakeDetailsProps {
  cake: Cake;
  onClose: () => void;
}

export const CakeDetails: React.FC<CakeDetailsProps> = ({ cake, onClose }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ingredients');
      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const getIngredientName = (ingredientId: string) => {
    const ingredient = ingredients.find(ing => ing.id === ingredientId);
    return ingredient ? ingredient.name : 'Unknown Ingredient';
  };

  const getIngredientUnit = (ingredientId: string) => {
    const ingredient = ingredients.find(ing => ing.id === ingredientId);
    return ingredient ? ingredient.unit : '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{cake.name}</h2>
            <p className="text-gray-600">{cake.type} • {cake.weight}g</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cake.occasion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                <p className="text-gray-800">{cake.occasion}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
              <p className="text-gray-800">{new Date(cake.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {cake.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{cake.description}</p>
            </div>
          )}

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingredients Breakdown</h3>
            <div className="space-y-3">
              {cake.ingredients.map((cakeIngredient, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {getIngredientName(cakeIngredient.ingredientId)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cakeIngredient.quantity} {getIngredientUnit(cakeIngredient.ingredientId)}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(cakeIngredient.cost)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-gradient-to-r from-pink-50 to-cream-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Ingredient Cost:</span>
                <span className="font-semibold text-gray-800">{formatCurrency(cake.totalCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Profit Margin:</span>
                <span className="font-semibold text-blue-600">{cake.profitMargin}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Profit Amount:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(cake.sellingPrice - cake.totalCost)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg border-t pt-3">
                <span className="font-bold text-gray-800">Selling Price:</span>
                <span className="font-bold text-pink-600">{formatCurrency(cake.sellingPrice)}</span>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Cost per 100g</h4>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency((cake.totalCost / cake.weight) * 100)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Profit per 100g</h4>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(((cake.sellingPrice - cake.totalCost) / cake.weight) * 100)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};