import React from 'react';
import './header.scss';

type User = {
  name: string;
};

interface HeaderProps {
  user?: User;
  onLogout?: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => (
  <header>
    <div className="storybook-header">
      <h1 className="header-left">Acme</h1>
      {user && (
        <div className="header-right">
          <span className="welcome">
            Welcome, <b>{user.name}</b>!
          </span>
        </div>
      )}
    </div>
  </header>
);
