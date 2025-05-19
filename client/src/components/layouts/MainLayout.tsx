import { useState } from 'react';
import { CloudLightning, Settings, Menu } from 'lucide-react';
import { getUserName } from '@/lib/local-storage';
import { ApiKeyModal } from '@/components/modals/ApiKeyModal';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange 
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const userName = getUserName();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'habits', label: 'Habits' },
    { id: 'journal', label: 'Journal' },
    { id: 'creativity', label: 'Creativity' },
    { id: 'games', label: 'Mini Games' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CloudLightning className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">LifeSpark</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <span className="text-sm font-medium">{`Welcome, ${userName}`}</span>
            <button 
              onClick={() => setShowApiKeyModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-2 px-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">{`Welcome, ${userName}`}</span>
              <button 
                onClick={() => setShowApiKeyModal(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="py-2 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Features Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LifeSpark</h3>
              <p className="text-gray-300 text-sm">Boost your productivity, creativity, and fun with our all-in-one personal dashboard.</p>
            </div>
            
            <div>
              <h4 className="text-base font-medium mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">To-Do List</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Habit Tracker</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Daily Journal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Zodiac Analysis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cartoon Generator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bio Generator</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base font-medium mb-4">Mini Games</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Word Puzzles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trivia Quiz</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Memory Match</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Daily Challenge</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} LifeSpark. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />
    </div>
  );
};

export default MainLayout;
