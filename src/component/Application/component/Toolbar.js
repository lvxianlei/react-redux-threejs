import React from 'react';
import weblog from '@/common/logger';

let obj = [
    { name: '户型', position: 'left', tag: 'original' },
    { name: '硬装', position: 'left', tag: 'hard' },
    { name: '软装', position: 'left', tag: 'soft' },
    { name: '一楼', position: 'right', tag: '' },
    { name: '二楼', position: 'right', tag: '' },
    { name: '三楼', position: 'right', tag: '' },
    { name: '撤销', position: 'middle', tag: 'revocation' },
    { name: '恢复', position: 'middle', tag: 'recover' },
    { name: '删除', position: 'middle', tag: 'delete' },
    { name: '设置', position: 'middle', tag: 'setting' },
];


function ListItem(props) {
    const { data, isCheck, index } = props;
    return (<li className={isCheck ? 'showLi' : ''} onClick={() => props.onClick(index, data)}>{data.name}</li>);
}

class ToolbarItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { check: 0 };
        this.clickItem = this.clickItem.bind(this);
    }

    clickItem(index, item) {
        this.setState({ check: index });
        if (this.props.onClick !== undefined) {
            this.props.onClick(item);
        }
    }

    render() {
        let { data, className } = this.props;
        let el = data.map((item, index) => <ListItem key={item.name} data={item} index={index} onClick={this.clickItem} isCheck={index === this.state.check} />);
        return (
            <ul className={className}>{el}</ul>
        );
    }
}

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.clickItem = this.clickItem.bind(this);
    }

    clickItem(item) {
        if (this.props.onClick !== undefined) {
            this.props.onClick(item);
        }
    }

    render() {

        const leftEle = obj.filter(item => item.position === 'left');

        const middleEle = obj.filter(item => item.position === 'middle');

        const rightEle = obj.filter(item => item.position === 'right');

        return (
            <div className="subSidebar clearfix">

                <ToolbarItem data={leftEle} className='leftSide fl' onClick={this.clickItem} />

                <ToolbarItem data={rightEle} className='rightSide fr' onClick={this.clickItem} />

                <ToolbarItem data={middleEle} className='middleSide fr' onClick={this.clickItem} />
            </div>
        );
    }
}

export default Toolbar;