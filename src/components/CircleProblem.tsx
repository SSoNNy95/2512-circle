import React from 'react';
import { RADIUS } from '../utils/circleUtils';

interface CircleProblemProps {
  radius: number;
  diameter?: number;
  pi: number;
  problemNumber: number;
  answer: string;
  onAnswerChange: (answer: string) => void;
}

const CircleProblem: React.FC<CircleProblemProps> = ({
  radius,
  diameter,
  pi,
  problemNumber,
  answer,
  onAnswerChange,
}) => {
  const displayRadius = diameter ? diameter / 2 : radius;
  
  // 문제 번호에 따라 고정된 원 크기 설정
  const fixedRadii = {
    1: 120,  // 1번 문제: 가장 작은 원
    2: 160,  // 2번 문제: 중간 크기 원
    3: 200,  // 3번 문제: 가장 큰 원 (현재 크기)
  };
  
  const svgRadius = fixedRadii[problemNumber as keyof typeof fixedRadii] || 200;
  const svgSize = (svgRadius + 60) * 2; // 여백 증가
  
  // 파스텔 톤 색상 팔레트
  const pastelColors = {
    fill: ['#FFE5F1', '#E5F3FF', '#E5FFE5'], // 핑크, 블루, 그린
    stroke: ['#FFB6D9', '#B6D9FF', '#B6FFB6'], // 더 진한 파스텔
  };
  
  const fillColor = pastelColors.fill[problemNumber - 1] || '#FFE5F1';
  const strokeColor = pastelColors.stroke[problemNumber - 1] || '#FFB6D9';

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* 원 그리기 */}
        <div className="flex-shrink-0">
          <svg
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            className="border-2 border-gray-200 rounded-lg bg-white shadow-md"
          >
            {/* 원 (파스텔 톤 채우기) */}
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={svgRadius}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* 반지름 선 */}
            <line
              x1={svgSize / 2}
              y1={svgSize / 2}
              x2={svgSize / 2}
              y2={svgSize / 2 - svgRadius}
              stroke="#10b981"
              strokeWidth="4"
              markerEnd="url(#arrowhead)"
            />
            {/* 반지름 길이 표시 (더 명확하게) */}
            <g>
              <rect
                x={svgSize / 2 + 15}
                y={svgSize / 2 - svgRadius / 2 - 12}
                width="50"
                height="24"
                fill="white"
                stroke="#10b981"
                strokeWidth="2"
                rx="4"
                opacity="0.9"
              />
              <text
                x={svgSize / 2 + 40}
                y={svgSize / 2 - svgRadius / 2 + 4}
                fill="#10b981"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
              >
                {displayRadius}cm
              </text>
            </g>
            {/* 중심점 */}
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r="4"
              fill="#333"
            />
            {/* 화살표 마커 정의 */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* 문제 설명 */}
        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-800 mb-2">
            문제 {problemNumber}
          </h4>
          <p className="text-gray-700 mb-4">
            {diameter ? (
              <>지름이 {diameter}cm, 원주율이 {pi}인 원의 넓이를 구하세요.</>
            ) : (
              <>반지름이 {radius}cm, 원주율이 {pi}인 원의 넓이를 구하세요.</>
            )}
          </p>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              답: (단위: cm²)
            </label>
            <input
              type="number"
              step="0.01"
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-lg"
              placeholder="답을 입력하세요"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleProblem;

