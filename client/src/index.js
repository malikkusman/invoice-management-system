import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' for React 18+
import './index.css';
import App from './App';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import {thunk} from 'redux-thunk'; // Correct default import
import reducers from './reducers';

// Create Redux store
const store = createStore(
  reducers,
  compose(applyMiddleware(thunk)) // Apply middleware
);

// Create root for React 18+
const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
