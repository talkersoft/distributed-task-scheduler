/* Copyright Talkersoft LLC */
/* /frontend/task-scheduler-web/src/views/Home.tsx */
import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Task Executor</h1>
      <p>We execute stuff really fast.</p>
      <i style={{ color: 'red' }}>
        Please note, Monitor and Metrics need to gather data about past run jobs, sample data added to the system should start to process one minute after running the containers.
      </i>
    </div>
  );
}

export default Home;
