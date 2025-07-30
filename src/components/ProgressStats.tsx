import React, { useState, useEffect } from 'react';
import { getAllQuizProgress, QuizProgress } from '../utils/db';
import { writingSystems } from '../models/alphabets';

interface ProgressStatsProps {
  onClose: () => void;
}

function ProgressStats({ onClose }: ProgressStatsProps): React.ReactElement {
  const [progressData, setProgressData] = useState<QuizProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const allProgress = await getAllQuizProgress();
        setProgressData(allProgress);
      } catch (err) {
        console.error('Error loading progress:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const getWritingSystemName = (id: string) => {
    const system = writingSystems.find(ws => ws.id === id);
    return system ? system.name : id;
  };

  const totalQuestions = progressData.reduce((sum, p) => sum + p.totalQuestions, 0);
  const totalCorrect = progressData.reduce((sum, p) => sum + p.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const bestStreak = Math.max(...progressData.map(p => p.streak), 0);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Learning Progress</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {progressData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No quiz progress yet. Start learning to see your statistics!</p>
          </div>
        ) : (
          <>
            {/* Overall Statistics */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Overall Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalQuestions}</div>
                  <div className="text-sm opacity-90">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{overallAccuracy}%</div>
                  <div className="text-sm opacity-90">Overall Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{bestStreak}</div>
                  <div className="text-sm opacity-90">Best Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{progressData.length}</div>
                  <div className="text-sm opacity-90">Systems Studied</div>
                </div>
              </div>
            </div>

            {/* Per System Progress */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Progress by Writing System</h3>
              {progressData
                .sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime())
                .map((progress) => (
                  <div key={progress.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{getWritingSystemName(progress.id)}</h4>
                        <p className="text-sm text-gray-500">
                          Last practiced: {new Date(progress.lastPlayed).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">{progress.accuracy}%</div>
                        <div className="text-sm text-gray-500">Accuracy</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Questions:</span>
                        <span className="ml-1 font-medium">{progress.totalQuestions}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Best:</span>
                        <span className="ml-1 font-medium">{progress.bestAccuracy}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Streak:</span>
                        <span className="ml-1 font-medium">{progress.streak}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{progress.correctAnswers}/{progress.totalQuestions}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProgressStats;