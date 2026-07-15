import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, message, notification } from 'antd';
import './styles/global.scss';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { ActivePageProvider } from './store/activePageStore';
import { UserProvider } from './store/userStore';

// `notification` calls are static (imported directly from antd, not via the `App`
// component or `useNotification()`), so they don't sit inside our React tree and
// can't read a <ConfigProvider> wrapped around <App />. ConfigProvider.config()
// is antd's supported way to theme those static calls instead.
ConfigProvider.config({ theme: { components: { Notification: { width: 400 } } } });
// Ant Design's `notification` supports a placement option per call; set a global
// default here so every call lands top-right without repeating it everywhere.
notification.config({ placement: 'topRight', top: 24 });
// `message` toasts don't support horizontal placement at all (always top-center),
// so they're additionally repositioned to top-right via CSS in global.scss.
message.config({ top: 24 });

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
