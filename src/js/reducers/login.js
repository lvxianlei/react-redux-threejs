/**
 * Created by lvxianlei on 2017/7/31.
 */
'use strict';
export default (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN_TOKEN':
            state.token = action.payload;
            window.localStorage.setItem("token", action.payload.access_token);
            window.localStorage.setItem("username", action.payload.username);
            return Object.assign({}, state);
            break;
        case'LOGIN_ERROR':
            state.token = action.payload;
            return Object.assign({}, state);
            break;
        default:
            return Object.assign({}, state);
    }
};