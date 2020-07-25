import React from 'react';
import Modal from 'react-modal';

import './App.css';
import BoardWrapper from './board/BoardWrapper';


Modal.setAppElement('#root');

function App() {
  return (
    <BoardWrapper/>
  );
}

export default App;
