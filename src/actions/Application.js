/**
 * Created by lvxianlei on 2017/4/26.
 */
"use strict";
require('es6-promise').polyfill();
require('isomorphic-fetch');
import { API } from './Actiontype';
const {
    DESIGN_SHAPE_CHOOSE,
    CONVEY_FLAG,

    GET_NODE_LIST,
    GET_NODE_LIST_SUCCESS,
    GET_NODE_LIST_ERROR,

    GET_ALL_NODE_LIST,
    GET_ALL_NODE_LIST_SUCCESS,
    GET_ALL_NODE_LIST_ERROR,

    GET_PRODUCT_LIST,
    GET_PRODUCT_LIST_SUCCESS,
    GET_PRODUCT_LIST_ERROR,

    NODE_LIST_GET_START,
    NODE_LIST_GET_SUCCESS,
    NODE_LIST_GET_ERROR,

    SHAPE_LIST_UPDATE_START,
    SHAPE_LIST_UPDATE,
    SHAPE_LIST_UPDATE_ERROR,

} = API;

const transitionalFlag = flags => {
    return {
        type: CONVEY_FLAG,
        payload: { flags }
    };
};


const getNodeList = (id, node) => {

    // return dispatch => {
    //     dispatch({type: NODE_LIST_GET_START});
    //     return fetch('http://t.50-jia.com/product/bim/listCategory?'+`access_token=${localStorage.getItem('token')}&packageId=` + id, {
    //         method: 'GET',
    //     }).then(response=>response.json())
    //         .then(json=>{
    //            if(json.code===200){
    //                dispatch({type: NODE_LIST_GET_SUCCESS, payload: json.data});
    //            }
    //         })
    //         .catch(error => {
    //         dispatch({type: NODE_LIST_GET_ERROR, payload: error});
    //     });
    // };

    return { type: GET_NODE_LIST, node: node, packageId: id };
};

const getNodeListSuccess = (node, data) => {
    return { type: GET_NODE_LIST_SUCCESS, payload: data, node };
};

const getNodeListError = () => {
    return { type: GET_NODE_LIST_ERROR };
};

const getAllNodeList = (node) => {
    return { type: GET_ALL_NODE_LIST, node: node };
};

const getAllNodeListSuccess = (node, data) => {
    return { type: GET_ALL_NODE_LIST_SUCCESS, payload: data, node };
};

const getAllNodeListError = () => {
    return { type: GET_ALL_NODE_LIST_ERROR };
};

const getProductList = (id) => {
    return { type: GET_PRODUCT_LIST, id };
};

const getProductListSuccess = (data) => {
    return { type: GET_PRODUCT_LIST_SUCCESS, payload: data };
};

const getProductListError = () => {
    return { type: GET_PRODUCT_LIST_ERROR };
};

// exports.updateDesignItemShape = body => {
//     return dispatch => {
//         dispatch({type: SHAPE_LIST_UPDATE_START});
//         return fetch('http://t.50-jia.com/bim/shape/operateShape?' + body, {method: 'GET'}).then(json => {
//             dispatch({type: SHAPE_LIST_UPDATE, payload: json.json()});
//         }).catch(error => {
//             dispatch({type: SHAPE_LIST_UPDATE_ERROR, payload: error});
//         });
//     };
// };

// exports.chooseDesignId = body => {

//     return dispatch => {
//         return dispatch({type: DESIGN_SHAPE_CHOOSE, payload: body});
//     };
// };

export { transitionalFlag, getNodeList, getAllNodeList, getNodeListSuccess, getNodeListError, getAllNodeListSuccess, getAllNodeListError, getProductList, getProductListSuccess, getProductListError };











