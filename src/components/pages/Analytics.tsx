import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  DollarSign,
  PieChart,
  BarChart3,
  Cake,
  Calculator
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { API_ENDPOINTS } from '../../config/api';

interface AnalyticsData {
  summary: {
    totalCakes: number;
    totalIngredients: number;
    avgCost: number;
    costRange: number;
    avgProfitMargin: number;
    avgCostPerKg: number;
    mostExpensiveCake: number;
    cheapestCake: number;
  };
  topCostlyIngredients: Array<{
    name: string;
    costPerUnit: number;
    unit: string;
    usageCount: number;
  }>;
  cakesByType: Array<{
    type: string;
    count: number;
    avgCost: number;
  }>;
  mostPopularType: {
    type: string;
    count: number;
    avgCost: number;
  } | null;
}

export const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.analytics);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Budget Planning Analytics</h1>
        <p className="text-gray-600">Insights and trends for your cake budget planning</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <div className="text-right">
              <p className="text-green-100">Avg Profit Margin</p>
              <p className="text-2xl font-bold">{analytics.summary.avgProfitMargin}%</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Cake className="w-8 h-8" />
            <div className="text-right">
              <p className="text-pink-100">Planned Cakes</p>
              <p className="text-2xl font-bold">{analytics.summary.totalCakes}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8" />
            <div className="text-right">
              <p className="text-blue-100">Ingredients</p>
              <p className="text-2xl font-bold">{analytics.summary.totalIngredients}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8" />
            <div className="text-right">
              <p className="text-purple-100">Cost Range</p>
              <p className="text-2xl font-bold">{formatCurrency(analytics.summary.costRange)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Analysis */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Planning Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Most Expensive Plan:</span>
              <span className="font-semibold text-red-600">{formatCurrency(analytics.summary.mostExpensiveCake)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Cheapest Plan:</span>
              <span className="font-semibold text-green-600">{formatCurrency(analytics.summary.cheapestCake)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Average Budget Cost:</span>
              <span className="font-semibold text-blue-600">{formatCurrency(analytics.summary.avgCost)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Cost per Kg:</span>
              <span className="font-semibold text-purple-600">{formatCurrency(analytics.summary.avgCostPerKg)}</span>
            </div>
          </div>
        </div>

        {/* Popular Cake Types */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Cake Types</h3>
          {analytics.mostPopularType && (
            <div className="mb-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border-l-4 border-pink-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">Most Popular: {analytics.mostPopularType.type}</p>
                  <p className="text-sm text-gray-600">{analytics.mostPopularType.count} plans</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-pink-600">{formatCurrency(analytics.mostPopularType.avgCost)}</p>
                  <p className="text-sm text-gray-500">avg cost</p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {analytics.cakesByType.map((cakeType, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{cakeType.type}</p>
                  <p className="text-sm text-gray-600">{cakeType.count} plans</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{formatCurrency(cakeType.avgCost)}</p>
                  <p className="text-sm text-gray-500">avg cost</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Costly Ingredients */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Expensive Ingredients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.topCostlyIngredients.map((ingredient, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{ingredient.name}</h4>
                <span className="text-sm text-gray-500">{ingredient.unit}</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-pink-600">
                  {formatCurrency(ingredient.costPerUnit)} per package
                </p>
                <p className="text-sm text-gray-600">
                  Used in {ingredient.usageCount} cake plans
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Planning Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong>Cost Range:</strong> Your cake plans range from {formatCurrency(analytics.summary.cheapestCake)} to {formatCurrency(analytics.summary.mostExpensiveCake)}
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong>Average Budget:</strong> On average, each cake plan costs {formatCurrency(analytics.summary.avgCost)}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong>Profit Potential:</strong> Average profit margin across all cake plans is {analytics.summary.avgProfitMargin}%
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong>Cost Efficiency:</strong> Average cost per kg is {formatCurrency(analytics.summary.avgCostPerKg)} - helps you price competitively
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};