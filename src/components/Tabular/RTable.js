import React, {Component, PropTypes} from 'react';
import Row from './Row';

export default class RTable extends Component {
  static propTypes = {
    rows: PropTypes.array,
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
    const {rows, ...others} = this.props; // eslint-disable-line no-shadow
    return (
      <table {...others}>
        <tbody>
          {this.props.children}
          {rows.map( (row, index) => <Row key={index} values={row}/>)}
        </tbody>
      </table>
    );
  }
}
