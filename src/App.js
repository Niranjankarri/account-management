import React, { useState, useEffect } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';
import AccountTable from './components/table/AccountTable';

function App() {
  return (
    <div className="App">
      <AccountTable />
    </div>
  );
}

export default App;