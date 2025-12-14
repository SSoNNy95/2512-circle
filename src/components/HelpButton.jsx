import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HELP_CONTENT = {
  explore: {
    title: '1단계: 탐색 모드 도움말',
    content: [
      '슬라이더를 움직여 원을 여러 개로 나눠보세요.',
      '나눈 조각들을 마우스로 드래그하여 자유롭게 이동시킬 수 있습니다.',
      '정렬 모드를 켜면 조각들이 가이드라인에 맞춰집니다.',
      '조각들을 위아래로 번갈아 배열해보세요. 어떤 모양이 만들어지나요?',
    ],
  },
  discover: {
    title: '2단계: 발견 모드 도움말',
    content: [
      '"최적 배열 보기" 버튼을 눌러 조각들이 자동으로 배열되는 것을 관찰하세요.',
      '분할 수를 늘려가며 어떤 변화가 일어나는지 확인해보세요.',
      '조각들이 직사각형에 가까워지는 것을 발견할 수 있나요?',
      '"원래대로" 버튼으로 다시 원 모양으로 돌아갈 수 있습니다.',
    ],
  },
  derive: {
    title: '3단계: 공식 도출 모드 도움말',
    content: [
      '재배열된 도형의 가로 길이는 원주의 절반과 같습니다.',
      '세로 길이는 반지름과 같습니다.',
      '직사각형의 넓이 공식: 가로 × 세로',
      '따라서 원의 넓이 = 원주의 절반 × 반지름 = π × 반지름 × 반지름',
    ],
  },
  apply: {
    title: '4단계: 적용 모드 도움말',
    content: [
      '원 모양의 사물 사진을 업로드하거나 카메라로 촬영하세요.',
      '사진에서 원의 지름을 측정하여 입력하세요.',
      '입력한 지름을 바탕으로 넓이가 자동으로 계산됩니다.',
      '실제 생활에서 원의 넓이를 구하는 방법을 연습해보세요.',
    ],
  },
};

const HelpButton = ({ stage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const help = HELP_CONTENT[stage];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
        aria-label="도움말 열기"
      >
        ?
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{help.title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary-300 rounded"
                  aria-label="닫기"
                >
                  ×
                </button>
              </div>
              <ul className="space-y-3">
                {help.content.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-primary-500 font-bold mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                확인
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpButton;

