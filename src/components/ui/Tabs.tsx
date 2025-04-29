import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  defaultTabId = tabs[0]?.id, 
  className = ''
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId);
  
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTabId === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                transition-colors duration-200
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="py-4">
        {activeTab?.content}
      </div>
    </div>
  );
};

export default Tabs;
