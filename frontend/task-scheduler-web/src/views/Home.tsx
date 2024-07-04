/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/views/Home.tsx */
import React from 'react';
import logo from '../gazelle.svg';

const Home = () => {
  return (
    <div>
      <h1>Task Executor</h1>
      <p>We execute stuff really fast.</p>

      <div>
        <img src={logo} className="gazelle-logo" alt="logo" />
      </div>
      
      <i style={{ color: 'magenta' }}>
        Please note, Monitor will not show data until recurring tasks are scheduled.
      </i>
    </div>
  );
}

export default Home;
