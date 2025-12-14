import React from 'react';
import { RADIUS } from '../utils/circleUtils';

const MeasurementTool = ({ measurements, visible }) => {
  if (!visible || measurements.width === 0) return null;

  const circumference = 2 * Math.PI * RADIUS;
  const halfCircumference = circumference / 2;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">측정 결과</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">가로 길이</div>
            <div className="text-lg font-semibold text-blue-700">
              {measurements.width.toFixed(1)}px
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">원주의 절반</div>
            <div className="text-sm font-medium text-blue-600">
              ≈ {halfCircumference.toFixed(1)}px
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">세로 길이</div>
            <div className="text-lg font-semibold text-green-700">
              {measurements.height.toFixed(1)}px
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">반지름</div>
            <div className="text-sm font-medium text-green-600">
              = {RADIUS}px
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
          <div className="text-sm text-gray-700 mb-2">
            <strong>직사각형의 넓이</strong> = 가로 × 세로
          </div>
          <div className="text-base text-gray-800">
            = 원주의 절반 × 반지름
          </div>
          <div className="text-base text-gray-800 mt-1">
            = (원주 × 반지름) ÷ 2
          </div>
          <div className="text-lg font-bold text-primary-700 mt-2">
            = π × 반지름 × 반지름
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementTool;

