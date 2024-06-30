import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './date-selector.scss';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface DateSelectorProps {
  placeholderText?: string;
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date | null;
  maxDate?: Date | null;
}

const CustomButtonInput = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      props.onClick(event);
    }
  };

  return (
    <div
      className="dateSelectContainer"
      onClick={props.onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}>
      <div className="placeholder">{props.value || props.placeholder}</div>
      <ChevronDownIcon className="icon" />
    </div>
  );
});

export function DateSelector({
  placeholderText = 'Select a date',
  selected,
  onChange,
  minDate,
  maxDate,
}: DateSelectorProps) {
  const [dateSelection, setDateSelection] = useState<Date | null>(selected || null);

  useEffect(() => {
    setDateSelection(selected || null);
  }, [selected]);

  const handleChange = (date: Date | null) => {
    setDateSelection(date);
    onChange?.(date);
  };

  return (
    <DatePicker
      customInput={<CustomButtonInput />}
      dateFormat="MMMM d, yyyy"
      maxDate={maxDate || undefined}
      minDate={minDate || undefined}
      onChange={handleChange}
      placeholderText={placeholderText}
      selected={dateSelection}
    />
  );
}
