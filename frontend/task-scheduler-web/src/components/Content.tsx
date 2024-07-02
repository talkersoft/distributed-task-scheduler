// src/components/Content.tsx
import React from 'react';
import './content.scss';

interface ContentProps {
  children: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <div className="content">
      {children}
    </div>
  );
};

export default Content;
