/**
 * Created by lvxianlei on 17/4/10.
 */
'use strict';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import { routerMiddleware, push } from 'react-router-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import promiseMiddleware from 'redux-promise';
import {Router, Route, IndexRoute, browserHistory, Link,hashHistory} from 'react-router';
import reducers from './../js/reducers';
import '../css/define.scss';
import '../css/reset.scss';

// pages
import Login from './login';
import Canvas from './canvas';
import Application from './application';
const logger = createLogger(); 
const routerWare = routerMiddleware(hashHistory);
const store = createStore(reducers,{},applyMiddleware(promiseMiddleware,thunk,routerWare,logger));

function requireCredentials(nextState, replace, next) {
    if (window.localStorage.getItem("token")===null) {
        replace('/');
        next();
    } else {
        next();
        let onEnter={requireCredentials};
    }
}
render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={Login}/>
            <Route path="/application" component={Application} >
                <IndexRoute component={Canvas}/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));