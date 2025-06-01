// src/App.tsx
import React from 'react';
import Recorder from './components/recorder';

export default function App() {
  return (
    <div className="App">
      {/* your existing providers / Toaster / Router… */}
      <Recorder />
    </div>
  );
}
