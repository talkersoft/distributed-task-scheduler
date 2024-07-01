import React from 'react';
import './radio-options.scss';

interface RadioOptionsProps {
  options: string[];
  direction?: 'vertical' | 'horizontal';
  onChange: (value: string) => void;
  value: string;
}

const RadioOptions: React.FC<RadioOptionsProps> = ({ options, direction = 'vertical', onChange, value }) => {
  return (
    <div className={`radio-options ${direction}`}>
      {options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default RadioOptions;
