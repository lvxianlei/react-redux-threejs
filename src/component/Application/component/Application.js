/**
 * Created by lvxianlei on 2017/4/17.
 */
'use strict';
import React, { Component } from 'react';
import utils from '@/model/threePlugin/utils';
import Toolbar from './Toolbar';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import weblog from '@/common/logger';
let { addClass, removeClass, toggleClass, table } = utils;


let width = document.body.clientWidth || document.documentElement.clientWidth,
    height = document.body.clientHeight || document.documentElement.clientHeight;
export default class Application extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width,
            height,
            flags: null,
            sideNav: false,
            designIds: this.props.designIds,
            chooseDesign: this.props.chooseDesign,
            nodeList: this.props.nodeList,
            toolbar_left: 'original'
        };
        this.handleClick = this.handleClick.bind(this);
        this.goToHome = this.goToHome.bind(this);
        this.sideNavClick = this.sideNavClick.bind(this);
        this.clickToolbar = this.clickToolbar.bind(this);
    }

    handleClick(flag) {
        this.setState({
            flags: flag,
        });
        this.props.transitionalFlag(flag);
    }

    goToHome() {
        let dev_location = 'http://t.50-jia.com/bim/';
        let locationHome = 'http://localhost:8080/#/';
        window.location.href = locationHome;
    }

    clickToolbar(item) {
        weblog.log(item);

        switch (item.tag) {
            case 'original':
                this.setState({ toolbar_left: 'original' });
                break;
            case 'hard':
                this.setState({ toolbar_left: 'hard' });
                break;
            case 'soft':
                this.setState({ toolbar_left: 'soft' });
                break;
        }
    }

    sideNavClick(flag) {
        this.setState({ sideNav: flag });
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            width: nextProps.width,
            height: nextProps.height,
            token: nextProps.token,
            designIds: nextProps.designIds,
            chooseDesign: nextProps.chooseDesign,
            nodeList: nextProps.nodeList,
        });
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="header wd-100">
                {/*<ElasticLayer designIds={this.state.designIds} chooseDesignId={chooseDesignId}/>*/}
                <div className="content wd-100 hg50 clearfix">
                    <h1 className="fl">
                        <img src="http://50jia-bim.oss-cn-beijing.aliyuncs.com/bim_ico/logo%402x.png"
                            alt="logo" title="logo" />
                    </h1>
                    <div className="fr clearfix">
                        <ul className="fl clearfix">
                            <li>图层显示：</li>
                            <li onClick={(event) => {
                                toggleClass(event.target, 'show');
                                this.handleClick('hydropower');
                            }}><span><i> </i></span>水电
                            </li>
                            <li onClick={(event) => {
                                toggleClass(event.target, 'show');
                                this.handleClick('hardOutfit');
                            }}><span><i> </i></span>硬装
                            </li>
                            <li onClick={(event) => {
                                toggleClass(event.target, 'show');
                                this.handleClick('softOutfit');
                            }}><span><i> </i></span>软装
                            </li>
                            <li><b> </b></li>
                            <li className="bg" onClick={() => {
                                this.handleClick('plane');
                            }}>平面
                            </li>
                            <li className="bg" onClick={() => {
                                this.handleClick('top');
                            }}>顶面
                            </li>
                            <li onClick={() => {
                                this.handleClick('theFacade');
                            }}>
                                <div>立面<i></i></div>
                            </li>
                            <li className="bg" onClick={() => {
                                this.handleClick('3D');
                            }}>3D
                            </li>
                            <li>
                                <strong></strong>{this.props.username}&nbsp;&nbsp;
                                <a className='logout' onClick={(e) => {
                                    // this.handleClick('exit');
                                    this.props.logout();
                                    this.goToHome();
                                }}> 退出</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <nav className="sidebar clearfix">
                    <Toolbar onClick={this.clickToolbar} />
                    <LeftPanel tag={this.state.toolbar_left} onClick={this.handleClick} />
                    <RightPanel />
                </nav>
                <div className="canvas">
                    {this.props.children}
                </div>
            </div >
        );
    }
}

Application.defaultProps = {
    designIds: [],
    chooseDesign: {},
    nodeList: [],
};




