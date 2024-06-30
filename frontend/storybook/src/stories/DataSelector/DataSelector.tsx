import React, { useState, useEffect, useRef } from 'react';
import './data-selector.scss';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import moment from 'moment-timezone';

interface DataSelectorProps {
  items: string[];
  placeholder?: string;
  selected?: string;
  onChange?: (item: string) => void;
}

const DataSelector = ({
  items,
  placeholder = 'Select an item',
  selected,
  onChange,
}: DataSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | undefined>(selected);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = (item: string) => {
    setSelectedItem(item);
    setIsOpen(false);
    onChange?.(item);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="data-select-container" ref={containerRef}>
      <div className="selected-item" onClick={handleToggleDropdown}>
        <div className="placeholder">{selectedItem || placeholder}</div>
        <ChevronDownIcon className="icon" />
      </div>
      {isOpen && (
        <ul className="dropdown">
          {items.map((item) => (
            <li key={item} onClick={() => handleSelectItem(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { DataSelector };
