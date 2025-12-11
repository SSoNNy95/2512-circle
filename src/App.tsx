import React, { useState } from 'react';
import { LearningStage } from './types';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import DiscoverPage from './pages/DiscoverPage';
import DerivePage from './pages/DerivePage';
import ApplyPage from './pages/ApplyPage';
import HelpButton from './components/HelpButton';
import { motion, AnimatePresence } from 'framer-motion';

type Page = 'home' | LearningStage;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentStage, setCurrentStage] = useState<LearningStage>('explore');

  const handleStart = () => {
    setCurrentPage('explore');
    setCurrentStage('explore');
  };

  const handleNext = () => {
    const stages: LearningStage[] = ['explore', 'discover', 'derive', 'apply'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setCurrentStage(nextStage);
      setCurrentPage(nextStage);
    }
  };

  const handlePrev = () => {
    const stages: LearningStage[] = ['explore', 'discover', 'derive', 'apply'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex > 0) {
      const prevStage = stages[currentIndex - 1];
      setCurrentStage(prevStage);
      setCurrentPage(prevStage);
    }
  };

  const handleStageChange = (stage: LearningStage) => {
    setCurrentStage(stage);
    setCurrentPage(stage);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onStart={handleStart} />
          </motion.div>
        )}
        {currentPage === 'explore' && (
          <motion.div
            key="explore"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <ExplorePage onNext={handleNext} />
          </motion.div>
        )}
        {currentPage === 'discover' && (
          <motion.div
            key="discover"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <DiscoverPage onNext={handleNext} onPrev={handlePrev} />
          </motion.div>
        )}
        {currentPage === 'derive' && (
          <motion.div
            key="derive"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <DerivePage onNext={handleNext} onPrev={handlePrev} />
          </motion.div>
        )}
        {currentPage === 'apply' && (
          <motion.div
            key="apply"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <ApplyPage onPrev={handlePrev} />
          </motion.div>
        )}
      </AnimatePresence>

      {currentPage !== 'home' && <HelpButton stage={currentStage} />}
    </>
  );
}

export default App;

