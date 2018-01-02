import React from 'react';
import ModelDetailPanel from './ModelDetailPanel';

export default class RightPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
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
                    <ModelDetailPanel />
                </div>
            </div>
        );
    }
}