import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less'
import './globals.less'
import ViewManager from './Windows/ViewManager';
import {StoreProvider} from './Store/StoreFuncs'
ReactDOM.render(
  <React.StrictMode>
      <StoreProvider>
        <ViewManager />
      </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
