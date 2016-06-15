import React, {Component} from 'react';
import {RTable} from 'components';

export default class FloydWarshall extends Component {

  render() {
    const rows = [['---1---', 2], [3, 4]];
    return (
      <div>
        <RTable rows={rows}/>
      </div>
    );
  }
}
