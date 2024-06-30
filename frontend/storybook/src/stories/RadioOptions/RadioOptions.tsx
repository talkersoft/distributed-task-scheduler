import React, { useState } from 'react';
import './radio-options.scss';

interface RadioOptionsProps {
  options: string[];
  direction?: 'vertical' | 'horizontal';
}

export const RadioOptions: React.FC<RadioOptionsProps> = ({ options, direction = 'vertical' }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className={`radio-options ${direction}`}>
      {options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            value={option}
            checked={selectedOption === option}
            onChange={handleOptionChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
};
