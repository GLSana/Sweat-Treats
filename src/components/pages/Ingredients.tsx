import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Filter,
  Package
} from 'lucide-react';
import { IngredientForm } from '../forms/IngredientForm';
import { formatCurrency } from '../../utils/currency';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  packageSize: number;
  notes: string;
  category: string;
  createdAt: string;
}

export const Ingredients: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/ingredients');
      if (!response.ok) {
        throw new Error('Failed to fetch ingredients');
      }
      const data = await response.json();
      setIngredients(data);
      setError('');
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setError('Failed to load ingredients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/ingredients/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete ingredient');
      }
      
      setIngredients(ingredients.filter(ing => ing.id !== id));
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      setError('Failed to delete ingredient. Please try again.');
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingIngredient(null);
    fetchIngredients();
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ingredient.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(ingredients.map(ing => ing.category))].filter(Boolean);

  const calculateCostPerUnit = (ingredient: Ingredient) => {
    return ingredient.costPerUnit / ingredient.packageSize;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ingredient Management</h1>
          <p className="text-gray-600">Manage your baking ingredients and their costs</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Ingredient</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ingredients Grid */}
      {filteredIngredients.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No ingredients found</h3>
          <p className="text-gray-500 mb-6">
            {ingredients.length === 0 
              ? "Add your first ingredient to get started!" 
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {ingredients.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              Add First Ingredient
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIngredients.map((ingredient) => (
            <div key={ingredient.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">{ingredient.category || 'Other'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEdit(ingredient)}
                      className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ingredient.id)}
                      className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{ingredient.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Unit:</span> {ingredient.unit}</p>
                  <p><span className="font-medium">Package Size:</span> {ingredient.packageSize} {ingredient.unit}</p>
                  <p><span className="font-medium">Cost per Package:</span> {formatCurrency(ingredient.costPerUnit)}</p>
                  {ingredient.notes && (
                    <p className="text-gray-500 text-xs line-clamp-2">{ingredient.notes}</p>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Cost per {ingredient.unit}:</p>
                  <p className="text-lg font-bold text-blue-700">
                    {formatCurrency(calculateCostPerUnit(ingredient))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <IngredientForm 
          ingredient={editingIngredient} 
          onClose={handleFormClose} 
        />
      )}
    </div>
  );
};