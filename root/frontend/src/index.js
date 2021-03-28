import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';

import './styles/main.scss';
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));
