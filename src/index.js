import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import { store, persistor } from './Store'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>, document.getElementById('root'));

serviceWorker.unregister();
