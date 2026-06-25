import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.scss';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { ActivePageProvider } from './store/activePageStore';
import { UserProvider } from './store/userStore';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ActivePageProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ActivePageProvider>
  </React.StrictMode>
);

reportWebVitals();
