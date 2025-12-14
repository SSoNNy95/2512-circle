import React, { useMemo } from 'react';
import { getSectorPath, RADIUS, CENTER_X, CENTER_Y } from '../utils/circleUtils';
import { useDraggable } from '@dnd-kit/core';

function DraggableSector({ 
  sector, 
  isAnimating,
  enableRotation = false,
  onSectorRotate
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: sector.id,
    data: sector,
  });

  // dnd-kit은 HTMLElement를 기대하지만 우리는 SVG <g>를 쓰므로 캐스팅 후 전달
  const setSvgNodeRef = (node) => setNodeRef(node);

  const path = getSectorPath(sector);
  const x = transform ? sector.x + transform.x : sector.x;
  const y = transform ? sector.y + transform.y : sector.y;
  const handleDoubleClick = (e) => {
    if (enableRotation && onSectorRotate) {
      e.stopPropagation();
      // 90도씩 회전
      const newRotation = sector.rotation + Math.PI / 2;
      onSectorRotate(sector.id, newRotation);
    }
  };
  const handleClick = (e) => {
    if (!enableRotation || !onSectorRotate) return;
    if (e.detail > 1) return; // 더블클릭 회전과 중복 방지
    e.stopPropagation();
    // 한 번 클릭마다 약 10도 회전
    const step = (10 * Math.PI) / 180;
    const newRotation = sector.rotation + step;
    onSectorRotate(sector.id, newRotation);
  };
  const rotationDeg = (sector.rotation * 180) / Math.PI;
  const transformAttr = `translate(${x} ${y}) rotate(${rotationDeg})`;

  return (
    <g
      ref={setSvgNodeRef}
      transform={transformAttr}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : `transform ${isAnimating ? 0.8 : 0.45}s ease`,
      }}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <path
        d={path}
        fill={sector.color}
        stroke={sector.strokeColor || "#333"}
        strokeWidth="2"
        filter="url(#shadow)"
        opacity={isDragging ? 0.7 : 0.9}
        style={{ transition: 'opacity 0.2s ease' }}
      />
      {enableRotation && (
        <circle
          cx={0}
          cy={-RADIUS * 0.7}
          r="8"
          fill="white"
          stroke="#333"
          strokeWidth="2"
          style={{ pointerEvents: 'none', opacity: 0.8 }}
        >
          <title>더블클릭하여 회전</title>
        </circle>
      )}
    </g>
  );
}

