import React from 'react';
import ReactDOM from 'react-dom';
import DraftEditor from './components/DraftEditor';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import 'draft-js-focus-plugin/lib/plugin.css';

ReactDOM.render(
  <DraftEditor />,
  document.getElementById('editor')
);
