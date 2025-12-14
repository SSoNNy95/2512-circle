import React, { useState } from 'react';

const HiddenText = ({ text, id, revealed, onReveal }) => {
  const handleClick = () => {
    if (!revealed) {
      onReveal(id);
    }
  };

  if (revealed) {
    return <span className="text-blue-600 font-semibold">{text}</span>;
  }

  return (
    <span
      onClick={handleClick}
      className="inline-block bg-gray-300 text-gray-300 px-2 py-1 rounded cursor-pointer hover:bg-gray-400 transition-colors select-none"
      style={{ minWidth: '60px', textAlign: 'center' }}
    >
      {text}
    </span>
  );
};

const FormulaDisplay = ({ type }) => {
  const [revealedIds, setRevealedIds] = useState(new Set());

  const handleReveal = (id) => {
    setRevealedIds(prev => new Set(prev).add(id));
  };

  if (type === 'dimensions') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-3">
        <h3 className="text-xl font-bold text-gray-800 mb-4">가로, 세로 구하기</h3>
        <div className="space-y-2 text-lg">
          <div className="flex items-center gap-2 flex-wrap">
            <span>가로 =</span>
            <HiddenText text="원주×1/2" id="width1" revealed={revealedIds.has('width1')} onReveal={handleReveal} />
            <span> =</span>
            <HiddenText text="원주율×지름×1/2" id="width2" revealed={revealedIds.has('width2')} onReveal={handleReveal} />
            <span> =</span>
            <HiddenText text="원주율×반지름" id="width3" revealed={revealedIds.has('width3')} onReveal={handleReveal} />
          </div>
          <div className="flex items-center gap-2">
            <span>세로 =</span>
            <HiddenText text="반지름" id="height" revealed={revealedIds.has('height')} onReveal={handleReveal} />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'area') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-3">
        <h3 className="text-xl font-bold text-gray-800 mb-4">원의 넓이 구하기</h3>
        <div className="space-y-2 text-lg">
          <div className="flex items-center gap-2">
            <span>원의 넓이 = 직사각형의 넓이</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="ml-8">= 가로 × 세로</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="ml-8">=</span>
            <HiddenText text="원주×1/2" id="area1" revealed={revealedIds.has('area1')} onReveal={handleReveal} />
            <span>×</span>
            <HiddenText text="반지름" id="area2" revealed={revealedIds.has('area2')} onReveal={handleReveal} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="ml-8">=</span>
            <HiddenText text="원주율×지름×1/2" id="area3" revealed={revealedIds.has('area3')} onReveal={handleReveal} />
            <span>×</span>
            <HiddenText text="반지름" id="area4" revealed={revealedIds.has('area4')} onReveal={handleReveal} />
          </div>
          <div className="flex items-center gap-2">
            <span className="ml-8">=</span>
            <HiddenText text="원주율×반지름×반지름" id="area5" revealed={revealedIds.has('area5')} onReveal={handleReveal} />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FormulaDisplay;

