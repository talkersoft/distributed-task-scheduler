/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/views/Home.tsx */
import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Task Executor</h1>
      <p>We execute stuff really fast.</p>
      <i style={{ color: 'red' }}>
        Please note, Monitor will not show any data until recurring tasks are scheduled.
      </i>
    </div>
  );
}

export default Home;
