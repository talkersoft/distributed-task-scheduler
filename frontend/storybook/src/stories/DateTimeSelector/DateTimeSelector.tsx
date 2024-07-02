import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './date-time-selector.scss';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface DateTimeSelectorProps {
  placeholderText?: string;
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date | null;
  maxDate?: Date | null;
  label: string;
  errorMessage?: string;
  isValid?: boolean;
}

const CustomButtonInput = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      props.onClick(event);
    }
  };

  return (
    <div
      className={`dateTimeSelectContainer ${!props.isValid ? 'invalid' : ''}`}
      onClick={props.onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="placeholder">{props.value || props.placeholder}</div>
      <ChevronDownIcon className="icon" />
    </div>
  );
});

export function DateTimeSelector({
  placeholderText = 'Select a date and time',
  selected,
  onChange,
  minDate,
  maxDate,
  label,
  errorMessage,
  isValid = true,
}: DateTimeSelectorProps) {
  const [dateSelection, setDateSelection] = useState<Date | null>(selected || null);
  const [currentErrorMessage, setCurrentErrorMessage] = useState(errorMessage);
  const [currentIsValid, setCurrentIsValid] = useState(isValid);

  useEffect(() => {
    setDateSelection(selected || null);
  }, [selected]);

  useEffect(() => {
    setCurrentErrorMessage(errorMessage);
    setCurrentIsValid(isValid);
  }, [errorMessage, isValid]);

  const handleChange = (date: Date | null) => {
    setDateSelection(date);
    onChange?.(date);
  };

  return (
    <div className="date-time-picker-container">
      <label className="date-time-picker-label">{label}</label>
      <DatePicker
        customInput={<CustomButtonInput isValid={currentIsValid} placeholder={placeholderText} />}
        dateFormat="MMMM d, yyyy h:mm aa"
        showTimeSelect
        timeIntervals={15}
        maxDate={maxDate || undefined}
        minDate={minDate || undefined}
        onChange={handleChange}
        placeholderText={placeholderText}
        selected={dateSelection}
        timeCaption="Time"
        showTimeInput
      />
      {!currentIsValid && currentErrorMessage && <span className="error-message">{currentErrorMessage}</span>}
    </div>
  );
}
