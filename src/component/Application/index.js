/**
 * Created by lvxianlei on 2017/4/17.
 */
'use strict';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Application from './component/Application';
import {
    transitionalFlag,
    updateDesignItemShape,
    getNodeList,
    getAllNodeList,
    chooseDesignId
} from '@/actions/Application';
import {
    getModel
} from '@/actions/DrawingCanvas';

import {
    logout
} from '@/actions/Login';

function mapStateToProps(state = {}) {
    return {
        designList: state.Application.designList,
        designIds: state.Application.designIds,
        chooseDesign: state.Application.chooseDesign,
        token: state.Login.token,
        username: state.Login.username
    };
}
function mapDispatchToProps(dispatch) {

    // let newAction = bindActionCreators({
    //     transitionalFlag,
    //     chooseDesignId,
    //     getNodeList,
    //     getModel,
    //     updateDesignItemShape,
    //     logout
    // }, dispatch);

    return {
        logout: () => dispatch(logout()),
        transitionalFlag: (flag) => dispatch(transitionalFlag(flag)),
        getNodeList: (id, node) => dispatch(getNodeList(id, node)),
        getAllNodeList: (id, node) => dispatch(getAllNodeList(id, node))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);
