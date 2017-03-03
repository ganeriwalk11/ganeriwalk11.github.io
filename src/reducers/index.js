import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { fetchUserEpic } from '../actions/index';
import { inputEditEpic } from '../actions/validations';
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
  fetchUserEpic,inputEditEpic,AddRowEpic,AddColEpic,RunURLEpic,SaveDataEpic,AddURLEpic,ApplyFunctionEpic
);

export default rootReducer;
