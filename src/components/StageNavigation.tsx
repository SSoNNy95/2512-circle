import React from 'react';
import { LearningStage } from '../types';

interface StageNavigationProps {
  currentStage: LearningStage;
  onStageChange: (stage: LearningStage) => void;
  onReset: () => void;
}

const STAGES: { key: LearningStage; label: string; description: string }[] = [
  { key: 'explore', label: '1단계: 탐구', description: '원을 나누고 자유롭게 배치해보세요' },
  { key: 'discover', label: '2단계: 발견', description: '최적 배열을 통해 패턴을 발견해보세요' },
  { key: 'derive', label: '3단계: 공식 도출', description: '측정을 통해 공식을 도출해보세요' },
  { key: 'apply', label: '4단계: 적용', description: '실제 사물에 공식을 적용해보세요' },
];

const StageNavigation: React.FC<StageNavigationProps> = ({
  currentStage,
  onStageChange,
  onReset,
}) => {
  const currentIndex = STAGES.findIndex(s => s.key === currentStage);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">학습 단계</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
        >
          처음부터
        </button>
      </div>

      <div className="space-y-2">
        {STAGES.map((stage, index) => {
          const isActive = stage.key === currentStage;
          const isCompleted = index < currentIndex;
          const isAccessible = index <= currentIndex;

          return (
            <button
              key={stage.key}
              onClick={() => isAccessible && onStageChange(stage.key)}
              disabled={!isAccessible}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md'
                  : isCompleted
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : isAccessible
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{stage.label}</div>
                  <div className="text-sm opacity-90">{stage.description}</div>
                </div>
                {isCompleted && (
                  <span className="text-green-600 font-bold">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          {currentIndex > 0 && (
            <button
              onClick={() => onStageChange(STAGES[currentIndex - 1].key)}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              ← 이전 단계
            </button>
          )}
          {currentIndex < STAGES.length - 1 && (
            <button
              onClick={() => onStageChange(STAGES[currentIndex + 1].key)}
              className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              다음 단계 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StageNavigation;







