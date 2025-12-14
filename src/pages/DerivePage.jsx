import React, { useState, useEffect } from 'react';
import { generateSectors, calculateOptimalLayout, RADIUS, CENTER_X, CENTER_Y } from '../utils/circleUtils';
import CircleVisualization from '../components/CircleVisualization';
import FormulaDisplay from '../components/FormulaDisplay';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { motion } from 'framer-motion';

const DerivePage = ({ onNext, onPrev }) => {
  const [sectors, setSectors] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [layoutMode, setLayoutMode] = useState('circle');
  const [showCircle, setShowCircle] = useState(true);
  const [showDimensionsFormula, setShowDimensionsFormula] = useState(false);
  const [showAreaFormula, setShowAreaFormula] = useState(false);
  const [showRectangleOnly, setShowRectangleOnly] = useState(false);
  const [showSideBySide, setShowSideBySide] = useState(false);

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
    setLayoutMode('circle');
    setShowCircle(true);
    setSectors([]);
    setShowRectangleOnly(false);
    setShowSideBySide(false);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  const handleCircleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowRectangleOnly(false);
    
    // 초기 상태: 원을 표시하지 않고 시작
    setShowCircle(false);
    
    // 1단계 (0.8초): 원을 128조각으로 등분
    setTimeout(() => {
      const newSectors = generateSectors(128);
      setSectors(newSectors);
      setLayoutMode('circle');
    }, 800);
    
    // 2단계 (1.5초): 부채꼴을 위 아래로 배열 (색상 적용)
    setTimeout(() => {
      const newSectors = generateSectors(128);
      // 위아래로 배열하되, 아직 가로 길이 조정 전
      const arrangedSectors = calculateOptimalLayoutWithColors(newSectors);
      setSectors(arrangedSectors);
      setLayoutMode('rectangle');
    }, 1500);
    
    // 3단계 (2.5초): 위아래 부채꼴을 맞물려 모으기
    setTimeout(() => {
      // 현재 sectors의 색상을 유지하면서 위치만 조정
      setSectors(prevSectors => {
        if (prevSectors.length === 0) {
          const newSectors = generateSectors(128);
          const coloredSectors = calculateOptimalLayoutWithColors(newSectors);
          return calculateOptimalLayoutForRectangle(coloredSectors);
        }
        return calculateOptimalLayoutForRectangle(prevSectors);
      });
      setLayoutMode('rectangle');
    }, 2500);
    
    // 4단계 (3.5초): 직사각형만 나타내기
    setTimeout(() => {
      setShowRectangleOnly(true);
      setShowCircle(false);
      setShowSideBySide(false);
      setSectors([]); // 부채꼴 숨기기
    }, 3500);
    
    // 5단계 (5.5초 = 3.5초 + 2초): 원과 직사각형을 나란히 나타내기
    setTimeout(() => {
      setShowSideBySide(true);
      setShowCircle(true); // 원도 표시
      setShowRectangleOnly(true); // 직사각형도 표시
    }, 5500);
    
    // 애니메이션 완료
    setTimeout(() => {
      setIsAnimating(false);
    }, 6000);
  };
  
  // 위아래로 배열하면서 색상 적용하는 함수
  const calculateOptimalLayoutWithColors = (sectors) => {
    const count = sectors.length;
    if (count === 0) return sectors;
    
    const arcLength = RADIUS * (2 * Math.PI / count);
    let spacing = arcLength;
    
    const totalWidth = spacing * (count - 1);
    const startX = CENTER_X - totalWidth / 2;
    const upperY = CENTER_Y - RADIUS / 2;
    const lowerY = CENTER_Y + RADIUS / 2;
    
    return sectors.map((sector, index) => {
      const isEven = index % 2 === 0;
      const x = startX + index * spacing;
      const y = isEven ? upperY : lowerY;
      
      // 색상 설정
      // 위쪽: 호 빨간색, 내부 흰색
      // 아래쪽: 호 파란색, 내부 흰색
      // 반지름은 초록색이지만 부채꼴 자체에는 반지름 선이 없으므로 stroke로 처리
      const fillColor = 'white';
      const strokeColor = isEven ? '#ef4444' : '#3b82f6'; // 위쪽 빨강, 아래쪽 파랑
      
      return {
        ...sector,
        x,
        y,
        rotation: isEven ? 0 : Math.PI,
        color: fillColor,
        strokeColor: strokeColor, // 호 색상
      };
    });
  };
  
  // 가로가 원주의 절반(π × RADIUS), 세로가 반지름(RADIUS)인 직사각형으로 변환하는 함수
  // 아래쪽 부채꼴이 위쪽 부채꼴 사이로 들어가 빈틈 없이 맞물리도록 배치
  const calculateOptimalLayoutForRectangle = (sectors) => {
    const count = sectors.length;
    if (count === 0) return sectors;
    
    // 가로 = 원주의 절반 = π × RADIUS
    const targetWidth = Math.PI * RADIUS;
    // 세로 = 반지름 = RADIUS
    const targetHeight = RADIUS;
    
    // 각 부채꼴의 호 길이 (원주를 128로 나눈 값)
    const arcLength = RADIUS * (2 * Math.PI / count);
    // 전체 가로를 128개 부채꼴로 나눈 간격
    const spacing = targetWidth / count;
    
    const startX = CENTER_X - targetWidth / 2;
    // 위쪽 줄: y = CENTER_Y - RADIUS/2
    // 아래쪽 줄: y = CENTER_Y + RADIUS/2
    const upperY = CENTER_Y - targetHeight / 2;
    const lowerY = CENTER_Y + targetHeight / 2;
    
    return sectors.map((sector, index) => {
      const isEven = index % 2 === 0;
      
      // 색상 유지 (2단계에서 설정한 색상)
      const fillColor = sector.color || 'white';
      const strokeColor = sector.strokeColor || (isEven ? '#ef4444' : '#3b82f6');
      
      if (isEven) {
        // 위쪽 부채꼴: 짝수 인덱스
        // 위쪽 줄에 배치, 각 부채꼴의 호가 직선으로 펼쳐짐
        const upperIndex = index / 2;
        const x = startX + upperIndex * spacing * 2; // 위쪽 부채꼴은 2칸씩 간격
        return {
          ...sector,
          x,
          y: upperY,
          rotation: 0, // 정상 방향 (위쪽으로 향함)
          color: fillColor,
          strokeColor: strokeColor,
        };
      } else {
        // 아래쪽 부채꼴: 홀수 인덱스
        // 위쪽 부채꼴 사이의 중간 위치에 배치하여 맞물리게 함
        const lowerIndex = (index - 1) / 2;
        const x = startX + (lowerIndex * 2 + 1) * spacing; // 위쪽 부채꼴 사이의 중간
        return {
          ...sector,
          x,
          y: lowerY,
          rotation: Math.PI, // 180도 회전하여 아래쪽으로 향하게
          color: fillColor,
          strokeColor: strokeColor,
        };
      }
    });
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
                  <div className="font-semibold">1단계: 탐색 ✓</div>
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
                  <div className="text-sm">공식을 적용해 보세요</div>
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

            {(!showCircle || showSideBySide) && (
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
                    showRectangleOnly={showRectangleOnly}
                    showSideBySide={showSideBySide}
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

