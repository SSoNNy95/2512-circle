import React, { useState } from 'react';
import CircleProblem from '../components/CircleProblem';
import { motion } from 'framer-motion';

interface ApplyPageProps {
  onPrev: () => void;
}

interface ProblemAnswer {
  answer: string;
  correct: boolean;
}

const ApplyPage: React.FC<ApplyPageProps> = ({ onPrev }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({
    1: '',
    2: '',
    3: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 문제 정보
  const problems = [
    { number: 1, radius: 3, pi: 3, correctAnswer: 3 * 3 * 3 }, // π × r² = 3 × 3 × 3 = 27
    { number: 2, diameter: 8, pi: 3.1, correctAnswer: 3.1 * 4 * 4 }, // π × r² = 3.1 × 4 × 4 = 49.6
    { number: 3, radius: 10, pi: 3.14, correctAnswer: 3.14 * 10 * 10 }, // π × r² = 3.14 × 100 = 314
  ];

  const handleAnswerChange = (problemNumber: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [problemNumber]: answer,
    }));
  };

  const checkAnswers = (): ProblemAnswer[] => {
    return problems.map(problem => {
      const userAnswer = parseFloat(answers[problem.number]);
      const correct = Math.abs(userAnswer - problem.correctAnswer) < 0.1;
      return {
        answer: answers[problem.number],
        correct,
      };
    });
  };

  const handleSubmit = async () => {
    // 모든 답이 입력되었는지 확인
    const allAnswered = problems.every(p => answers[p.number] !== '');
    if (!allAnswered) {
      alert('모든 문제에 답을 입력해주세요! 📝');
      return;
    }

    setIsSubmitting(true);

    // Google Form URL 및 Entry Points
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdRM-yiq5dMiOMn1zzgDz4C6nAqygui929sjn8Uy3JCfyYysg/formResponse';
    
    const ENTRY_POINTS = {
      problem1: 'entry.1678838170',
      problem2: 'entry.1828099998',
      problem3: 'entry.555017539',
    };
    
    try {
      // FormData를 사용하여 데이터 준비
      const formData = new FormData();
      formData.append(ENTRY_POINTS.problem1, answers[1]);
      formData.append(ENTRY_POINTS.problem2, answers[2]);
      formData.append(ENTRY_POINTS.problem3, answers[3]);

      // URLSearchParams 방식도 시도 (더 안정적일 수 있음)
      const params = new URLSearchParams();
      params.append(ENTRY_POINTS.problem1, answers[1]);
      params.append(ENTRY_POINTS.problem2, answers[2]);
      params.append(ENTRY_POINTS.problem3, answers[3]);

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
      setSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      // no-cors 모드에서는 에러가 발생해도 제출은 성공했을 수 있음
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            4단계: 적용 모드
          </h1>
          <p className="text-lg text-white/90 drop-shadow">
            실제 사물에 원의 넓이 공식을 적용해보세요!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">학습 단계</h2>
              <div className="space-y-2">
                <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                  <div className="font-semibold">1단계: 탐구 ✓</div>
                  <div className="text-sm opacity-90">완료</div>
                </div>
                <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                  <div className="font-semibold">2단계: 발견 ✓</div>
                  <div className="text-sm opacity-90">완료</div>
                </div>
                <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                  <div className="font-semibold">3단계: 공식 도출 ✓</div>
                  <div className="text-sm opacity-90">완료</div>
                </div>
                <div className="p-3 bg-primary-500 text-white rounded-lg shadow-md">
                  <div className="font-semibold">4단계: 적용</div>
                  <div className="text-sm opacity-90">공식을 적용해 다양한 원의 넓이를 구해 보세요.</div>
                </div>
              </div>
            </div>

            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !problems.every(p => answers[p.number] !== '')}
                className="w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? '제출 중...' : '답안 제출하기'}
              </button>
            ) : (
              <div className="bg-gradient-to-br from-yellow-50 to-green-50 border-4 border-yellow-300 rounded-lg p-6 text-center">
                <div className="text-6xl mb-4">🎉✨🌟👏🎊</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  축하합니다!
                </h3>
                <p className="text-lg text-gray-700 mb-4">
                  오늘의 학습을 잘 하셨습니다! 💪
                </p>
                <p className="text-base text-gray-600">
                  원의 넓이 공식을 이해하고 문제를 해결하셨네요! 🎓
                </p>
              </div>
            )}

            <button
              onClick={onPrev}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              ← 이전 단계
            </button>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">원의 넓이 구하기</h3>
              
              <div className="space-y-6">
                {problems.map((problem) => (
                  <CircleProblem
                    key={problem.number}
                    radius={problem.radius || (problem.diameter ? problem.diameter / 2 : 0)}
                    diameter={problem.diameter}
                    pi={problem.pi}
                    problemNumber={problem.number}
                    answer={answers[problem.number]}
                    onAnswerChange={(answer) => handleAnswerChange(problem.number, answer)}
                  />
                ))}
              </div>

              {submitted && (
                <div className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📝 제출된 답안</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    {problems.map((problem) => {
                      const userAnswer = parseFloat(answers[problem.number]);
                      const correct = Math.abs(userAnswer - problem.correctAnswer) < 0.1;
                      return (
                        <div key={problem.number} className="flex items-center gap-2">
                          <span>문제 {problem.number}:</span>
                          <span className="font-semibold">{answers[problem.number]} cm²</span>
                          {correct ? (
                            <span className="text-green-600">✓ 정답</span>
                          ) : (
                            <span className="text-gray-500">
                              (정답: {problem.correctAnswer} cm²)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;







