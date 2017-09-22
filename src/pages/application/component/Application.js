/**
 * Created by lvxianlei on 2017/4/17.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import utils from '../../../conf/utils';
let {addClass, removeClass, toggleClass, table} = utils;
let width = document.body.clientWidth || document.documentElement.clientWidth,
    height = document.body.clientHeight || document.documentElement.clientHeight;
export default class Application extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: window.localStorage.getItem("token"),
            width,
            height,
            flags: null,
            sideNav: false,
            designIds: this.props.designIds,
            chooseDesign: this.props.chooseDesign,
            nodeList: this.props.nodeList,
        };
        this.handleClick = this.handleClick.bind(this);
        this.goToHome = this.goToHome.bind(this);
        this.sideNavClick = this.sideNavClick.bind(this);
    }

    handleClick(flag) {
        this.setState({
            flags: flag,
        });
        this.props.transitionalFlag(flag);
    }

    sideNavClick(flag) {
        this.setState({sideNav: flag});
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.chooseDesign);
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
        if (this.state.token !== null) {
            table('leftSide', 'tabDiv1');
            // table('spanWrap', 'divWrap');
            // table('spanWrap2', 'divWrap2');
            table('rightSide', 'top1');
            let lis = document.getElementsByClassName('bg');
            let spans = document.getElementsByClassName('spanWrap')[0].children;
            let spans2 = document.getElementsByClassName('spanWrap2')[0].children;
            for (let i = 0; i < lis.length; i++) {
                lis[i].onclick = function () {
                    for (let j = 0; j < lis.length; j++) {
                        removeClass(lis[j], 'select');
                    }
                    toggleClass(this, 'select');
                };
            }
            for (let i = 0; i < spans.length; i++) {
                spans[i].onclick = function () {
                    for (let j = 0; j < spans.length; j++) {
                        removeClass(spans[j], 'showLi');
                    }
                    addClass(this, 'showLi');
                };
                spans2[i].onclick = function () {
                    for (let j = 0; j < spans2.length; j++) {
                        removeClass(spans2[j], 'showLi');
                    }
                    addClass(this, 'showLi');
                };
            }
        }
    }

    goToHome() {
        let dev_location = 'http://t.50-jia.com/bim/';
        let locationHome = 'http://localhost/gl';
        window.location.href = locationHome;
    }

    render() {
        // const {chooseDesign, getNodeList, chooseDesignId,nodeList} = this.props;
        const contentList = ['电位', '水位', '强电位', '弱电位'];
        const contentList2 = ['沙发', '茶几', '电视柜', '卡座'];
        const imageList = [
            {name:'电位1',src:'http://127.0.0.1:8080/src/img/images/bg-1_02.png'},
            {name:'电位2',src:'http://127.0.0.1:8080/src/img/images/bg-1_02.png'},
            {name:'电位3',src:'http://127.0.0.1:8080/src/img/images/bg-1_02.png'},
            {name:'电位4',src:'http://127.0.0.1:8080/src/img/images/bg-1_02.png'},
            {name:'电位5',src:'http://127.0.0.1:8080/src/img/images/bg-1_02.png'},
            {name:'电位6',src:'http://127.0.0.1:8080/src/img/images/bg-1_02.png'},
            {name:'电位7',src:'http://127.0.0.1:8080/src/img/images/bg-1_02.png'},
            {name:'电位8',src:'http://127.0.0.1:8080/src/img/images/bg-1_02.png'},
            {name:'电位9',src:'http://127.0.0.1:8080/src/img/images/bg-1_02.png'},
        ];
        const imageList2 = [
            {name:'水位1',src:'http://127.0.0.1:8080/src/img/images/bg-1_04.png'},
            {name:'水位2',src:'http://127.0.0.1:8080/src/img/images/bg-1_04.png'},
            {name:'水位3',src:'http://127.0.0.1:8080/src/img/images/bg-1_04.png'},
            {name:'水位4',src:'http://127.0.0.1:8080/src/img/images/bg-1_04.png'},
            {name:'水位5',src:'http://127.0.0.1:8080/src/img/images/bg-1_04.png'},
            {name:'水位6',src:'http://127.0.0.1:8080/src/img/images/bg-1_04.png'},
            {name:'水位7',src:'http://127.0.0.1:8080/src/img/images/bg-1_04.png'},
            {name:'水位8',src:'http://127.0.0.1:8080/src/img/images/bg-1_04.png'},
            {name:'水位9',src:'http://127.0.0.1:8080/src/img/images/bg-1_04.png'},
            {name:'水位10',src:'http://127.0.0.1:8080/src/img/images/bg-1_04.png'},
        ];
        return (
            <div className="header wd-100">
                {/*<ElasticLayer designIds={this.state.designIds} chooseDesignId={chooseDesignId}/>*/}
                <div className="content wd-100 hg50 clearfix">
                    <h1 className="fl">
                        <img src="http://50jia-bim.oss-cn-beijing.aliyuncs.com/bim_ico/logo%402x.png"
                             alt="logo" title="logo"/>
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
                            <li onClick={(e) => {
                                this.handleClick('exit');
                                this.goToHome();
                            }}><strong></strong>{`${localStorage.getItem('username')}`}&nbsp;&nbsp;退出
                            </li>
                        </ul>
                    </div>
                </div>
                <nav className="sidebar clearfix">
                    <div className="subSidebar clearfix">
                        <ul className="leftSide fl">
                            <li className="showLi">原始</li>
                            <li onClick={() => {
                                // getNodeList(chooseDesign.packageId);
                            }}>硬装
                            </li>
                            <li>软装</li>
                        </ul>
                        <ul className="rightSide fr">
                            <li>一楼</li>
                            <li className="showLi">二楼</li>
                            <li>三楼</li>
                        </ul>
                        <ul className="middleSide fr">
                            <li onClick={() => {
                                this.handleClick('revocation');
                            }}><i></i>撤销
                            </li>
                            <li onClick={() => {
                                this.handleClick('recover');
                            }}><i></i>恢复
                            </li>
                            <li onClick={() => {
                                this.handleClick('delete');
                            }}><i></i>删除
                            </li>
                        </ul>
                    </div>
                    <div className="tabDiv1 fl">
                        <div className="mean clearfix show">
                            <div>
                                <h5>原始</h5>
                                <ul>
                                    <li onClick={() => {
                                        this.handleClick('wall');
                                    }}>墙体
                                    </li>
                                    <li onClick={() => {
                                        this.handleClick('room');
                                    }}>房间
                                    </li>
                                    <li onClick={() => {
                                        this.handleClick('door');
                                    }}>门框
                                    </li>
                                    <li onClick={() => {
                                        this.handleClick('window');
                                    }}>窗框
                                    </li>
                                    <li onClick={() => {
                                        this.handleClick('wall');
                                    }}>垭口
                                    </li>
                                    <li onClick={() => {
                                        this.handleClick('wall');
                                    }}>柱子
                                    </li>
                                    <li onClick={() => {
                                        this.handleClick('wall');
                                    }}>梁
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h5>拆除/修复/新建</h5>
                                <ul>
                                    <li onClick={() => {
                                        this.handleClick('chaiQiang');
                                    }}>拆墙
                                    </li>
                                    <li onClick={() => {
                                        this.handleClick('jianQiang');
                                    }}>建墙
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="stuff clearfix">
                            <div className="top">
                                <div className="sup">
                                    <p className="spanWrap">
                                        <span className="showLi">套餐<i></i></span>
                                        <span >任选</span>
                                    </p>
                                    <h5>水电</h5>
                                    <ul className="clearfix">
                                        {contentList.map((item, index) => {
                                            return (
                                                <li key={index} onClick={() => this.sideNavClick(true)}>{item}</li>
                                            );
                                        })}
                                    </ul>
                                    <button>自动布置</button>
                                </div>
                                <hr/>
                                <div className="sub">
                                    <h5>木瓦油</h5>
                                    <ul className="clearfix">
                                        <li>
                                            吊顶
                                        </li>
                                        <li>背景墙</li>
                                        <li>油漆</li>
                                    </ul>
                                </div>
                            </div>
                            {this.state.sideNav ? <SideNav onClick={this.sideNavClick}/> : ''}
                        </div>
                        <div className="stuff clearfix">
                            <div className="top">
                                <div className="sup">
                                    <p className="spanWrap2"><span className="showLi">套餐<i></i></span><span>任选</span>
                                    </p>
                                    <h5>客厅</h5>
                                    <ul className="clearfix">
                                        {contentList2.map((item, index) => {
                                            return (
                                                <li key={index} onClick={() => this.sideNavClick(true)}>{item}</li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <hr/>
                                <div className="sub">
                                    <h5>木瓦油</h5>
                                    <ul className="clearfix">
                                        <li onClick={()=>this.handleClick('sofa')}>
                                            吊顶
                                        </li>
                                        <li>背景墙</li>
                                        <li>油漆</li>
                                    </ul>
                                </div>
                            </div>
                            {this.state.sideNav ? <SideNav onClick={this.sideNavClick}/> : ''}
                        </div>
                    </div>
                    <div className="tabDiv2 fr">
                        <div className="first">
                            <div className="top1">
                                <ul className="show">
                                    <li>次卧</li>
                                    <li>主卧</li>
                                    <li><span>餐厅</span><span>客厅</span></li>
                                    <li className="select">厨房</li>
                                </ul>
                                <ul>
                                    <li>次卧</li>
                                    <li>主卧</li>
                                    <li><span>餐厅</span><span>客厅</span></li>
                                    <li className="select">厨房</li>
                                </ul>
                                <ul>
                                    <li>次卧</li>
                                    <li>主卧</li>
                                    <li><span>餐厅</span><span>客厅</span></li>
                                    <li className="select">厨房</li>
                                </ul>
                            </div>
                            <div className="bottom">
                                <p>博洛尼010A餐桌</p>
                                <ul>
                                    <li>位置：33，50，79</li>
                                    <li>方向：朝西</li>
                                    <li>颜色：瓷白色</li>
                                    <li>尺寸：33，50，79</li>
                                    <li>材质：33，50，79</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="canvas">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Application.defaultProps = {
    designIds: [],
    chooseDesign: {},
    nodeList: [],
};

export class SideNav extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {onClick} = this.props;
        return (
            <div className="bottom">
                <span className="closeBtn" onClick={() => onClick(false)}/>
                <p>
                    <span>搜索<i></i></span>
                    <span>筛选<i></i></span>
                </p>
                <div className="divWrap">
                    <ul className="clearfix show">
                        <li>
                            <section><img src="http://127.0.0.1:8080/src/img/images/bg-1_02.png" alt=""/></section>
                            <small>背景墙1</small>
                        </li>
                        <li>
                            <section><img src="http://127.0.0.1:8080/src/img/images/bg-1_04.png" alt=""/></section>
                            <small>背景墙2</small>
                        </li>
                        <li>
                            <section><img src="http://127.0.0.1:8080/src/img/images/bg-1_06.png" alt=""/></section>
                            <small>背景墙3</small>
                        </li>
                        <li>
                            <section><img src="http://127.0.0.1:8080/src/img/images/bg-1_08.png" alt=""/></section>
                            <small>背景墙4</small>
                        </li>
                        <li>
                            <section><img src="http://127.0.0.1:8080/src/img/images/bg-1_10.png" alt=""/></section>
                            <small>背景墙5</small>
                        </li>
                        <li>
                            <section><img src="http://127.0.0.1:8080/src/img/images/bg-1_12.png" alt=""/></section>
                            <small>背景墙6</small>
                        </li>
                        <li>
                            <section><img src="http://127.0.0.1:8080/src/img/images/bg-1_14.png" alt=""/></section>
                            <small>背景墙7</small>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

SideNav.defaultProps = {
    imageList:[]
};


