import React from 'react';

const SECTOR_OPTIONS = [4, 8, 16, 32, 64, 128];

const SectorSlider = ({
  sectorCount,
  onSectorCountChange,
  disabled = false,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <label className="block text-lg font-semibold mb-4 text-gray-800">
        원을 몇 개로 나눌까요?
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max={SECTOR_OPTIONS.length - 1}
          value={SECTOR_OPTIONS.indexOf(sectorCount)}
          onChange={(e) => {
            const index = parseInt(e.target.value);
            onSectorCountChange(SECTOR_OPTIONS[index]);
          }}
          disabled={disabled}
          className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #4ECDC4 0%, #4ECDC4 ${
              (SECTOR_OPTIONS.indexOf(sectorCount) / (SECTOR_OPTIONS.length - 1)) * 100
            }%, #e5e7eb ${(SECTOR_OPTIONS.indexOf(sectorCount) / (SECTOR_OPTIONS.length - 1)) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <span className="text-2xl font-bold text-primary-600 min-w-[80px] text-center">
          {sectorCount}개
        </span>
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        {SECTOR_OPTIONS.map((count) => (
          <button
            key={count}
            onClick={() => !disabled && onSectorCountChange(count)}
            disabled={disabled}
            className={`px-2 py-1 rounded ${
              sectorCount === count
                ? 'bg-primary-500 text-white font-bold'
                : 'hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectorSlider;

