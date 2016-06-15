import React, {Component, PropTypes} from 'react';
import Cell from './Cell';

export default class Row extends Component {
  static propTypes = {
    values: PropTypes.array,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(React.PropTypes.node),
      PropTypes.node
    ])
  }

  props = {
    className: '',
    children: []
  }

  render() {
    const {values, ...others} = this.props; // eslint-disable-line no-shadow
    return (
      <tr {...others}>
        {this.props.children}
        {values.map( (value, index) => <Cell key={index} value={value}/>)}
      </tr>
    );
  }
}
