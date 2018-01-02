/**
 * Created by lvxianlei on 2017/7/29.
 */
'use strict';
import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import logger from '@/common/logger';
import { API_TOKEN } from '@/apiConf';
const FormItem = Form.Item;
class Login extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = {
                    username: values.userName,
                    password: values.password,
                };
                this.props.getToken(data);
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLogin) {
            nextProps.history.push('/application');
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="warpForm">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <p className="yonghudenglu">用户登录</p>
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入您的用户名!' }],
                        })(
                            <div className="usernameBox">
                                <p className="username">用户名</p>
                                <Input placeholder="Username" />
                            </div>
                            )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请正确输入密码!' }],
                        })(
                            <div className="passwordBox">
                                <p className="password">密&nbsp;&nbsp;码</p>
                                <Input type="password" placeholder="Password" />
                            </div>
                            )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(Login);
