import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/pages/Dashboard';
import { Ingredients } from './components/pages/Ingredients';
import { Cakes } from './components/pages/Cakes';
import { Analytics } from './components/pages/Analytics';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Listen for navigation events from dashboard
    const handleNavigation = (event: CustomEvent) => {
      setActiveTab(event.detail);
      setSidebarOpen(false); // Close sidebar on mobile
    };

    window.addEventListener('navigate', handleNavigation as EventListener);
    
    return () => {
      window.removeEventListener('navigate', handleNavigation as EventListener);
    };
  }, []);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Sweet Treats Dashboard';
      case 'ingredients':
        return 'Ingredients Management';
      case 'cakes':
        return 'Cake Budgets';
      case 'analytics':
        return 'Business Analytics';
      default:
        return 'Sweet Treats Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ingredients':
        return <Ingredients />;
      case 'cakes':
        return <Cakes />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-white">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="lg:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle(activeTab)}
        />
        
        <main className="p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;