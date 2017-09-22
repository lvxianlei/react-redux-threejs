/**
 * Created by lvxianlei on 2017/4/17.
 */
'use strict';
import {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Application from './component/application';
import {
    transitionalFlag,
    updateDesignItemShape,
    getNodeList,
    chooseDesignId
} from '../../js/actions/application';
import {
    getModel
} from '../../js/actions/canvas';
function mapStateToProps(state = {}) {
    return {
        designList:state.application.designList,
        designIds:state.application.designIds,
        chooseDesign:state.application.chooseDesign,
    };
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({
        transitionalFlag,
        chooseDesignId,
        getNodeList,
        getModel,
        updateDesignItemShape
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);
