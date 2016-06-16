import React, {Component, PropTypes} from 'react';
// import {RTable} from 'components';
import {connect} from 'react-redux';
import * as matrixActions from 'redux/modules/graph';

@connect(
  state => ({graph: state.graph}),
  matrixActions
)
export default class FloydWarshall extends Component {

  static propTypes = {
    graph: PropTypes.object,
    setVertices: PropTypes.func.isRequired,
    setEdge: PropTypes.func.isRequired
  };

  handleMatrix = (row) => (col) => (event) => {
    // alert(`row ${row} col ${col} val ${event.target.value}`);
    const value = parseInt(event.target.value, 10);
    this.props.setEdge(row, col, isNaN(value) ? null : value);
    return true;
  }

  handleVertices = (event) => {
    const value = parseInt(event.target.value, 10);
    this.props.setVertices(isNaN(value) ? this.props.graph.adjacencyMatrix.length : value);
  }

  render() {
    const styles = require('./FloydWarshall.scss');
    const rows = this.props.graph.adjacencyMatrix;
    const length = rows.length;
    const header = Array.from({length: length}, (val, key) => key);
    console.log('header', header);
    return (
      <div>
        {rows.toString()}
        {header.toString()}
        <br/>
        {rows.map( (row) => { return row.toString();})}
        <br/>
        {rows.map( (row) => {
          return row.map( (col) => {
            return col === null ? 'NULL' : col.toString();
          });
        })}
        <br/>
        <label>Number of vertices: <input value={length} onChange={this.handleVertices} /></label>
        <br/>
        <table><tbody>
          <tr className={styles.headerRow}>
            <td>k</td>
            { header.map( (val)=> { return (<td>{val}</td>);})}
          </tr>
          <tr className={styles.headerRow}>
            <td>i\j</td>
            { header.map( (val)=> { return (<td>{val}</td>);})}
          </tr>
          {rows.map( (row, rindex) => {
            const rowHandler = this.handleMatrix(rindex);
            return (
              <tr key={rindex}>
                <td>{header[rindex]}</td>
                { row.map( (col, cindex) => {
                  const colHandler = rowHandler(cindex);
                  return (
                    <td key={cindex}>
                      <input style={{width: '25px'}} className={styles.adjMatrix} value={col} onChange={colHandler} readOnly={rindex === cindex}/>
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
