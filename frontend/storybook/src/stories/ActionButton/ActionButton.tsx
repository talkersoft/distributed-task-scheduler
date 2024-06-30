import React from 'react';
import './action-button.scss';

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  primary?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ActionButton = ({
  label,
  onClick,
  primary = false,
  size = 'medium',
}: ActionButtonProps) => {
  const mode = primary ? 'action-button--primary' : 'action-button--secondary';
  return (
    <button
      type="button"
      className={['action-button', `action-button--${size}`, mode].join(' ')}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
