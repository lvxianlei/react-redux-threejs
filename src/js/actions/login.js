/**
 * Created by lvxianlei on 2017/7/31.
 */
"use strict";
import {API} from './Actiontype';
const {
    LOGIN_TOKEN,

    DESIGN_ID_GET_START,
    DESIGN_ID_GET_SUCCESS,
    DESIGN_ID_GET_ERROR,

    SHAPE_LIST_GET_START,
    SHAPE_LIST_GET_SUCCESS,
    SHAPE_LIST_GET_ERROR,
} = API;
import {push} from 'react-router-redux';
const devHref = 'http://t.50-jia.com/api-user/oauth/token';
const testHref = 'http://localhost/uaa';
require('es6-promise').polyfill();
require('isomorphic-fetch');
const getDesignID = (access_token, dispatch) => {
    dispatch({type: DESIGN_ID_GET_START});
    fetch('http://t.50-jia.com/bim/design/getDesignList', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        body: `access_token=${access_token}`
    }).then(res => {
        dispatch({type: DESIGN_ID_GET_SUCCESS, payload: res.json()});
    }).catch(error => {
        dispatch({type: DESIGN_ID_GET_ERROR, payload: error});
    });
};

const getShapeList = (access_token, dispatch) => {
        dispatch({type: SHAPE_LIST_GET_START});
        fetch('http://t.50-jia.com/bim/shape/getShapeList', {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            body: `access_token=${access_token}`
        }).then(res => {
            dispatch({type: SHAPE_LIST_GET_SUCCESS, payload: res.json()});
        }).catch(error => {
            dispatch({type: SHAPE_LIST_GET_ERROR, payload: error});
        });
};

exports.getToken = (data) => {
    return dispatch => {
        return fetch(testHref, {
            method: 'POST',
            headers: {
                'authorization': 'Basic YXBwNTBqaWE6NTBqaWExMjM0NTY=',
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            body: `username=${data.username}&password=${data.password}&scope=read&grant_type=password&client_id=app50jia&cli ent_secret=50jia123456&si=54978e5207ba373fa76617dc56a2d279b96b0e17`,
        }).then(response => {
            if(response.status === 200){
                   return Promise.resolve(response.json());
               }else {
                return Promise.reject(response);
            }
        }).then(data=>{
            dispatch({type: LOGIN_TOKEN, payload: data});
            dispatch(push('/application'));
            getDesignID(data.access_token, dispatch);
            getShapeList(data.access_token,dispatch);
        }).catch(error=>{
            console.log(error);
            switch (error.status){
                case 400:
                    alert('账号不存在');
                    break;
                case 401:
                    alert('密码错误，请重新输入');
                    break;
            }
        });
    };
};

