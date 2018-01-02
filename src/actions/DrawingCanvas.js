/**
 * Created by lvxianlei on 2017/7/14.
 */
"use strict";
import {API} from './Actiontype';
const {MODEL_ITEM} = API;
// const fetch = require('node-fetch');
require('es6-promise').polyfill();
require('isomorphic-fetch');
exports.getModel = (url, method) => {
    return dispatch => {
        return fetch(url, {method: method = 'GET'}).then(response => {
            dispatch({type: MODEL_ITEM, payload: response.body});
        });
    };
};
















