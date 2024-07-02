import React, { useState, useEffect } from 'react';
import './text-input.scss';

interface TextInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  errorMessage?: string;
  isValid?: boolean;
  disabled?: boolean;
}

export const TextInput = ({
  label,
  placeholder = '',
  value: initialValue = '',
  onChange,
  errorMessage,
  isValid = true,
  disabled = false,
}: TextInputProps) => {
  const [value, setValue] = useState(initialValue);
  const [currentErrorMessage, setCurrentErrorMessage] = useState(errorMessage);
  const [currentIsValid, setCurrentIsValid] = useState(isValid);

  useEffect(() => {
    setCurrentErrorMessage(errorMessage);
    setCurrentIsValid(isValid);
  }, [errorMessage, isValid]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="text-input-container">
      <label className="text-input-label">{label}</label>
      <input
        type="text"
        className={`text-input ${!currentIsValid ? 'invalid' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
      {!currentIsValid && currentErrorMessage && <span className="error-message">{currentErrorMessage}</span>}
    </div>
  );
};
