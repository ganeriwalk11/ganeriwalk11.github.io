import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { fetchUserEpic } from '../actions/index';
import { inputEditEpic } from '../actions/validations';

import DataReducer from './reducer_data';
import Validator from './checkIDReducer';


const rootReducer = combineReducers({
    data: DataReducer,
    vad: Validator
});

export const rootEpic = combineEpics(
  fetchUserEpic,inputEditEpic
);

export default rootReducer;
