import React, { useState } from 'react';

const GoogleFormIntegration = ({
  formData,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 실제 구글 폼 URL로 교체해야 합니다
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // 구글 폼에 데이터 제출
    // 실제 구현에서는 구글 폼의 entry ID를 사용하여 POST 요청을 보내야 합니다
    // 또는 iframe을 사용하여 폼을 임베드할 수 있습니다
    
    try {
      // 여기에 실제 구글 폼 제출 로직을 구현
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      onSubmit();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">✓</div>
        <div className="text-lg font-semibold text-green-800">
          제출이 완료되었습니다!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">학습 결과 제출</h3>
      
      <div className="space-y-3 mb-4 text-sm text-gray-700">
        <div><strong>단계:</strong> {formData.stage}</div>
        <div><strong>분할 수:</strong> {formData.sectorCount}개</div>
        {formData.measurements && (
          <>
            <div><strong>가로:</strong> {formData.measurements.width.toFixed(1)}px</div>
            <div><strong>세로:</strong> {formData.measurements.height.toFixed(1)}px</div>
          </>
        )}
        {formData.diameter && (
          <div><strong>지름:</strong> {formData.diameter}cm</div>
        )}
        {formData.calculatedArea && (
          <div><strong>넓이:</strong> {formData.calculatedArea.toFixed(2)}cm²</div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '제출 중...' : '구글 폼에 제출하기'}
      </button>

      <div className="mt-4 text-xs text-gray-500">
        * 실제 사용 시 구글 폼 URL을 설정해야 합니다
      </div>
    </div>
  );
};

export default GoogleFormIntegration;

