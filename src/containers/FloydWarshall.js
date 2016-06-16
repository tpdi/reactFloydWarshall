import React, {Component} from 'react';
import {RTable} from 'components';

export default class FloydWarshall extends Component {

  handleUpdate = (row) => (column) => (event) => {
    alert(`row ${row} col ${column} val ${event.target.value}`);
    return true;
  }

  render() {
    const rows = [[0, 2, 1], [3, 0, 3], [5, 5, 0]];
    return (
      <div>
        <RTable rows={rows}/>
        <table><tbody>
          {rows.map( (row, rindex) => {
            const rowHandler = this.handleUpdate(rindex);
            return (
              <tr key={rindex}>
                { row.map( (col, cindex) => {
                  const colHandler = rowHandler(cindex);
                  return (
                    <td>
                      <input key={cindex} defaultValue={col} onBlur={colHandler} readOnly={rindex === cindex}/>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody></table>
      </div>
    );
  }
}
