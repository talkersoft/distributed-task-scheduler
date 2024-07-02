/* Copyright Talkersoft LLC */
/* /frontend/storybook/src/stories/Spinner/Spinner.tsx */
import React from 'react';
import './spinner.scss';

export interface SpinnerProps {
  size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 50 }) => {
  return (
    <svg
      className="spinner"
      width={size}
      height={size}
      viewBox="0 0 50 50"
    >
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      />
    </svg>
  );
};

export default Spinner;
