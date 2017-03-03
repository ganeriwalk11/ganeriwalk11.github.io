import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { fetchUserEpic } from '../actions/index';
import { AddRowEpic } from '../actions/index';
import { AddColEpic } from '../actions/index';
import { AddURLEpic } from '../actions/index';
import { RunURLEpic } from '../actions/index';
import { SaveDataEpic } from '../actions/index';
import { ApplyFunctionEpic } from '../actions/index';

import DataReducer from './reducer_data';
import Validator from './checkIDReducer';


const rootReducer = combineReducers({
    data: DataReducer,
    vad: Validator
});

export const rootEpic = combineEpics(
  fetchUserEpic,AddRowEpic,AddColEpic,RunURLEpic,SaveDataEpic,AddURLEpic
);

export default rootReducer;
