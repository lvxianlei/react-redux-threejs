/**
 * Created by lvxianlei on 2017/7/31.
 */
"use strict";
import { API } from './Actiontype';
import 'rxjs/Rx';

require('es6-promise').polyfill();
require('isomorphic-fetch');
const {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT
} = API;

// const getDesignID = (access_token, dispatch) => {
//     dispatch({ type: DESIGN_ID_GET_START });
//     fetch('http://t.50-jia.com/bim/design/getDesignList', {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
//         },
//         body: `access_token=${access_token}`
//     }).then(res => {
//         dispatch({ type: DESIGN_ID_GET_SUCCESS, payload: res.json() });
//     }).catch(error => {
//         dispatch({ type: DESIGN_ID_GET_ERROR, payload: error });
//     });
// };

// const getShapeList = (access_token, dispatch) => {
//     dispatch({ type: SHAPE_LIST_GET_START });
//     fetch('http://t.50-jia.com/bim/shape/getShapeList', {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
//         },
//         body: `access_token=${access_token}`
//     }).then(res => {
//         dispatch({ type: SHAPE_LIST_GET_SUCCESS, payload: res.json() });
//     }).catch(error => {
//         dispatch({ type: SHAPE_LIST_GET_ERROR, payload: error });
//     });
// };

const login = data => {
    return {
        type: LOGIN,
        data: `username=${data.username}&password=${data.password}&scope=read&grant_type=password&client_id=app50jia&cli ent_secret=50jia123456&si=54978e5207ba373fa76617dc56a2d279b96b0e17`
    };
};

const loginSuccess = data => {
    return {
        type: LOGIN_SUCCESS,
        payload: data
    };
};

const loginError = data => {
    return {
        type: LOGIN_ERROR,
        data: data
    };
};

const logout = data => {
    return {
        type: 'LOGOUT',
        data: data
    };
};

export { login, loginSuccess, loginError, logout };
