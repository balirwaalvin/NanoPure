import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();
