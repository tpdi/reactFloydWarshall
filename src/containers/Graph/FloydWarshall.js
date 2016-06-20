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
    setEdge: PropTypes.func.isRequired,
    incrementJ: PropTypes.func.isRequired,
    beginFW: PropTypes.func.isRequired,
    setMultiIncrementDelayMs: PropTypes.func.isRequired,
    incrementTo: PropTypes.func.isRequired
  };

  handleMatrix = (row) => (col) => (event) => {
    // alert(`row ${row} col ${col} val ${event.target.value}`);
    const value = parseInt(event.target.value, 10);
    this.props.setEdge(row, col, isNaN(value) ? null : value);
    return true;
  }

  clamp(min, max, value) {
    if (isNaN(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  handleVertices = (event) => {
    this.props.setVertices(this.clamp(1, 50, parseInt(event.target.value, 10)));
  }

  dummy = () => {
  }

  render() {
    const styles = require('./FloydWarshall.scss');
    const rows = this.props.graph.adjacencyMatrix;
    const fwMatrix = this.props.graph.fwMatrix;
    const fwk = this.props.graph.k;
    const fwi = this.props.graph.i;
    const fwj = this.props.graph.j;
    const negativeCycle = this.props.graph.negativeCycle;
    const isUpdated = this.props.graph.isUpdated;
    const delay = this.props.graph.multiIncrementDelayMs;
    const length = rows.length;
    const last = length - 1;
    const canIncrement = !negativeCycle && !(fwk === last && fwi === last && fwj === last);
    const header = Array.from({length: length}, (val, key) => key);
    const defaultCellStyle = {width: '25px', height: '25px', textAlign: 'center'};

    return (
      <div>
        <label>Number of vertices: <input type="number" min="1" max="50" maxLength="2" defaultValue={length} onChange={this.handleVertices} /></label>
        <br/>
        <table><tbody>
          <tr className={styles.header.row}>
            <td>k</td>
            { header.map( (val)=> { return (<td key={val}>{val}</td>);})}
          </tr>
          <tr className={styles.headerRow}>
            <td>i\j</td>
            { header.map( (val)=> { return (<td key={val}>{val}</td>);})}
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

        <table>
          {/* Doesn't work in Chrome
            <colgroup>
            <col span={1} style={{backgroundColor: 'white', width: '20px'}}/>
            {fwj > 0 && <col span={fwj} style={{backgroundColor: 'yellow', width: '25px'}}/>}
            {fwj > -1 && <col span={1} style={{backgroundColor: 'green', width: '25px'}}/>}
            {fwj !== -1 && last - fwj > 0 && <col span={last - fwj} style={{backgroundColor: 'cyan', width: '25px'}}/>}
          </colgroup>
          */}
          <tbody>
            <tr className={styles.header.row}>
              <td>k</td>
              { header.map( (val)=> {
                return (<td key={val}
                style={val === fwk ? {...defaultCellStyle, backgroundColor: '#aaa'} : defaultCellStyle}>{val}</td>);
              })}
            </tr>
            <tr className={styles.header.row}>
              <td>i\j</td>
              { header.map( (val)=> {
                return (<td key={val}
                style={val === fwj ? {...defaultCellStyle, backgroundColor: '#aaa'} : defaultCellStyle}>{val}</td>);
              })}
            </tr>
          {fwMatrix.map( (row, rindex) => {
            return (
              <tr key={rindex} style={header[rindex] === fwi ? {backgroundColor: '#ccc'} : {}}>
                <td>{header[rindex]}</td>
                { row.map( (col, cindex) => {
                  const cellStyle = {...defaultCellStyle, border: '2px solid #555', borderStyle: 'inset'};
                  if (header[rindex] === fwi) cellStyle.backgroundColor = '#ccc';
                  if (cindex === fwj) cellStyle.backgroundColor = '#ccc';
                  if (cindex === fwj && header[rindex] === fwi) cellStyle.backgroundColor = '#aaa';
                  if (cindex === fwj && header[rindex] === fwi && isUpdated) cellStyle.backgroundColor = '#eee';
                  if (cindex === fwk && header[rindex] === fwi && isUpdated) cellStyle.backgroundColor = '#999';
                  if (cindex === fwj && header[rindex] === fwk && isUpdated) cellStyle.backgroundColor = '#777';
                  return (
                    <td key={cindex} style={cellStyle}>
                      {col}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody></table>
        {negativeCycle && 'Negative Cycle'}
        <button type="button" className="btn btn.info" onClick={this.props.incrementJ} disabled={!canIncrement}>Increment J {fwj}</button>
        <button type="button" className="btn btn.info" onClick={() => {this.props.incrementTo(fwk, fwi + 1, fwj, length);}} disabled={!canIncrement}>Increment I {fwi}</button>
        <button type="button" className="btn btn.info" onClick={() => {this.props.incrementTo(fwk + 1, fwi, fwj, length);}} disabled={!canIncrement}>Increment K {fwk}</button>
        <button type="button" className="btn btn.info" onClick={() => {this.props.incrementTo(last, last, last, length);}} disabled={!canIncrement}>Finish Floyd-Warshall</button>
        <input type="number" value={delay} onChange={(event) => this.props.setMultiIncrementDelayMs(event.target.value)}/>
        <button type="button" className="btn btn.info" onClick={this.props.beginFW}>Reset</button>
      </div>
    );
  }
}
