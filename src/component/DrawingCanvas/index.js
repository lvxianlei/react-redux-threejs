/**
 * Created by lvxianlei on 2017/4/25.
 */
'use strict';
import {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getModel} from '../../actions/DrawingCanvas';
import DrawingCanvas from './component/DrawingCanvas';

function mapStateToProps(state = {}) {
    return {
        flags: state.Application,
        chooseDesign:state.Application.chooseDesign,
    };
}


function mapDispatchToProps(dispatch) {

    return bindActionCreators({getModel},dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawingCanvas);
