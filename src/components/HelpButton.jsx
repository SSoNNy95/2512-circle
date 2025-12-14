import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HELP_CONTENT = {
  explore: {
    title: '1단계: 탐색 모드 도움말',
    content: [
      '슬라이더를 움직여 원을 여러 개로 나눠보세요.',
      '나눈 조각들을 마우스로 드래그하여 자유롭게 이동시킬 수 있습니다.',
      '조각들을 위아래로 번갈아 배열해보세요. 어떤 모양이 만들어지나요?',
    ],
  },
  discover: {
    title: '2단계: 발견 모드 도움말',
    content: [
      '"최적 배열 보기" 버튼을 눌러 조각들이 자동으로 배열되는 것을 관찰하세요.',
      '분할 수를 늘려가며 어떤 변화가 일어나는지 확인해보세요.',
      '"원래대로" 버튼으로 다시 원 모양으로 돌아갈 수 있습니다.',
    ],
  },
};

const HelpButton = ({ stage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const help = HELP_CONTENT[stage];

  // 3단계와 4단계는 도움말을 표시하지 않음
  if (!help) {
    return null;
  }

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

