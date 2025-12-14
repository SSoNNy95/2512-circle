import React, { useState, useEffect } from 'react';
import { generateSectors } from '../utils/circleUtils';
import SectorSlider from '../components/SectorSlider';
import CircleVisualization from '../components/CircleVisualization';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { motion } from 'framer-motion';

const ExplorePage = ({ onNext }) => {
  const [sectorCount, setSectorCount] = useState(8);
  const [sectors, setSectors] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handleReset = () => {
    setIsAnimating(true);
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
            1단계: 탐색 모드
          </h1>
          <p className="text-lg text-white/90 drop-shadow">
            원을 나누고 조각들을 자유롭게 배치해보세요!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">학습 단계</h2>
              <div className="space-y-2">
                <div className="p-3 bg-primary-500 text-white rounded-lg shadow-md">
                  <div className="font-semibold">1단계: 탐색</div>
                  <div className="text-sm opacity-90">원을 나누고 자유롭게 배치해보세요</div>
                </div>
                <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                  <div className="font-semibold">2단계: 발견</div>
                  <div className="text-sm">최적 배열을 통해 패턴을 발견해보세요</div>
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

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 힌트</h4>
              <p className="text-sm text-blue-700">
                원을 나눈 조각들을 위아래로 번갈아 배열해보세요. 
                어떤 모양이 만들어지나요?
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              🔄 처음부터
            </button>

            <button
              onClick={onNext}
              className="w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              다음 단계로 →
            </button>
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
                  />
                </DndContext>
              </div>
            </div>

            <div className="mt-4 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-sm text-gray-600 text-center">
                💡 조각을 드래그하여 자유롭게 이동시켜보세요! 클릭하면 10도씩 회전할 수 있어요! 🔄
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

