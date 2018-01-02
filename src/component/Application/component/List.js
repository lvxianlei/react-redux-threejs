import React from 'react';
import PropTypes from 'prop-types';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.itemClickHandle = this.itemClickHandle.bind(this);
    }

    itemClickHandle() {
        if (this.props.onClick !== undefined) {
            this.props.onClick(this.props.data);
        }
    }

    render() {
        const item = this.props.data;
        return (
            <li onClick={this.itemClickHandle}>
                <section>
                    <img src={item.mainPictureUrl} alt={item.name} />
                </section>
                <small>{item.text}</small>
            </li>);
    }
}

ListItem.propTypes = {
    data: PropTypes.object.isRequired
};

class List extends React.Component {
    constructor(props) {
        super(props);
        this.itemClickHandle = this.itemClickHandle.bind(this);
    }

    itemClickHandle(item) {
        if (this.props.onItemClick !== undefined) {
            this.props.onItemClick(item);
        }
    }

    render() {
        const { className, data, itemClick } = this.props;

        const listItems = data.map((item, index) =>
            <ListItem key={item.id.toString()} data={item} onClick={this.itemClickHandle} />
        );
        return (
            <ul className={className}>
                {listItems}
            </ul>
        );
    }
}

List.propTypes = {
    data: PropTypes.array.isRequired
};

export default List;