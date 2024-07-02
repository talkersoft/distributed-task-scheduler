/* Copyright Talkersoft LLC */
/* /frontend/storybook/src/stories/DataSelector/DataSelector.tsx */
import React, { useEffect, useState, useRef } from 'react';
import './data-selector.scss';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface Item {
  key: string;
  value: string;
}

interface DataSelectorProps {
  items: Item[];
  placeholder?: string;
  selected?: string;
  onChange?: (item: Item) => void;
  label: string;
  errorMessage?: string;
  isValid?: boolean;
}

const DataSelector: React.FC<DataSelectorProps> = ({
  label,
  items,
  placeholder = 'Select an item',
  selected,
  onChange,
  errorMessage,
  isValid = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(items.find(item => item.key === selected));
  const [currentErrorMessage, setCurrentErrorMessage] = useState(errorMessage);
  const [currentIsValid, setCurrentIsValid] = useState(isValid);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedItem(items.find(item => item.key === selected));
  }, [items, selected]);

  useEffect(() => {
    setCurrentErrorMessage(errorMessage);
    setCurrentIsValid(isValid);
  }, [errorMessage, isValid]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = (item: Item) => {
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
      <label className="text-input-label">{label}</label>
      <div className="selected-item" onClick={handleToggleDropdown}>
        <div className={`placeholder ${!currentIsValid ? 'invalid' : ''}`}>{selectedItem?.value || placeholder}</div>
        <ChevronDownIcon className="icon" />
      </div>
      {isOpen && (
        <ul className="dropdown">
          {items.map((item) => (
            <li key={item.key} onClick={() => handleSelectItem(item)}>
              {item.value}
            </li>
          ))}
        </ul>
      )}
      {!currentIsValid && currentErrorMessage && <span className="error-message">{currentErrorMessage}</span>}
    </div>
  );
};

export { DataSelector };
