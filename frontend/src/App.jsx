import React, { useState } from 'react';
import Navbar from './components/Navbar';
import RewardConfigModal from './components/RewardConfigModal';

// Pages
import HomePage from './pages/HomePage';
import RecommendationsPage from './pages/RecommendationsPage';
import RLDemoPage from './pages/RLDemoPage';
import DashboardPage from './pages/DashboardPage';
import EvaluationPage from './pages/EvaluationPage';
import ModelsPage from './pages/ModelsPage';
import ExperimentsPage from './pages/ExperimentsPage';
import ProfilePage from './pages/ProfilePage';
import ItemDetailPage from './pages/ItemDetailPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [currentUser, setCurrentUser] = useState(1);
  const [activeModel, setActiveModel] = useState('PPO');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const handleViewDetail = (actionId) => {
    setSelectedItemId(actionId);
    setActivePage('item-detail');
  };

  const handleBackToRecs = () => {
    setSelectedItemId(null);
    setActivePage('recommendations');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        activeModel={activeModel}
        setActiveModel={setActiveModel}
        onOpenRewardModal={() => setIsRewardModalOpen(true)}
      />

      {/* Main Page Content Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-4 lg:px-6 pb-12 pt-2">
        {activePage === 'home' && (
          <HomePage 
            setActivePage={setActivePage} 
            activeModel={activeModel} 
          />
        )}
        
        {activePage === 'recommendations' && (
          <RecommendationsPage
            currentUser={currentUser}
            activeModel={activeModel}
            setActiveModel={setActiveModel}
            onViewDetail={handleViewDetail}
            onOpenRewardModal={() => setIsRewardModalOpen(true)}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'rl-demo' && (
          <RLDemoPage
            currentUser={currentUser}
            activeModel={activeModel}
            setActiveModel={setActiveModel}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'evaluation' && (
          <EvaluationPage />
        )}

        {activePage === 'models' && (
          <ModelsPage
            activeModel={activeModel}
            setActiveModel={setActiveModel}
          />
        )}

        {activePage === 'experiments' && (
          <ExperimentsPage />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'item-detail' && (
          <ItemDetailPage
            itemId={selectedItemId}
            onBack={handleBackToRecs}
            currentUser={currentUser}
            activeModel={activeModel}
          />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Multi-Objective Reward Configuration Modal */}
      <RewardConfigModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
      />

      {/* Research Platform Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">RecSys RL Platform</span>
            <span>•</span>
            <span>Academic Research & Production Demonstration</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActivePage('about')} className="hover:text-brand-600 transition-colors">Research Docs</button>
            <button onClick={() => setActivePage('evaluation')} className="hover:text-brand-600 transition-colors">Benchmark</button>
            <button onClick={() => setActivePage('models')} className="hover:text-brand-600 transition-colors">Models</button>
            <button onClick={() => setIsRewardModalOpen(true)} className="hover:text-brand-600 transition-colors">Reward Weights</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
