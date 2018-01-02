/**
 * Created by lvxianlei on 2017/7/14.
 */
'use strict';
export default (state = {}, action) => {
    switch (action.type) {
        case 'MODEL_ITEM':
            state.modelItem = action.payload;
            return Object.assign({},state);
            break;
        default:
            return Object.assign({},state);
    }
};