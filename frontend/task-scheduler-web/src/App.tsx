import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { ActionButton } from 'storybook/src/stories/ActionButton/ActionButton';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ActionButton label="Click Me" onClick={() => alert('Button Clicked!')} primary size="medium" />
      </header>
    </div>
  );
}

export default App;
