import { useState, useEffect } from 'react';
import { Brain, TrendingDown, Calendar, Target, Zap, AlertTriangle } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useApp } from '../context/AppContext';

export function PricePredictionCard() {
  const { predictions, addPricePrediction } = useGamification();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);

  // Mock AI predictions - in real app, this would come from ML model
  const mockPredictions = [
    {
      productId: 'pred1',
      productName: 'iPhone 15 Pro',
      currentPrice: 129900,
      predictedDrop: 15, // 15% drop
      confidence: 85,
      predictedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      reasoning: 'Historical data shows price drops during festival seasons'
    },
    {
      productId: 'pred2',
      productName: 'MacBook Air M3',
      currentPrice: 114900,
      predictedDrop: 8, // 8% drop
      confidence: 72,
      predictedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
      reasoning: 'New model launch expected next month'
    },
    {
      productId: 'pred3',
      productName: 'Sony WH-1000XM5',
      currentPrice: 29990,
      predictedDrop: 25, // 25% drop
      confidence: 91,
      predictedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      reasoning: 'Amazon Great Indian Festival approaching'
    }
  ];

  // Add mock predictions to gamification context
  useEffect(() => {
    mockPredictions.forEach(pred => {
      const existing = predictions.find(p => p.productId === pred.productId);
      if (!existing) {
        addPricePrediction(pred);
      }
    });
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    if (confidence >= 60) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-500 bg-red-50 dark:bg-red-900/20';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <Target className="w-4 h-4" />;
    if (confidence >= 60) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getUrgencyLevel = (days: number) => {
    if (days <= 1) return { level: 'high', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (days <= 3) return { level: 'medium', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' };
    return { level: 'low', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
  };

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🔮 AI Price Predictions
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Smart predictions for upcoming deals
          </p>
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {predictions.slice(0, 3).map((prediction) => {
          const daysUntil = Math.ceil((prediction.predictedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const urgency = getUrgencyLevel(daysUntil);
          const predictedPrice = Math.round(prediction.currentPrice * (1 - prediction.predictedDrop / 100));
          const savings = prediction.currentPrice - predictedPrice;

          return (
            <div
              key={prediction.productId}
              className={`p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${
                selectedPrediction === prediction.productId
                  ? `${isDark ? 'border-purple-500 bg-purple-900/20' : 'border-purple-500 bg-purple-50'}`
                  : `${isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`
              }`}
              onClick={() => setSelectedPrediction(
                selectedPrediction === prediction.productId ? null : prediction.productId
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {prediction.productName}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Current: ₹{prediction.currentPrice.toLocaleString()}
                  </p>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getConfidenceColor(prediction.confidence)}`}>
                  {getConfidenceIcon(prediction.confidence)}
                  {prediction.confidence}% confident
                </div>
              </div>

              {/* Prediction Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${urgency.bg} ${urgency.color}`}>
                    <TrendingDown className="w-4 h-4 inline mr-1" />
                    {prediction.predictedDrop}% drop
                  </div>

                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {formatDate(prediction.predictedDate)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-lg font-black text-green-600 dark:text-green-400`}>
                    ₹{predictedPrice.toLocaleString()}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Save ₹{savings.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedPrediction === prediction.productId && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="space-y-3">
                    <div>
                      <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        🤖 AI Reasoning:
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {prediction.reasoning}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Based on 90-day price history
                        </span>
                      </div>

                      <button className="px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all">
                        🔔 Set Alert
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Stats */}
      <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-center justify-center gap-4 text-center">
          <div>
            <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {predictions.length}
            </p>
            <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
              Active Predictions
            </p>
          </div>
          <div>
            <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ₹{predictions.reduce((sum, p) => sum + Math.round(p.currentPrice * (p.predictedDrop / 100)), 0).toLocaleString()}
            </p>
            <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
              Potential Savings
            </p>
          </div>
          <div>
            <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)}%
            </p>
            <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
              Avg Confidence
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className={`mt-4 p-3 rounded-xl text-center ${isDark ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
        <p className={`text-sm ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
          🎯 Get notified when our AI predicts a price drop for products you view!
        </p>
      </div>
    </div>
  );
}