const CircleVisualization = ({ 
  sectors, 
  isAnimating,
  showMeasurements = false,
  measurements,
  enableRotation = false,
  onSectorRotate,
  layoutMode = 'circle',
  showCircle = false,
  showMeasurementLabels = false,
  showColoredBackground = true,
  showRectangleOnly = false,
  showSideBySide = false,
}) => {
  const minX = sectors.length > 0 ? Math.min(...sectors.map(s => s.x)) : 0;
  const maxX = sectors.length > 0 ? Math.max(...sectors.map(s => s.x)) : 0;
  const minY = sectors.length > 0 ? Math.min(...sectors.map(s => s.y)) : 0;
  const maxY = sectors.length > 0 ? Math.max(...sectors.map(s => s.y)) : 0;
  const rectGuide = useMemo(() => {
    if (layoutMode !== 'rectangle' && !showRectangleOnly) return null;
    
    // 조각이 있으면 조각 위치 기반으로, 없으면 원주/2 × 반지름 크기로 계산
    if (sectors.length > 0) {
      // 실제 조각들의 위치를 기반으로 계산
      const minX = Math.min(...sectors.map(s => s.x));
      const maxX = Math.max(...sectors.map(s => s.x));
      const minY = Math.min(...sectors.map(s => s.y));
      
      const totalWidth = maxX - minX;
      const padding = RADIUS * 0.5; // 여백
      const width = totalWidth + padding * 2;
      const height = RADIUS * 2 + padding * 2;
      const x = minX - padding;
      const y = minY - padding;
      
      return { x, y, width, height, totalWidth };
    } else {
      // 조각이 없을 때: 가로 = 원주의 절반 (π × RADIUS), 세로 = 반지름 (RADIUS)
      const width = Math.PI * RADIUS;
      const height = RADIUS;
      
      // 나란히 배치 모드일 때는 오른쪽에 배치하고 크기를 줄임
      let x, y, displayWidth, displayHeight;
      if (showSideBySide) {
        // 원이 왼쪽에 있으므로 직사각형은 오른쪽에 배치
        // 원의 중심이 약 200, 직사각형 중심이 약 600
        // 크기를 0.7배로 줄임
        displayWidth = width * 0.7;
        displayHeight = height * 0.7;
        x = 600 - displayWidth / 2;
        y = CENTER_Y - displayHeight / 2;
      } else {
        displayWidth = width;
        displayHeight = height;
        x = CENTER_X - width / 2;
        y = CENTER_Y - height / 2;
      }
      
      return { x, y, width: displayWidth, height: displayHeight, totalWidth: displayWidth };
    }
  }, [layoutMode, sectors, showRectangleOnly, showSideBySide]);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      className="border-2 border-gray-300 rounded-lg bg-white shadow-lg w-full h-auto max-h-[600px]"
      style={{ touchAction: 'none' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
        </marker>
        <marker
          id="arrowhead-right"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#333" />
        </marker>
      </defs>
      
      {showCircle && (sectors.length === 0 || showRectangleOnly) && (
        <g>
          {/* 원의 위치: 나란히 배치 모드일 때는 왼쪽에, 아니면 중앙에 */}
          {(() => {
            const circleCenterX = showSideBySide ? 200 : CENTER_X;
            const circleCenterY = CENTER_Y;
            // 나란히 배치 모드일 때 크기를 0.7배로 줄임
            const displayRadius = showSideBySide ? RADIUS * 0.7 : RADIUS;
            
            return (
              <>
                {/* 원의 둘레 - 왼쪽 절반 (빨강) */}
                <path
                  d={`M ${circleCenterX} ${circleCenterY - displayRadius} A ${displayRadius} ${displayRadius} 0 0 0 ${circleCenterX} ${circleCenterY + displayRadius}`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                />
                {/* 원의 둘레 - 오른쪽 절반 (파랑) */}
                <path
                  d={`M ${circleCenterX} ${circleCenterY - displayRadius} A ${displayRadius} ${displayRadius} 0 0 1 ${circleCenterX} ${circleCenterY + displayRadius}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                />
                {/* 중심에서 반지름까지의 선 (초록색 굵게) */}
                <line
                  x1={circleCenterX}
                  y1={circleCenterY}
                  x2={circleCenterX}
                  y2={circleCenterY - displayRadius}
                  stroke="#10b981"
                  strokeWidth="4"
                />
              </>
            );
          })()}
        </g>
      )}
      
      {rectGuide && (
        <g>
          {showColoredBackground ? (
            <>
              {/* 가로 배경 - 왼쪽 절반 (빨강, 원주의 절반) */}
              <rect
                x={rectGuide.x}
                y={rectGuide.y}
                width={rectGuide.totalWidth / 2}
                height={rectGuide.height}
                fill="#fee2e2"
                opacity={0.6}
              />
              {/* 가로 배경 - 오른쪽 절반 (파랑, 원주의 절반) */}
              <rect
                x={rectGuide.x + rectGuide.totalWidth / 2}
                y={rectGuide.y}
                width={rectGuide.totalWidth / 2}
                height={rectGuide.height}
                fill="#dbeafe"
                opacity={0.6}
              />
              {/* 세로 배경 (반지름) - 전체 높이에 초록색 테두리 */}
              <rect
                x={rectGuide.x}
                y={rectGuide.y}
                width={rectGuide.width}
                height={rectGuide.height}
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                rx={12}
                opacity={0.7}
              />
            </>
          ) : (
            /* 흰색 배경 */
            <rect
              x={rectGuide.x}
              y={rectGuide.y}
              width={rectGuide.width}
              height={rectGuide.height}
              fill="white"
              rx={12}
            />
          )}
          {/* 조각이 없을 때는 직사각형을 명확하게 표시 - 선분별 색상 */}
          {sectors.length === 0 && (
            <g>
              {/* 배경 */}
              <rect
                x={rectGuide.x}
                y={rectGuide.y}
                width={rectGuide.width}
                height={rectGuide.height}
                fill="#f3f4f6"
                rx={12}
              />
              {/* 윗 가로 선분 (빨강) */}
              <line
                x1={rectGuide.x}
                y1={rectGuide.y}
                x2={rectGuide.x + rectGuide.width}
                y2={rectGuide.y}
                stroke="#ef4444"
                strokeWidth="4"
              />
              {/* 아랫 가로 선분 (파랑) */}
              <line
                x1={rectGuide.x}
                y1={rectGuide.y + rectGuide.height}
                x2={rectGuide.x + rectGuide.width}
                y2={rectGuide.y + rectGuide.height}
                stroke="#3b82f6"
                strokeWidth="4"
              />
              {/* 왼쪽 세로 선분 (초록) */}
              <line
                x1={rectGuide.x}
                y1={rectGuide.y}
                x2={rectGuide.x}
                y2={rectGuide.y + rectGuide.height}
                stroke="#10b981"
                strokeWidth="4"
              />
              {/* 오른쪽 세로 선분 (초록) */}
              <line
                x1={rectGuide.x + rectGuide.width}
                y1={rectGuide.y}
                x2={rectGuide.x + rectGuide.width}
                y2={rectGuide.y + rectGuide.height}
                stroke="#10b981"
                strokeWidth="4"
              />
            </g>
          )}
          {/* 가이드라인 */}
          <rect
            x={rectGuide.x}
            y={rectGuide.y}
            width={rectGuide.width}
            height={rectGuide.height}
            rx={12}
            fill="none"
            stroke="#cbd5e1"
            strokeDasharray="10 6"
            strokeWidth="2"
          />
        </g>
      )}
      
      {showMeasurements && measurements && measurements.width > 0 && (
        <g>
          {/* 가로 측정선 */}
          <line
            x1={minX}
            y1={minY - 20}
            x2={maxX}
            y2={minY - 20}
            stroke="#3b82f6"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead)"
          />
          <text
            x={(minX + maxX) / 2}
            y={minY - 30}
            textAnchor="middle"
            fill="#3b82f6"
            fontSize="16"
            fontWeight="bold"
          >
            가로: {measurements.width.toFixed(1)}px
            {showMeasurementLabels && ' (원주의 절반)'}
          </text>

          {/* 세로 측정선 */}
          <line
            x1={maxX + 20}
            y1={minY}
            x2={maxX + 20}
            y2={maxY}
            stroke="#10b981"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead)"
          />
          <text
            x={maxX + 35}
            y={(minY + maxY) / 2}
            textAnchor="middle"
            fill="#10b981"
            fontSize="16"
            fontWeight="bold"
            transform={`rotate(-90 ${maxX + 35} ${(minY + maxY) / 2})`}
          >
            세로: {measurements.height.toFixed(1)}px
            {showMeasurementLabels && ' (반지름)'}
          </text>
        </g>
      )}
      
      {/* 조각이 있을 때만 렌더링 */}
      {!showRectangleOnly && sectors.length > 0 && sectors.map((sector) => (
        <DraggableSector
          key={sector.id}
          sector={sector}
          isAnimating={isAnimating}
          enableRotation={enableRotation}
          onSectorRotate={onSectorRotate}
        />
      ))}
      
      {/* 직사각형만 표시하는 경우 */}
      {showRectangleOnly && rectGuide && (
        <g>
          {/* 배경 */}
          <rect
            x={rectGuide.x}
            y={rectGuide.y}
            width={rectGuide.width}
            height={rectGuide.height}
            fill="white"
            rx={12}
          />
          {/* 윗 가로 선분 (빨강) */}
          <line
            x1={rectGuide.x}
            y1={rectGuide.y}
            x2={rectGuide.x + rectGuide.width}
            y2={rectGuide.y}
            stroke="#ef4444"
            strokeWidth="4"
          />
          {/* 아랫 가로 선분 (파랑) */}
          <line
            x1={rectGuide.x}
            y1={rectGuide.y + rectGuide.height}
            x2={rectGuide.x + rectGuide.width}
            y2={rectGuide.y + rectGuide.height}
            stroke="#3b82f6"
            strokeWidth="4"
          />
          {/* 왼쪽 세로 선분 (초록) */}
          <line
            x1={rectGuide.x}
            y1={rectGuide.y}
            x2={rectGuide.x}
            y2={rectGuide.y + rectGuide.height}
            stroke="#10b981"
            strokeWidth="4"
          />
          {/* 오른쪽 세로 선분 (초록) */}
          <line
            x1={rectGuide.x + rectGuide.width}
            y1={rectGuide.y}
            x2={rectGuide.x + rectGuide.width}
            y2={rectGuide.y + rectGuide.height}
            stroke="#10b981"
            strokeWidth="4"
          />
        </g>
      )}
      
      {/* 원과 직사각형 사이 화살표 (나란히 배치 모드일 때) - 원에서 직사각형으로 */}
      {showSideBySide && showCircle && showRectangleOnly && rectGuide && (
        <g>
          {/* 화살표 선 - 원에서 직사각형으로 */}
          <line
            x1={200 + RADIUS * 0.7}
            y1={CENTER_Y}
            x2={rectGuide.x - 20}
            y2={CENTER_Y}
            stroke="#333"
            strokeWidth="3"
            markerEnd="url(#arrowhead-right)"
          />
        </g>
      )}
    </svg>
  );
};

export default CircleVisualization;

