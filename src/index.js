import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import 'rxjs';
import App from './components/app';
import reducers from './reducers';


import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from './reducers/index';
const epicMiddleware = createEpicMiddleware(rootEpic);


const createStoreWithMiddleware = applyMiddleware(epicMiddleware,ReduxPromise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
    <App />
  </Provider>
  , document.querySelector('.container'));
