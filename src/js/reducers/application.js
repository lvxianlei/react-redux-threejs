/**
 * Created by lvxianlei on 2017/4/26.
 */
'use strict';
export default (state = {}, action) => {
    switch (action.type) {
        case 'CONVEY_FLAG':
            state = action.payload;
            return Object.assign({}, state);
            break;

        case 'NODE_LIST_GET_START':
            state.nodeListStart = action.payload;
            return Object.assign({}, state);
            break;
        case 'NODE_LIST_GET_SUCCESS':
            state.nodeList = action.payload;
            return Object.assign({}, state);
            break;
        case 'NODE_LIST_GET_ERROR':
            state.nodeListError = action.payload;
            return Object.assign({}, state);
            break;

        case 'DESIGN_ID_GET_START':
            state.designIdStart = action.payload;
            return Object.assign({}, state);
            break;
        case 'DESIGN_ID_GET_SUCCESS':
            state.designIds = action.payload;
            return Object.assign({}, state);
            break;
        case 'DESIGN_ID_GET_ERROR':
            state.designIdError = action.payload;
            return Object.assign({}, state);
            break;

        case 'SHAPE_LIST_GET_START':
            state.designStart = action.payload;
            return Object.assign({}, state);
            break;
        case 'SHAPE_LIST_GET_SUCCESS':
            state.designList = action.payload;
            return Object.assign({}, state);
            break;
        case 'SHAPE_LIST_GET_ERROR':
            state.designError = action.payload;
            return Object.assign({}, state);
            break;

        case 'DESIGN_SHAPE_CHOOSE':
            state.chooseDesign = action.payload;
            return Object.assign({}, state);

        case 'SHAPE_LIST_UPDATE':
            state.update = action.payload;
            return Object.assign({}, state);
            break;

        default:
            return Object.assign({}, state);
    }
};