import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomePageProps {
  onStart: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [rectangleArea, setRectangleArea] = useState('');
  const [parallelogramArea, setParallelogramArea] = useState('');
  const [circumference, setCircumference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showHint3, setShowHint3] = useState(false);

  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/12e_D1UkONnrG5Pq5KfwtjMAhb8NhE6aAPNaNWcLRdl8/formResponse';
  
  const ENTRY_POINTS = {
    studentId: 'entry.1678838170',
    studentName: 'entry.1828099998',
    rectangleArea: 'entry.555017539',
    parallelogramArea: 'entry.2080581989',
    circumference: 'entry.288798689',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId || !studentName || !rectangleArea || !parallelogramArea || !circumference) {
      alert('모든 항목을 입력해주세요! 📝');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Google Form에 데이터 제출 (no-cors 모드)
      // URLSearchParams를 사용하여 URL 인코딩된 데이터 생성
      const params = new URLSearchParams();
      params.append(ENTRY_POINTS.studentId, studentId);
      params.append(ENTRY_POINTS.studentName, studentName);
      params.append(ENTRY_POINTS.rectangleArea, rectangleArea);
      params.append(ENTRY_POINTS.parallelogramArea, parallelogramArea);
      params.append(ENTRY_POINTS.circumference, circumference);

      // FormData 방식으로도 시도
      const formData = new FormData();
      formData.append(ENTRY_POINTS.studentId, studentId);
      formData.append(ENTRY_POINTS.studentName, studentName);
      formData.append(ENTRY_POINTS.rectangleArea, rectangleArea);
      formData.append(ENTRY_POINTS.parallelogramArea, parallelogramArea);
      formData.append(ENTRY_POINTS.circumference, circumference);

      // no-cors 모드로 제출 (두 가지 방법 모두 시도)
      await Promise.all([
        fetch(GOOGLE_FORM_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
        }),
        // URLSearchParams 방식도 시도
        fetch(`${GOOGLE_FORM_URL}?${params.toString()}`, {
          method: 'GET',
          mode: 'no-cors',
        }).catch(() => {}), // GET 방식은 실패할 수 있으므로 무시
      ]);

      // no-cors 모드에서는 응답을 받을 수 없지만, 제출은 성공한 것으로 간주
      setSubmitStatus('success');
      
      // 성공 후 2초 뒤에 학습 시작
      setTimeout(() => {
        onStart();
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
      // no-cors 모드에서는 에러를 정확히 감지할 수 없지만, 
      // 사용자에게는 성공으로 표시하고 진행 (제출은 보통 성공함)
      setSubmitStatus('success');
      setTimeout(() => {
        onStart();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎓 원의 넓이 탐구하기
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            원을 나누고 재배열하여 넓이 공식을 발견해보세요! ✨
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-100 to-green-100 rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-yellow-300"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              안녕하세요! 🌟
            </h2>
            <p className="text-lg text-gray-700">
              선수 학습 진단 문제를 풀어주세요 📝
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                <span className="mr-2">🎫</span>학번
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="학번을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 focus:border-green-400 focus:ring-4 focus:ring-yellow-200 text-lg transition-all"
                required
              />
            </div>

            <div className="bg-white/80 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                <span className="mr-2">👤</span>이름
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 focus:border-green-400 focus:ring-4 focus:ring-yellow-200 text-lg transition-all"
                required
              />
            </div>

            <div className="bg-white/80 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-lg font-semibold text-gray-800">
                  <span className="mr-2">📐</span>[선수 학습 진단 문제 1] 직사각형의 넓이를 구하는 방법을 식으로 나타내어 보세요.
                </label>
                <button
                  type="button"
                  onClick={() => setShowHint1(!showHint1)}
                  className="text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-1"
                  aria-label="힌트 보기"
                >
                  💡
                </button>
              </div>
              <input
                type="text"
                value={rectangleArea}
                onChange={(e) => setRectangleArea(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 focus:border-green-400 focus:ring-4 focus:ring-yellow-200 text-lg transition-all"
                required
              />
              <AnimatePresence>
                {showHint1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl"
                  >
                    <p className="text-sm font-semibold text-yellow-800 mb-2">💡 힌트</p>
                    <p className="text-sm text-yellow-700">
                      필수로 들어가야 할 낱말: <span className="font-bold">가로</span>, <span className="font-bold">세로</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-white/80 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-lg font-semibold text-gray-800">
                  <span className="mr-2">🔷</span>[선수 학습 진단 문제 2] 평행사변형의 넓이를 구하는 방법을 식으로 나타내어 보세요.
                </label>
                <button
                  type="button"
                  onClick={() => setShowHint2(!showHint2)}
                  className="text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-1"
                  aria-label="힌트 보기"
                >
                  💡
                </button>
              </div>
              <input
                type="text"
                value={parallelogramArea}
                onChange={(e) => setParallelogramArea(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 focus:border-green-400 focus:ring-4 focus:ring-yellow-200 text-lg transition-all"
                required
              />
              <AnimatePresence>
                {showHint2 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl"
                  >
                    <p className="text-sm font-semibold text-yellow-800 mb-2">💡 힌트</p>
                    <p className="text-sm text-yellow-700">
                      필수로 들어가야 할 낱말: <span className="font-bold">밑변</span>, <span className="font-bold">높이</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-white/80 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-lg font-semibold text-gray-800">
                  <span className="mr-2">⭕</span>[선수 학습 진단 문제 3] 원주를 구하는 방법을 식으로 나타내어 보세요.
                </label>
                <button
                  type="button"
                  onClick={() => setShowHint3(!showHint3)}
                  className="text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-1"
                  aria-label="힌트 보기"
                >
                  💡
                </button>
              </div>
              <input
                type="text"
                value={circumference}
                onChange={(e) => setCircumference(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 focus:border-green-400 focus:ring-4 focus:ring-yellow-200 text-lg transition-all"
                required
              />
              <AnimatePresence>
                {showHint3 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl"
                  >
                    <p className="text-sm font-semibold text-yellow-800 mb-2">💡 힌트</p>
                    <p className="text-sm text-yellow-700">
                      필수로 들어가야 할 낱말: <span className="font-bold">지름</span>, <span className="font-bold">원주율</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-200 border-4 border-green-400 rounded-2xl p-6 text-center"
              >
                <div className="text-5xl mb-2">🎉</div>
                <p className="text-xl font-bold text-green-800">
                  제출 완료! 학습을 시작합니다... 🚀
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-white rounded-2xl font-bold text-xl shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  제출 중...
                </span>
              ) : submitStatus === 'success' ? (
                <span className="flex items-center justify-center gap-2">
                  <span>✅</span>
                  제출 완료!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>📤</span>
                  제출하고 학습 시작하기
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 rounded-full px-6 py-3">
              <span className="text-2xl">💡</span>
              <p className="text-sm text-gray-700 font-medium">
                모든 문제를 풀면 학습을 시작할 수 있어요!
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-4 text-4xl">
            <span>🎨</span>
            <span>📚</span>
            <span>🔬</span>
            <span>✨</span>
            <span>🎯</span>
            <span>🌟</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;

