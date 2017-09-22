/**
 * Created by lvxianlei on 2017/7/29.
 */
'use strict';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getToken} from '../../js/actions/login';
import Login from './component/login';

function mapStateToProps(state = {}) {

    return {};
}


function mapDispatchToProps(dispatch) {

    return bindActionCreators({getToken},dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
