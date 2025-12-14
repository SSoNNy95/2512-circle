import React, { useRef, useState } from 'react';

const PhotoUpload = ({
  onPhotoUpload,
  onDiameterChange,
  diameter,
  calculatedArea,
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onPhotoUpload(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-xl font-bold text-gray-800">사진으로 원 측정하기</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            원 모양 사물 사진 업로드
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
        </div>

        {preview && (
          <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Uploaded"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            지름 측정 (cm)
          </label>
          <input
            type="number"
            value={diameter || ''}
            onChange={(e) => onDiameterChange(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="지름을 입력하세요"
          />
        </div>

        {diameter > 0 && (
          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
            <div className="text-sm text-gray-700 mb-2">
              <strong>계산된 넓이:</strong>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {calculatedArea.toFixed(2)} cm²
            </div>
            <div className="text-xs text-gray-600 mt-2">
              공식: π × 반지름² = 3.14 × ({diameter / 2}cm)²
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;

