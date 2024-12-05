// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ReactModal from 'react-modal';
import Provider from './contexto/Provider.jsx'



ReactModal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider>
      <App />
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>,
)
