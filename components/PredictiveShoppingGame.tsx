import { useState, useEffect } from 'react';
import { Target, BarChart3, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useApp } from '../context/AppContext';

interface PredictionGame {
  id: string;
  productId: string;
  productName: string;
  currentPrice: number;
  question: string;
  options: { id: string; text: string; correct: boolean }[];
  timeLeft: number;
  status: 'active' | 'completed' | 'expired';
  userPrediction?: string;
  correctAnswer?: string;
  points: number;
  expiresAt: Date;
}

export function PredictiveShoppingGame() {
  const { earnPoints, addPricePrediction } = useGamification();
  const { theme, products } = useApp();
  const isDark = theme === 'dark';
  const [currentGame, setCurrentGame] = useState<PredictionGame | null>(null);
  const [gameHistory, setGameHistory] = useState<PredictionGame[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Generate daily prediction game
  useEffect(() => {
    const generateDailyGame = () => {
      const today = new Date().toISOString().split('T')[0];
      const gameId = `game_${today}`;

      // Check if game already exists
      if (gameHistory.some(g => g.id === gameId)) return;

      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const currentPrice = randomProduct.prices[0]?.price || 1000;

      // Random prediction scenarios
      const scenarios = [
        {
          question: `Will ${randomProduct.title} price drop below ₹${Math.round(currentPrice * 0.9)} in the next 24 hours?`,
          options: [
            { id: 'yes', text: 'Yes, it will drop!', correct: Math.random() > 0.6 },
            { id: 'no', text: 'No, price stable', correct: Math.random() <= 0.6 }
          ]
        },
        {
          question: `Will ${randomProduct.title} get a discount of 20% or more in the next 3 days?`,
          options: [
            { id: 'yes', text: 'Yes, big discount coming!', correct: Math.random() > 0.7 },
            { id: 'no', text: 'No, regular pricing', correct: Math.random() <= 0.7 }
          ]
        },
        {
          question: `Will ${randomProduct.title} be the top deal on ${['Amazon', 'Flipkart', 'Croma'][Math.floor(Math.random() * 3)]} tomorrow?`,
          options: [
            { id: 'yes', text: 'Yes, top deal!', correct: Math.random() > 0.5 },
            { id: 'no', text: 'No, not featured', correct: Math.random() <= 0.5 }
          ]
        }
      ];

      const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

      const game: PredictionGame = {
        id: gameId,
        productId: randomProduct.id,
        productName: randomProduct.title,
        currentPrice,
        question: selectedScenario.question,
        options: selectedScenario.options,
        timeLeft: 24 * 60 * 60, // 24 hours in seconds
        status: 'active',
        points: 50,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };

      setCurrentGame(game);
      setTimeLeft(game.timeLeft);
    };

    generateDailyGame();
  }, [products, gameHistory]);

  // Countdown timer
  useEffect(() => {
    if (!currentGame || currentGame.status !== 'active') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCurrentGame(prev => prev ? { ...prev, status: 'expired' } : null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentGame]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrediction = (optionId: string) => {
    if (!currentGame || selectedAnswer) return;

    setSelectedAnswer(optionId);

    // Simulate AI checking after delay
    setTimeout(() => {
      const selectedOption = currentGame.options.find(opt => opt.id === optionId);
      const correctOption = currentGame.options.find(opt => opt.correct);

      const isCorrect = selectedOption?.correct || false;
      const pointsEarned = isCorrect ? currentGame.points : 0;

      const updatedGame: PredictionGame = {
        ...currentGame,
        status: 'completed',
        userPrediction: optionId,
        correctAnswer: correctOption?.id,
        points: pointsEarned
      };

      setCurrentGame(updatedGame);
      setGameHistory(prev => [updatedGame, ...prev]);
      setShowResult(true);

      if (isCorrect) {
        earnPoints(pointsEarned, 'Correct price prediction!');
        // Add to price prediction system
        addPricePrediction({
          productId: currentGame.productId,
          productName: currentGame.productName,
          currentPrice: currentGame.currentPrice,
          predictedDrop: 15, // Mock prediction
          confidence: 75,
          predictedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        });
      }

      // Reset for next game after 3 seconds
      setTimeout(() => {
        setCurrentGame(null);
        setSelectedAnswer(null);
        setShowResult(false);
      }, 3000);
    }, 1500);
  };

  const getAccuracyRate = () => {
    const completedGames = gameHistory.filter(g => g.status === 'completed');
    const correctPredictions = completedGames.filter(g => g.userPrediction === g.correctAnswer);
    return completedGames.length > 0 ? Math.round((correctPredictions.length / completedGames.length) * 100) : 0;
  };

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🎯 Predictive Shopping Game
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Predict price trends, earn points!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right">
          <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {getAccuracyRate()}%
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Accuracy
          </p>
        </div>
      </div>

      {/* Current Game */}
      {currentGame && currentGame.status === 'active' && (
        <div className="mb-6">
          {/* Timer */}
          <div className={`p-3 rounded-xl mb-4 text-center ${isDark ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className={`text-sm font-bold ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
              Time left to predict
            </p>
          </div>

          {/* Question */}
          <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h4 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {currentGame.productName}
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Current Price: ₹{currentGame.currentPrice.toLocaleString()}
            </p>
            <p className={`text-lg font-medium mt-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {currentGame.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentGame.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handlePrediction(option.id)}
                disabled={!!selectedAnswer}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedAnswer === option.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : selectedAnswer
                      ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50'
                      : `${isDark ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-50 hover:bg-gray-100'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.text}</span>
                  {selectedAnswer === option.id && (
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Points Indicator */}
          <div className={`mt-4 p-3 rounded-xl text-center ${isDark ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm ${isDark ? 'text-green-200' : 'text-green-700'}`}>
              🎁 Correct prediction = {currentGame.points} points + Smart Buyer badge progress!
            </p>
          </div>
        </div>
      )}

      {/* Game Result */}
      {showResult && currentGame && (
        <div className={`p-6 rounded-xl mb-6 text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          {currentGame.userPrediction === currentGame.correctAnswer ? (
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                🎉 Correct Prediction!
              </h4>
              <p className="text-green-600 dark:text-green-400 font-bold">
                +{currentGame.points} points earned!
              </p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                😅 Better luck next time!
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Keep predicting to improve your accuracy!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Game History */}
      {gameHistory.length > 0 && (
        <div>
          <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📊 Recent Predictions
          </h4>
          <div className="space-y-2">
            {gameHistory.slice(0, 5).map((game) => (
              <div key={game.id} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {game.productName}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {game.question.substring(0, 50)}...
                    </p>
                  </div>
                  <div className="text-right">
                    {game.status === 'completed' && (
                      <div className="flex items-center gap-1">
                        {game.userPrediction === game.correctAnswer ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-xs font-bold ${
                          game.userPrediction === game.correctAnswer
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {game.points > 0 ? `+${game.points}` : '0'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Active Game */}
      {!currentGame && (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            New prediction game coming soon! Check back tomorrow.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className={`mt-4 p-3 rounded-xl text-center ${isDark ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
        <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
          🧠 AI analyzes market trends to create prediction challenges
        </p>
      </div>
    </div>
  );
}