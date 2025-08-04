import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  Cake, 
  DollarSign,
  Plus,
  ArrowUpRight,
  Clock,
  BarChart3,
  Calculator
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

interface DashboardStats {
  totalCakes: number;
  totalIngredients: number;
  avgCost: number;
  costRange: number;
  avgProfitMargin: number;
  avgCostPerKg: number;
  mostExpensiveCake: number;
  cheapestCake: number;
  recentCakes: number;
  popularCakeTypes: Array<{type: string, count: number}>;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCakes: 0,
    totalIngredients: 0,
    avgCost: 0,
    costRange: 0,
    avgProfitMargin: 0,
    avgCostPerKg: 0,
    mostExpensiveCake: 0,
    cheapestCake: 0,
    recentCakes: 0,
    popularCakeTypes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setStats(data.summary);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToIngredients = () => {
    // Update the active tab to ingredients
    const event = new CustomEvent('navigate', { detail: 'ingredients' });
    window.dispatchEvent(event);
  };

  const handleNavigateToCakes = () => {
    // Update the active tab to cakes
    const event = new CustomEvent('navigate', { detail: 'cakes' });
    window.dispatchEvent(event);
  };

  const statCards = [
    {
      title: 'Planned Cakes',
      value: stats.totalCakes.toString(),
      icon: Cake,
      color: 'from-pink-400 to-pink-500',
      description: 'Cake budgets planned'
    },
    {
      title: 'Ingredients',
      value: stats.totalIngredients.toString(),
      icon: Package,
      color: 'from-blue-400 to-blue-500',
      description: 'Available ingredients'
    },
    {
      title: 'Avg Profit Margin',
      value: `${stats.avgProfitMargin}%`,
      icon: TrendingUp,
      color: 'from-green-400 to-green-500',
      description: 'Average profit potential'
    },
    {
      title: 'Cost Range',
      value: formatCurrency(stats.costRange),
      icon: BarChart3,
      color: 'from-purple-400 to-purple-500',
      description: 'Price spread'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to Sweet Treats! 👨‍🍳</h1>
          <p className="text-pink-100 mb-6">
            Plan your cake budgets and track ingredient costs efficiently.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleNavigateToCakes}
              className="bg-white text-pink-500 px-6 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Cake</span>
            </button>
            <button 
              onClick={handleNavigateToIngredients}
              className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Add Ingredient</span>
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <Cake className="w-24 h-24" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{card.value}</p>
                <p className="text-gray-600 font-medium">{card.title}</p>
                <p className="text-gray-500 text-sm mt-1">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      {stats.totalCakes > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Planning</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Profit Margin:</span>
                <span className="font-semibold text-gray-800">{stats.avgProfitMargin}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Most Expensive Plan:</span>
                <span className="font-semibold text-red-600">{formatCurrency(stats.mostExpensiveCake)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cheapest Plan:</span>
                <span className="font-semibold text-blue-600">{formatCurrency(stats.cheapestCake)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cost per Kg:</span>
                <span className="font-semibold text-green-600">{formatCurrency(stats.avgCostPerKg)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Planning Insights</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Cake className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Cake Plans Created</p>
                  <p className="text-sm text-gray-600">{stats.totalCakes} planned cakes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Ingredients Available</p>
                  <p className="text-sm text-gray-600">{stats.totalIngredients} ingredients</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Cost Range</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(stats.cheapestCake)} - {formatCurrency(stats.mostExpensiveCake)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            <ArrowUpRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <button 
              onClick={handleNavigateToIngredients}
              className="w-full flex items-center justify-between p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-gray-700">Manage Ingredients</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </button>
            
            <button 
              onClick={handleNavigateToCakes}
              className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Cake className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-700">Plan New Cake</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => {
                const event = new CustomEvent('navigate', { detail: 'analytics' });
                window.dispatchEvent(event);
              }}
              className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-700">View Analytics</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Planning Tips</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
              <p>Add all your ingredients first to create accurate cake budgets</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
              <p>Update ingredient prices regularly to maintain accurate cost calculations</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
              <p>Use the analytics section to track your most popular cake types</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};