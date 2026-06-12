import './index.css';
import React from 'react';

import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store  from './presentation/components/store/store';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
    <Provider store={store}>
      <App />
    </Provider>
    </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
);
