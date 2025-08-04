import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Search,
  Filter,
  Cake,
  Eye
} from 'lucide-react';
import { CakeForm } from '../forms/CakeForm';
import { CakeDetails } from '../modals/CakeDetails';
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

export const Cakes: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/cakes');
      if (!response.ok) {
        throw new Error('Failed to fetch cakes');
      }
      const data = await response.json();
      setCakes(data);
      setError('');
    } catch (error) {
      console.error('Error fetching cakes:', error);
      setError('Failed to load cakes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cake plan?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/cakes/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete cake');
      }
      
      setCakes(cakes.filter(cake => cake.id !== id));
    } catch (error) {
      console.error('Error deleting cake:', error);
      setError('Failed to delete cake. Please try again.');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    fetchCakes();
  };

  const filteredCakes = cakes.filter(cake => {
    const matchesSearch = cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cake.occasion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || cake.type === selectedType;
    return matchesSearch && matchesType;
  });

  const cakeTypes = [...new Set(cakes.map(cake => cake.type))].filter(Boolean);

  const getCakeTypeColor = (type: string) => {
    const colors = {
      'Birthday Cake': 'from-pink-400 to-pink-500',
      'Wedding Cake': 'from-purple-400 to-purple-500',
      'Bento Cake': 'from-blue-400 to-blue-500',
      'Cup Cake': 'from-green-400 to-green-500',
      'Custom Cake': 'from-orange-400 to-orange-500'
    };
    return colors[type as keyof typeof colors] || 'from-gray-400 to-gray-500';
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
          <h1 className="text-2xl font-bold text-gray-800">Cake Budget Planning</h1>
          <p className="text-gray-600">Plan and manage your cake budgets</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Cake</span>
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
            placeholder="Search cake plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {cakeTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cakes Grid */}
      {filteredCakes.length === 0 ? (
        <div className="text-center py-12">
          <Cake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No cake plans found</h3>
          <p className="text-gray-500 mb-6">
            {cakes.length === 0 
              ? "Create your first cake budget plan to get started!" 
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {cakes.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              Create First Cake Plan
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCakes.map((cake) => (
            <div key={cake.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              {/* Header */}
              <div className={`bg-gradient-to-r ${getCakeTypeColor(cake.type)} p-4 rounded-t-2xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cake className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">{cake.type}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(cake.id)}
                    className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{cake.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Weight:</span> {cake.weight}g</p>
                  {cake.occasion && (
                    <p><span className="font-medium">Occasion:</span> {cake.occasion}</p>
                  )}
                  {cake.description && (
                    <p className="text-gray-500 text-xs line-clamp-2">{cake.description}</p>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Planned Cost:</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(cake.totalCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Profit Margin ({cake.profitMargin}%):</span>
                    <span className="font-semibold text-green-600">{formatCurrency(cake.sellingPrice - cake.totalCost)}</span>
                  </div>
                  <div className="flex justify-between text-lg border-t pt-2">
                    <span className="font-semibold text-gray-800">Suggested Price:</span>
                    <span className="font-bold text-pink-600">{formatCurrency(cake.sellingPrice)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedCake(cake)}
                    className="flex-1 bg-pink-50 text-pink-600 py-2 px-3 rounded-lg hover:bg-pink-100 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && <CakeForm onClose={handleFormClose} />}
      {selectedCake && (
        <CakeDetails 
          cake={selectedCake} 
          onClose={() => setSelectedCake(null)} 
        />
      )}
    </div>
  );
};