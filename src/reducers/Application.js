/**
 * Created by lvxianlei on 2017/4/26.
 */
const initialState = {
    // soft: { optional: [], package: [] },
    // hard: { optional: [], package: [] },
    flags: '',
    soft_package: [],
    hard_package: [],
    soft_optional: [],
    hard_optional: [],
    product: [],
};
export default (state = initialState, action) => {
    switch (action.type) {
        case 'CONVEY_FLAG':
            return Object.assign({}, state, action.payload);
            break;

        case 'GET_NODE_LIST_SUCCESS':

            switch (action.node) {
                case 'soft':
                    return Object.assign({}, state, { soft_package: action.payload });
                    break;
                case 'hard':
                    return Object.assign({}, state, { hard_package: action.payload });
                    break;
            }
            break;
        case 'GET_ALL_NODE_LIST_SUCCESS':
            switch (action.node) {
                case 'soft':
                    return Object.assign({}, state, { soft_optional: action.payload });
                    break;
                case 'hard':
                    return Object.assign({}, state, { hard_optional: action.payload });
                    break;
            }
            break;
        case 'GET_PRODUCT_LIST_SUCCESS':
            return Object.assign({}, state, { product: action.payload });
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