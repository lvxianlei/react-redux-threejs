import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
    this.itemNav = this.itemNav.bind(this);
    this.itemCon = this.itemCon.bind(this);
  }

  itemNav(index) {
    return this.state.current === index ? 'showLi' : '';
  }

  itemCon(index) {
    return index === this.state.current ? 'show' : '';
  }

  render() {
    return (
      <div className="tabDiv1 fl">
        {
          React.Children.map(this.props.children, (element, index) => {
            return (
              element
            );
          })
        }
      </div>
    );
  }
}