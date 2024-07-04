/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/views/Home.tsx */
import React from 'react';
import logo from '../gazelle.svg';

const Home = () => {
  return (
    <div>
      <h1>Distributed Task Scheduler</h1>

      <div>
        <img src={logo} className="gazelle-logo" alt="logo" />
      </div>
      
      <i>We execute stuff really fast, like a gazelle.</i>
    
    </div>
  );
}

export default Home;
