import { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { DashboardTab } from '@/components/tabs/DashboardTab';
import { TasksTab } from '@/components/tabs/TasksTab';
import { HabitsTab } from '@/components/tabs/HabitsTab';
import { JournalTab } from '@/components/tabs/JournalTab';
import { CreativityTab } from '@/components/tabs/CreativityTab';
import { GamesTab } from '@/components/tabs/GamesTab';

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'tasks':
        return <TasksTab />;
      case 'habits':
        return <HabitsTab />;
      case 'journal':
        return <JournalTab />;
      case 'creativity':
        return <CreativityTab />;
      case 'games':
        return <GamesTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </MainLayout>
  );
};

export default Home;
