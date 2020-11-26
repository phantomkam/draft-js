import React from 'react';
import ReactDOM from 'react-dom';
import DraftEditor from './components/DraftEditor';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

ReactDOM.render(
  <DraftEditor />,
  document.getElementById('editor')
);
