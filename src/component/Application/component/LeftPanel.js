import React from 'react';
import { connect } from 'react-redux';
import {
    transitionalFlag,
    getNodeList,
    getAllNodeList,
    getProductList
} from '@/actions/Application';
import weblog from '@/common/logger';
import Tab from './Tab';
import SideNav from './SideNav';


// const contentList = ['电位', '水位', '强电位', '弱电位'];
// const contentList2 = ['沙发', '茶几', '电视柜', '卡座'];

const hardItems = [
    {
        name: '硬装',
        items: ['门锁', '安心配件包', '保洁', '电气开关']
    },
    {
        name: '水电',
        items: ['电位', '水位', '强电位', '弱电位']
    }
];

const softItems = [
    {
        name: '客厅',
        items: ['沙发', '茶几', '电视柜', '卡座']
    },
    {
        name: '卧室',
        items: ['床', '床头柜']
    },
    {
        name: '餐厅',
        items: ['餐桌', '餐椅']
    }
];

function mapStateToProps(state = {}) {
    return {
        soft_package: state.Application.soft_package,
        hard_package: state.Application.hard_package,
        soft_optional: state.Application.soft_optional,
        hard_optional: state.Application.hard_optional,
        product: state.Application.product,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        transitionalFlag: (flag) => dispatch(transitionalFlag(flag)),
        getNodeList: (id, node) => dispatch(getNodeList(id, node)),
        getAllNodeList: (node) => dispatch(getAllNodeList(node)),
        getProductList: (id) => dispatch(getProductList(id)),
    };
}

class LeftPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { sideNav: false, isPackage: true };
        this.sideNavClick = this.sideNavClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickPackage = this.handleClickPackage.bind(this);
        this.hardSideNavClick = this.hardSideNavClick.bind(this);
        this.modelItemClick = this.modelItemClick.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
    }

    sideNavClick(flag, item) {
        const { soft_optional } = this.props;
        this.setState({ sideNav: flag });
        let key = '#' + item;
        let checkItem = soft_optional.find(f => {
            return f.name === key;
        });

        if (checkItem === undefined) return; // 没有找到选择项
        let checkItemProduct = checkItem.productCategoryList[checkItem.productCategoryList.length - 1];
        this.props.getProductList(checkItemProduct.id);
    }

    hardSideNavClick(flag, item) {
        const { hard_optional } = this.props;
        this.setState({ sideNav: flag });
        let key = '#' + item;
        let checkItem = hard_optional.find(f => {
            return f.name === key;
        });

        if (checkItem === undefined) return; // 没有找到选择项
        let checkItemProduct = checkItem.productCategoryList[checkItem.productCategoryList.length - 1];
        this.props.getProductList(checkItemProduct.id);
    }

    modelItemClick(data) {
        this.props.transitionalFlag('sofa');
    }

    handleClick(flag) {
        this.setState({
            flag
        });
        this.props.transitionalFlag(flag);
    }

    handleClickPackage(flag) {
        this.setState({
            isPackage: flag
        });
    }

    handleCloseClick() {
        this.setState({ sideNav: false });
    }

    componentDidMount() {
        this.props.getAllNodeList('soft');
        // this.props.getAllNodeList('hard');
        // //2c93808b5fc330b4015fc407c21c0001
        this.props.getNodeList('2c93808b5fc330b4015fc407c21c0001', 'soft');
        // this.props.getNodeList('2c93808b5fc330b4015fc407c21c0001', 'hard');
    }
    render() {

        let { tag } = this.props;
        return (
            <div>
                <Tab>
                    <div className={tag === 'original' ? 'mean clearfix show' : 'mean clearfix'}>
                        <div>
                            <h5>户型</h5>
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
                    <div className={tag === 'hard' ? 'stuff clearfix show' : 'stuff clearfix'}>
                        <div className="top">
                            <div className="sup">
                                <p className="spanWrap">
                                    <span className={this.state.isPackage ? 'showLi' : ''} onClick={() => this.handleClickPackage(true)}>套餐<i></i></span>
                                    <span className={this.state.isPackage ? '' : 'showLi'} onClick={() => this.handleClickPackage(false)}>任选</span>
                                </p>
                                {/* <h5>水电</h5>
                                <ul className="clearfix">
                                    {contentList.map((item, index) => {
                                        return (
                                            <li key={index} onClick={() => this.sideNavClick(true, item)}>{item}</li>
                                        );
                                    })}
                                </ul> */}
                                <div>
                                    {hardItems.map((item, index) => {
                                        return (<div key={index}>
                                            <h5>{item.name}</h5>
                                            <ul className="clearfix">
                                                {item.items.map((item, index) => {
                                                    return (
                                                        <li key={index} onClick={() => this.hardSideNavClick(true, item)}>{item}</li>
                                                    );
                                                })}
                                            </ul>
                                        </div>);
                                    })}
                                </div>
                                <button>自动布置</button>
                            </div>
                            <hr />
                            <div className="sub">
                                <h5>木瓦油</h5>
                                <ul className="clearfix">
                                    <li>吊顶</li>
                                    <li>背景墙</li>
                                    <li>油漆</li>
                                </ul>
                            </div>
                        </div>
                        {/* {this.state.sideNav ? <SideNav items={this.props.product} onClick={this.sideNavClick} /> : ''} */}
                    </div>
                    <div className={tag === 'soft' ? 'stuff clearfix show' : 'stuff clearfix'}>
                        <div className="top">
                            <div className="sup">
                                <p className="spanWrap2">
                                    <span className={this.state.isPackage ? 'showLi' : ''} onClick={() => this.handleClickPackage(true)}>套餐<i></i></span>
                                    <span className={this.state.isPackage ? '' : 'showLi'} onClick={() => this.handleClickPackage(false)}>任选</span>
                                </p>
                                <div>
                                    {softItems.map((item, index) => {
                                        return (<div key={index}>
                                            <h5>{item.name}</h5>
                                            <ul className="clearfix">
                                                {item.items.map((item, index) => {
                                                    return (
                                                        <li key={index} onClick={() => this.sideNavClick(true, item)}>{item}</li>
                                                    );
                                                })}
                                            </ul>
                                        </div>);
                                    })}
                                </div>
                            </div>
                            {/* <hr />
                        <div className="sub">
                            <h5>木瓦油</h5>
                            <ul className="clearfix">
                                <li onClick={() => this.handleClick('sofa')}>
                                    吊顶
                                                </li>
                                <li>背景墙</li>
                                <li>油漆</li>
                            </ul>
                        </div> */}
                        </div>
                        {/* {this.state.sideNav ? <SideNav items={this.props.product} onClick={this.sideNavClick} /> : ''} */}
                    </div>
                </Tab>
                {this.state.sideNav ? <SideNav items={this.props.product} onItemClick={this.modelItemClick} onCloseClick={this.handleCloseClick} /> : ''}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftPanel);

