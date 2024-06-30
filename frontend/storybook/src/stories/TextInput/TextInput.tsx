import React, { useState, useEffect } from 'react';
import './text-input.scss';

interface TextInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  validate?: (value: string) => boolean;
  errorMessage?: string;
}

export const TextInput = ({
  label,
  placeholder = '',
  value: initialValue = '',
  onChange,
  validate,
  errorMessage = 'Invalid input',
}: TextInputProps) => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (validate && isTouched) {
      setIsValid(validate(value));
    }
  }, [value, validate, isTouched]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (!isTouched) {
      setIsTouched(true);
    }
  };

  return (
    <div className={`text-input-container ${!isValid && isTouched ? 'invalid' : ''}`}>
      <label className="text-input-label">{label}</label>
      <input
        type="text"
        className={`text-input ${!isValid && isTouched ? 'invalid' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {!isValid && isTouched && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};
