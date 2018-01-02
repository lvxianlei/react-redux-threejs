import React from 'react';
import weblog from '@/common/logger';
import List from './List';

export default class SideNav extends React.Component {
    constructor(props) {
        super(props);
        this.itemClick = this.itemClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    itemClick(data) {
        this.props.onItemClick(data);
    }

    handleClick() {
        console.log('handleClick');
        this.props.onCloseClick();
    }

    render() {
        const { onClick } = this.props;
        return (
            <div className="product-panel">
                <span className="closeBtn" onClick={this.handleClick} />
                <p>
                    <span>搜索<i></i></span>
                    <span>筛选<i></i></span>
                </p>
                <div className="divWrap">
                    <List className="clearfix show" data={this.props.items} onItemClick={this.itemClick} />
                </div>
            </div>
        );
    }
}

SideNav.defaultProps = {
    imageList: []
};