/**
 * Created by lvxianlei on 17/4/10.
 */
'use strict';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { createEpicMiddleware } from 'redux-observable';

import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware, push } from 'react-router-redux';


import { createReducer } from 'redux-immutablejs';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise';
import { Router, Route, IndexRoute, browserHistory, Link, hashHistory } from 'react-router';
import reducers from '../reducers';
import rootEpic from '../epics';

import '../css/define.scss';
import '../css/reset.scss';
// pages
import Login from './Login';
import Canvas from './DrawingCanvas';
import Application from './Application';
import webLog from '@/common/logger';


const logger = createLogger();
const routerWare = routerMiddleware(hashHistory);

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(reducers, {}, applyMiddleware(epicMiddleware, routerWare, logger));

function requireCredentials(nextState, replace, next) {
    let state = store.getState();
    console.log(state);
    if (state.Login.token == null) {
        replace('/');
        next();
    } else {
        next();
    }
}
render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={Login} />
            <Route path="/application" component={Application} onEnter={requireCredentials}>
                <IndexRoute component={Canvas} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));