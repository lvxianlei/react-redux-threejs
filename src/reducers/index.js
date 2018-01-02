'use strict';
import { combineReducers } from 'redux';
import Application from './Application';
import DrawingCanvas from './DrawingCanvas';
import Login from './Login';

const rootReducer = combineReducers({
    Application,
    DrawingCanvas,
    Login,
});
export default rootReducer;
