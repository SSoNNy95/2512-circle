import React, { useState, useEffect } from 'react';
import { Sector } from '../types';
import { generateSectors, calculateOptimalLayout } from '../utils/circleUtils';
import CircleVisualization from '../components/CircleVisualization';
import FormulaDisplay from '../components/FormulaDisplay';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { motion } from 'framer-motion';

interface DerivePageProps {
  onNext: () => void;
  onPrev: () => void;
}

const DerivePage: React.FC<DerivePageProps> = ({ onNext, onPrev }) => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'circle' | 'rectangle'>('circle');
  const [showCircle, setShowCircle] = useState(true);
  const [showDimensionsFormula, setShowDimensionsFormula] = useState(false);
  const [showAreaFormula, setShowAreaFormula] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    // 3단계에서는 초기 상태를 원으로 표시
    if (showCircle) {
      setSectors([]);
      setLayoutMode('circle');
    }
  }, [showCircle]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const sectorId = active.id as string;
    const sector = sectors.find(s => s.id === sectorId);

    if (!sector) return;

    const newX = sector.x + delta.x;
    const newY = sector.y + delta.y;

    const updatedSectors = sectors.map(s =>
      s.id === sectorId ? { ...s, x: newX, y: newY } : s
    );

    setSectors(updatedSectors);
  };

  const handleReset = () => {
    setIsAnimating(true);
    setLayoutMode('circle');
    setShowCircle(true);
    setSectors([]);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  const handleCircleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowCircle(false);
    // 조각을 생성하지 않고 직사각형 모드만 활성화
    setSectors([]);
    setLayoutMode('rectangle');
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            3단계: 공식 도출 모드
          </h1>
          <p className="text-lg text-white/90 drop-shadow">
            측정을 통해 원의 넓이 공식을 도출해보세요!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">학습 단계</h2>
              <div className="space-y-2">
                <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                  <div className="font-semibold">1단계: 탐구 ✓</div>
                  <div className="text-sm opacity-90">완료</div>
                </div>
                <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                  <div className="font-semibold">2단계: 발견 ✓</div>
                  <div className="text-sm opacity-90">완료</div>
                </div>
                <div className="p-3 bg-primary-500 text-white rounded-lg shadow-md">
                  <div className="font-semibold">3단계: 공식 도출</div>
                  <div className="text-sm opacity-90">측정을 통해 공식을 도출해보세요</div>
                </div>
                <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                  <div className="font-semibold">4단계: 적용</div>
                  <div className="text-sm">실제 사물에 공식을 적용해보세요</div>
                </div>
              </div>
            </div>

            {showCircle && (
              <button
                onClick={handleCircleClick}
                disabled={isAnimating}
                className="w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                원을 직사각형으로 변환
              </button>
            )}

            {!showCircle && (
              <>
                <button
                  onClick={() => setShowDimensionsFormula(!showDimensionsFormula)}
                  className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
                >
                  📏 가로, 세로 구하기
                </button>
                <button
                  onClick={() => setShowAreaFormula(!showAreaFormula)}
                  className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
                >
                  📐 원의 넓이 구하기
                </button>
                <button
                  onClick={handleReset}
                  disabled={isAnimating}
                  className="w-full px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔄 원래대로
                </button>
              </>
            )}

            {showDimensionsFormula && (
              <FormulaDisplay type="dimensions" />
            )}

            {showAreaFormula && (
              <FormulaDisplay type="area" />
            )}

            <div className="flex gap-2">
              <button
                onClick={onPrev}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                ← 이전 단계
              </button>
              <button
                onClick={onNext}
                className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
              >
                다음 단계 →
              </button>
            </div>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
              <div className="w-full aspect-[4/3] max-h-[600px]">
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                  <CircleVisualization 
                    sectors={sectors} 
                    isAnimating={isAnimating}
                    showMeasurements={false}
                    enableRotation={false}
                    layoutMode={layoutMode}
                    showCircle={showCircle}
                  />
                </DndContext>
              </div>
            </div>

            <div className="mt-4 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-sm text-gray-600 text-center">
                {showCircle 
                  ? '💡 원을 무수히 많이 나누어 배열을 하면 직사각형이 됩니다!'
                  : '💡 원을 무수히 많이 나누어 배열을 하면 직사각형이 됩니다!'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DerivePage;

