import React, { useState } from 'react';
import './tab-selector.scss';

interface TabSelectorProps {
  tabs: string[];
  onSelect: (selectedTab: string) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ tabs, onSelect }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onSelect(tab);
  };

  return (
    <div className="tab-selector">
      <ul className="tab-list">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={`tab-item ${tab === activeTab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabSelector;
