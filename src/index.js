import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.scss';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { ActivePageProvider } from './store/activePageStore';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ActivePageProvider>
      <App />
    </ActivePageProvider>
  </React.StrictMode>
);

reportWebVitals();
