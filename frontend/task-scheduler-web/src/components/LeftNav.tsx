import React from 'react';
import { useNavigate } from 'react-router-dom';
import './left-nav.scss';

interface NavItem {
  name: string;
  path: string;
}

interface LeftNavProps {
  items: NavItem[];
  onItemClick: (path: string) => void;
}

const LeftNav: React.FC<LeftNavProps> = ({ items, onItemClick }) => {
  const navigate = useNavigate();

  const handleItemClick = (path: string) => {
    onItemClick(path);
    navigate(path);
  };

  return (
    <nav className="left-nav">
      <ul>
        {items.map((item) => (
          <li key={item.path} onClick={() => handleItemClick(item.path)}>
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LeftNav;
