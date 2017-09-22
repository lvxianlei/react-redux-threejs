/**
 * Created by lvxianlei on 2017/4/25.
 */
'use strict';
import {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getModel} from '../../js/actions/canvas';
import Canvas from './component/canvas';

function mapStateToProps(state = {}) {
    return {
        flags: state.application,
        chooseDesign:state.application.chooseDesign,
    };
}


function mapDispatchToProps(dispatch) {

    return bindActionCreators({getModel},dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
