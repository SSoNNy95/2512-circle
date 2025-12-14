import React, { useState } from 'react';
import { RADIUS } from '../utils/circleUtils';

const CircleProblem = ({
  radius,
  diameter,
  pi,
  problemNumber,
  answer,
  correctAnswer,
  onAnswerChange,
}) => {
  const displayRadius = diameter ? diameter / 2 : radius;
  const [hintLevel, setHintLevel] = useState(0);
  
  // 정답 체크
  const userAnswer = parseFloat(answer);
  const isCorrect = answer !== '' && !isNaN(userAnswer) && Math.abs(userAnswer - correctAnswer) < 0.1;
  const hasAnswer = answer !== '' && !isNaN(userAnswer);
  
  // 힌트 내용
  const hint1 = '원의 넓이=반지름X반지름X원주율';
  const hints2 = {
    1: '원의 넓이=반지름X반지름X원주율=3X3X3',
    2: '원의 넓이=반지름X반지름X원주율=4X4X3.1',
    3: '원의 넓이=반지름X반지름X원주율=10X10X3.14',
  };
  
  // 문제 번호에 따라 고정된 원 크기 설정
  const fixedRadii = {
    1: 120,  // 1번 문제: 가장 작은 원
    2: 160,  // 2번 문제: 중간 크기 원
    3: 200,  // 3번 문제: 가장 큰 원 (현재 크기)
  };
  
  const svgRadius = fixedRadii[problemNumber] || 200;
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
            {/* 2번 문제는 지름 표시, 그 외는 반지름 표시 */}
            {problemNumber === 2 && diameter ? (
              <>
                {/* 지름 선 */}
                <line
                  x1={svgSize / 2 - svgRadius}
                  y1={svgSize / 2}
                  x2={svgSize / 2 + svgRadius}
                  y2={svgSize / 2}
                  stroke="#10b981"
                  strokeWidth="4"
                  markerStart="url(#arrowhead-start)"
                  markerEnd="url(#arrowhead)"
                />
                {/* 지름 길이 표시 */}
                <g>
                  <rect
                    x={svgSize / 2 - 30}
                    y={svgSize / 2 + 20}
                    width="60"
                    height="24"
                    fill="white"
                    stroke="#10b981"
                    strokeWidth="2"
                    rx="4"
                    opacity="0.9"
                  />
                  <text
                    x={svgSize / 2}
                    y={svgSize / 2 + 36}
                    fill="#10b981"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {diameter}cm
                  </text>
                </g>
              </>
            ) : (
              <>
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
                {/* 반지름 길이 표시 */}
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
              </>
            )}
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
              <marker
                id="arrowhead-start"
                markerWidth="10"
                markerHeight="10"
                refX="1"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon points="10 0, 0 3, 10 6" fill="#10b981" />
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
              onChange={(e) => {
                onAnswerChange(e.target.value);
                setHintLevel(0); // 답이 변경되면 힌트 초기화
              }}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-lg ${
                isCorrect ? 'border-green-500 bg-green-50' : hasAnswer && !isCorrect ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="답을 입력하세요"
            />
            {hasAnswer && (
              <div className="mt-2">
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <span className="text-xl">✓</span>
                    <span>정답입니다!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-600 font-semibold">
                      <span className="text-xl">✗</span>
                      <span>다시 생각해보세요</span>
                    </div>
                    {hintLevel >= 1 && (
                      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mt-2">
                        <div className="text-sm font-semibold text-yellow-800 mb-1">💡 힌트</div>
                        <div className="text-yellow-700">{hint1}</div>
                      </div>
                    )}
                    {hintLevel >= 2 && (
                      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mt-2">
                        <div className="text-sm font-semibold text-blue-800 mb-1">💡 더 자세한 힌트</div>
                        <div className="text-blue-700">{hints2[problemNumber]}</div>
                      </div>
                    )}
                    {hintLevel < 2 && (
                      <button
                        onClick={() => setHintLevel(hintLevel === 0 ? 1 : 2)}
                        className="mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        {hintLevel === 0 ? '1차 힌트 보기' : '2차 힌트 보기'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleProblem;

