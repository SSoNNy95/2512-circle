import React, { useState, useEffect } from 'react';
import { generateSectors, calculateOptimalLayout } from '../utils/circleUtils';
import SectorSlider from '../components/SectorSlider';
import CircleVisualization from '../components/CircleVisualization';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { motion } from 'framer-motion';

const DiscoverPage = ({ onNext, onPrev }) => {
  const [sectorCount, setSectorCount] = useState(8);
  const [sectors, setSectors] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [layoutMode, setLayoutMode] = useState('circle');
  const [questionAnswer, setQuestionAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const newSectors = generateSectors(sectorCount);
    setSectors(newSectors);
    setLayoutMode('circle');
  }, [sectorCount]);

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const sectorId = active.id;
    const sector = sectors.find(s => s.id === sectorId);

    if (!sector) return;

    const newX = sector.x + delta.x;
    const newY = sector.y + delta.y;

    const updatedSectors = sectors.map(s =>
      s.id === sectorId ? { ...s, x: newX, y: newY } : s
    );

    setSectors(updatedSectors);
  };

  const handleOptimalLayout = () => {
    setIsAnimating(true);
    setLayoutMode('rectangle');
    const optimalSectors = calculateOptimalLayout(sectors, true, true); // 색상 유지, 화면에 맞추기
    setSectors(optimalSectors);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  const handleReset = () => {
    setIsAnimating(true);
    setLayoutMode('circle');
    const newSectors = generateSectors(sectorCount);
    setSectors(newSectors);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  const handleSectorRotate = (sectorId, rotation) => {
    const updatedSectors = sectors.map(s =>
      s.id === sectorId ? { ...s, rotation } : s
    );
    setSectors(updatedSectors);
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
            2단계: 발견 모드
          </h1>
          <p className="text-lg text-white/90 drop-shadow">
            최적 배열을 통해 패턴을 발견해보세요!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">학습 단계</h2>
              <div className="space-y-2">
                <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                  <div className="font-semibold">1단계: 탐색 ✓</div>
                  <div className="text-sm opacity-90">완료</div>
                </div>
                <div className="p-3 bg-primary-500 text-white rounded-lg shadow-md">
                  <div className="font-semibold">2단계: 발견</div>
                  <div className="text-sm opacity-90">최적 배열을 통해 패턴을 발견해보세요</div>
                </div>
                <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                  <div className="font-semibold">3단계: 공식 도출</div>
                  <div className="text-sm">측정을 통해 공식을 도출해보세요</div>
                </div>
                <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                  <div className="font-semibold">4단계: 적용</div>
                  <div className="text-sm">공식을 적용해 보세요</div>
                </div>
              </div>
            </div>

            <SectorSlider
              sectorCount={sectorCount}
              onSectorCountChange={setSectorCount}
            />

            <div className="space-y-4">
              <button
                onClick={handleOptimalLayout}
                disabled={isAnimating}
                className="w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                ✨ 최적 배열 보기
              </button>

              <button
                onClick={handleReset}
                disabled={isAnimating}
                className="w-full px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 원래대로
              </button>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">🤔 탐구 질문</h4>
              <p className="text-sm text-yellow-700 mb-3">
                분할 수를 늘릴수록 어떤 모양에 가까워지나요?
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={questionAnswer}
                  onChange={(e) => {
                    setQuestionAnswer(e.target.value);
                    setIsSubmitted(false);
                  }}
                  disabled={isSubmitted}
                  className="w-full px-3 py-2 border-2 border-yellow-400 rounded-lg focus:border-yellow-500 focus:outline-none text-sm disabled:bg-gray-100"
                  placeholder="답을 입력하세요"
                />
                <button
                  onClick={() => setIsSubmitted(true)}
                  disabled={questionAnswer.trim() === '' || isSubmitted}
                  className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  답변 제출
                </button>
                {isSubmitted && (
                  <div className="mt-2">
                    {questionAnswer.trim().toLowerCase().includes('직사각형') ? (
                      <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                        <span className="text-lg">✓</span>
                        <span>정답입니다!</span>
                      </div>
                    ) : (
                      <div className="text-red-600 text-sm">
                        <div className="mb-1">분할 수를 늘릴수록 직사각형에 가까워집니다.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

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
                    enableRotation={true}
                    onSectorRotate={handleSectorRotate}
                    layoutMode={layoutMode}
                    showColoredBackground={false}
                  />
                </DndContext>
              </div>
            </div>

            <div className="mt-4 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-sm text-gray-600 text-center">
                💡 "최적 배열 보기" 버튼을 눌러 조각들이 어떻게 배열되는지 관찰해보세요! 조각을 더블클릭하면 회전할 수 있어요! 🔄
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;

