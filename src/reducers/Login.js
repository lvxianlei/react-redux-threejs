/**
 * Created by lvxianlei on 2017/7/31.
 */
const initState = {
    token: window.localStorage.getItem("token"),
    username: window.localStorage.getItem("username"),
};

export default (state = initState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            window.localStorage.setItem("token", action.payload.access_token);
            window.localStorage.setItem("username", action.payload.username);
            return Object.assign({}, state, { token: action.payload.access_token, username: action.payload.username, isLogin: true });
            break;
        case 'LOGIN_ERROR':
            return Object.assign({}, state, { token: null, username: '' });
            break;
        case 'LOGOUT':
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("username");
            return Object.assign({}, state, { token: null, username: null });
            break;
        default:
            return state;
    }
};