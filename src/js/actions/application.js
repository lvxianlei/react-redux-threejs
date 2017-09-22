/**
 * Created by lvxianlei on 2017/4/26.
 */
"use strict";
require('es6-promise').polyfill();
require('isomorphic-fetch');
import {API} from './Actiontype';
const {
    DESIGN_SHAPE_CHOOSE,
    CONVEY_FLAG,

    NODE_LIST_GET_START,
    NODE_LIST_GET_SUCCESS,
    NODE_LIST_GET_ERROR,

    SHAPE_LIST_UPDATE_START,
    SHAPE_LIST_UPDATE,
    SHAPE_LIST_UPDATE_ERROR,

} = API;
export const transitionalFlag = flags => {
    return dispatch => dispatch({
        type: CONVEY_FLAG,
        payload: {flags}
    });
};

exports.getNodeList = id => {

    return dispatch => {
        dispatch({type: NODE_LIST_GET_START});
        return fetch('http://t.50-jia.com/product/bim/listCategory?'+`access_token=${localStorage.getItem('token')}&packageId=` + id, {
            method: 'GET',
        }).then(response=>response.json())
            .then(json=>{
               if(json.code===200){
                   dispatch({type: NODE_LIST_GET_SUCCESS, payload: json.data});
               }
            })
            .catch(error => {
            dispatch({type: NODE_LIST_GET_ERROR, payload: error});
        });
    };
};

exports.updateDesignItemShape = body => {
    return dispatch => {
        dispatch({type: SHAPE_LIST_UPDATE_START});
        return fetch('http://t.50-jia.com/bim/shape/operateShape?' + body, {method: 'GET'}).then(json => {
            dispatch({type: SHAPE_LIST_UPDATE, payload: json.json()});
        }).catch(error => {
            dispatch({type: SHAPE_LIST_UPDATE_ERROR, payload: error});
        });
    };
};

exports.chooseDesignId = body => {

    return dispatch => {
        return dispatch({type: DESIGN_SHAPE_CHOOSE, payload: body});
    };
};













