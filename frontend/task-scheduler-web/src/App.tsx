// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.scss';
import { Header } from 'storybook/src/stories/Header/Header';
import Home from './views/Home';
import TaskScheduler from './views/TaskScheduler';
import TaskSchedulerEdit from './views/TaskSchedulerEdit';
import TaskSchedulerCreate from './views/TaskSchedulerCreate';
import LeftNav from './components/LeftNav';
import Content from './components/Content';

const App = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Task Scheduler', path: '/task-scheduler' },
    { name: 'Monitor', path: '/monitor' },
  ];

  const NavigationHandler = () => {
    const navigate = useNavigate();
    const handleNavClick = (path: string) => {
      navigate(path);
    };

    return (
      <>
        <LeftNav items={navItems} onItemClick={handleNavClick} />
        <Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/task-scheduler" element={<TaskScheduler />} />
            <Route path="/task-scheduler/edit/:id" element={<TaskSchedulerEdit />} />
            <Route path="/task-scheduler/create" element={<TaskSchedulerCreate />} />
          </Routes>
        </Content>
      </>
    );
  };

  return (
    <Router>
      <div className="App">
        <Header
          onCreateAccount={() => {}}
          onLogin={() => {}}
          onLogout={() => {}}
          user={{ name: 'User' }}
        />
        <NavigationHandler />
      </div>
    </Router>
  );
};

export default App;
