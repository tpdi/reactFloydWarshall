import React, {Component, PropTypes} from 'react';

export default class Cell extends Component {
  static propTypes = {
    value: PropTypes.any.isRequired,
    className: PropTypes.string
  }

  props = {
    className: ''
  }

  render() {
    const {value, ...others} = this.props; // eslint-disable-line no-shadow
    return (
      <td {...others}>
        {value}
      </td>
    );
  }
}
