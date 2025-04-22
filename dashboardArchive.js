import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Settings, ChevronLeft, ChevronRight, LayoutDashboard, Sliders } from 'lucide-react';

// Dashboard component
const Dashboard = () => {
  // State management
  const [tabs, setTabs] = useState([
    { id: 'tab-1', title: 'Overview', active: true }
  ]);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [currentModule, setCurrentModule] = useState('uptime');
  const [activeTab, setActiveTab] = useState('tab-1');
  const [tabIdCounter, setTabIdCounter] = useState(2);
  
  // Add a new tab
  const addTab = () => {
    const newTabId = `tab-${tabIdCounter}`;
    const newTab = {
      id: newTabId,
      title: `Widget ${tabIdCounter}`,
      active: false
    };
    
    setTabs([...tabs, newTab]);
    setTabIdCounter(tabIdCounter + 1);
    setActiveTab(newTabId);
  };
  
  // Remove a tab
  const removeTab = (id, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't remove the last tab
    
    const updatedTabs = tabs.filter(tab => tab.id !== id);
    setTabs(updatedTabs);
    
    // If we removed the active tab, set the first tab as active
    if (id === activeTab) {
      setActiveTab(updatedTabs[0].id);
    }
  };
  
  // Set active tab
  const selectTab = (id) => {
    setActiveTab(id);
  };
  
  // Toggle config nav
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  
  // Prepare env, database, and module options for the nav
  const envOptions = ['Production', 'Staging', 'Development', 'QA', 'Test', 'UAT', 'Demo'];
  const databaseOptions = ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'ElasticSearch', 'Cassandra', 'DynamoDB'];
  const moduleOptions = [
    { id: 'uptime', label: 'Uptime' },
    { id: 'performance', label: 'Performance' },
    { id: 'security', label: 'Security' },
    { id: 'errors', label: 'Errors' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="text-blue-600" size={24} />
            <h1 className="font-sans text-xl font-semibold text-gray-800">DataViz Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleNav}
              className="flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Sliders size={20} />
              <span className="ml-1 font-medium text-sm">
                {isNavOpen ? 'Hide Config' : 'Show Config'}
              </span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Panel */}
        <div 
          className={`flex-shrink-0 bg-white border-r overflow-y-auto transition-all duration-300 ${
            isNavOpen ? 'w-64' : 'w-0'
          }`}
        >
          {isNavOpen && (
            <div className="p-4">
              <h2 className="font-sans text-lg font-semibold mb-4 text-gray-800">Configuration</h2>
              
              {/* Data Source Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Source</label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option>Platform Metrics API</option>
                  <option>Database Performance</option>
                  <option>Application Logs</option>
                </select>
              </div>
              
              {/* Time Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="month" className="p-2 border border-gray-300 rounded-md text-sm" />
                  <input type="month" className="p-2 border border-gray-300 rounded-md text-sm" />
                </div>
              </div>
              
              {/* Environments Multi-select */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Environments</label>
                <select multiple className="w-full p-2 border border-gray-300 rounded-md text-sm h-28">
                  {envOptions.map((env, idx) => (
                    <option key={idx} value={env}>{env}</option>
                  ))}
                </select>
                <div className="flex mt-1">
                  <button className="text-xs text-blue-600 hover:text-blue-800">Select All</button>
                  <span className="mx-1 text-gray-500">|</span>
                  <button className="text-xs text-blue-600 hover:text-blue-800">Clear</button>
                </div>
              </div>
              
              {/* Modules */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Modules</label>
                <div className="flex flex-wrap gap-2">
                  {moduleOptions.map(module => (
                    <button
                      key={module.id}
                      onClick={() => setCurrentModule(module.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentModule === module.id
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {module.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Databases */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Databases</label>
                <select multiple className="w-full p-2 border border-gray-300 rounded-md text-sm h-24">
                  {databaseOptions.map((db, idx) => (
                    <option key={idx} value={db}>{db}</option>
                  ))}
                </select>
              </div>
              
              {/* Cluster Regex */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cluster Regex</label>
                <input
                  type="text"
                  placeholder="e.g. ^cluster-[0-9]+$"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              
              {/* Apply button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Apply Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs Bar */}
          <div className="flex items-center bg-white border-b px-2 py-1">
            <div className="flex-1 flex items-center space-x-1 overflow-x-auto hide-scrollbar">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  onClick={() => selectTab(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-t-md text-sm font-medium cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {tab.title}
                  {tabs.length > 1 && (
                    <X
                      size={14}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={(e) => removeTab(tab.id, e)}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addTab}
              className="flex items-center justify-center ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              <PlusCircle size={18} />
              <span className="ml-1 text-sm font-medium">New Widget</span>
            </button>
          </div>
          
          {/* Widget Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white border rounded-lg shadow-sm p-4 h-full">
              {activeTab === 'tab-1' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <LayoutDashboard size={48} className="text-blue-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to your Dashboard</h2>
                  <p className="text-gray-600 max-w-md">
                    This is your visualization dashboard. Use the configuration panel to customize your view
                    or create new widget tabs to organize different visualizations.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Settings size={48} className="text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Widget Configuration</h2>
                  <p className="text-gray-600 max-w-md">
                    Use the configuration panel to set up this widget. You can select data sources,
                    time ranges, and other parameters to create your visualization.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Optional Footer */}
      <footer className="bg-white border-t py-2 px-4">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>© 2025 DataViz Dashboard</div>
          <div>Last updated: April 19, 2025</div>
        </div>
      </footer>
      
      {/* Custom CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;