import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from "react-router-dom";
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import global_es from "./traduccion/es/global.json"
import global_en from "./traduccion/en/global.json"
import {I18nextProvider} from "react-i18next";
import i18next from 'i18next';

i18next.init({
  interpolation: {escapeValue: false},
  lng: "es",
  resources: {
    es:{
      global: global_es
    },
    en:{
      global: global_en
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <I18nextProvider i18n={i18next}>
      <App />
      </I18nextProvider>
    </Router>
  </React.StrictMode>
);

