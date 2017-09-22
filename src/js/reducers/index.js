'use strict';
import { combineReducers } from 'redux';
import application from './application';
import canvas from './canvas';
import login from './login';

const rootReducer = combineReducers({
    application,
    canvas,
    login,
});
export default rootReducer;
