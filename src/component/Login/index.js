/**
 * Created by lvxianlei on 2017/7/29.
 */
'use strict';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login } from '@/actions/Login';
import Login from './component/Login';

function mapStateToProps(state = {}) {

    return { token: state.Login.token, isLogin: state.Login.isLogin };
}


function mapDispatchToProps(dispatch) {
    return { getToken: data => dispatch(login(data)) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
