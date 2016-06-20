const SET_VERTICES = 'graph/SET_VERTICES';
const SET_EDGE = 'graph/SET_EDGE';
const BEGIN_FW = 'graph/BEGIN_FW';
const INCREMENT_J = 'graph/INCREMENT_J';
const SET_MULTI_INCEMENT_DELAY_MS = 'graph/SET_MULTI_INCEMENT_DELAY_MS';


/* function makeRow(length, index, row = []) {
  let ret = null;
  if (length <= row.length) ret = row.slice(0, length);
  else ret = row.concat(new Array(length - row.length));
  ret[index] = 0;
  console.log('makeRow', length, index, ret);
  return ret;
}

function makeAdjMatrix(numVertices, adjMatrix) {
  const ret = adjMatrix.map( (row, rindex) => makeRow(numVertices, rindex, row));
  for (let ind = numVertices - adjMatrix.length; ind < numVertices; ++ind) {
    ret.push(makeRow(numVertices, ind));
  }
  console.log('makeAdjMatrix', numVertices, adjMatrix, ret);
  return ret;
} */

const initGraph = [[0, 1, 2, 3], [null, 0, null, null], [null, null, 0, null], [null, null, null, 0]];
const initialState = {
  numVertices: 4,
  adjacencyMatrix: initGraph,
  fwMatrix: initGraph,
  negativeCycle: false,
  k: -1,
  i: -1,
  j: -1,
  multiIncrementDelayMs: 100
};

export function beginFW() {
  return {
    type: BEGIN_FW
  };
}

function isGreaterThanSum(ij, ik, kj) {
  return ik !== null && kj !== null && (ij === null || ij > ik + kj);
}

function coordinatesToOrdinal(k, i, j, v) { //eslint-disable-line
  return k * v * v + i * v + j;
}

function ordinalToCoordinates(ordinal, v) {
  if (ordinal < 0) return {k: -1, i: -1, j: -1};
  const vSquared = v * v;
  const k = Math.floor(ordinal / vSquared)
  const remainder = ordinal % vSquared;
  const i = Math.floor(remainder / v);
  const j = remainder % v;
  return k < v ? {k, i, j} : {k: v - 1, i: v - 1, j: v -1 };
}


function floydWarshallReducer(state = initialState, action = {}) {
  switch (action.type) {

    case BEGIN_FW: {
      return {
        ...state,
        fwMatrix: state.adjacencyMatrix, // .map( (row, rindex) => {return row.map( (col, cindex) => {return col;});}),
        negativeCycle: false,
        k: -1,
        i: -1,
        j: -1,
        fwComplete: false
      };
    }
    case INCREMENT_J: {
      let k = state.k; // eslint-disable-line
      let fwMatrix = state.fwMatrix;
      let v = fwMatrix.length; // eslint-disable-line
      let negativeCycle = state.negativeCycle;
      if (negativeCycle || k === v) return state;
      let j = state.j; // eslint-disable-line
      let i = state.i; // eslint-disable-line

      const ord = coordinatesToOrdinal(k, i, j, v);
      const coords = ordinalToCoordinates(ord, v);
      console.log(k, i, j, ord, coords);

      j = (j + 1) % v;
      if (j === 0) {
        i = (i + 1) % v;
        if (i === 0) {
          k = k + 1;
          if (k === v) {
            k = i = j = -1;

            return {
              ...state,
              k, i, j,
              fwComplete: true
            };
          }
        }
      }

      console.log('k i j ' + k + ' ' + i + ' ' + j);

      let isUpdated = false;
      if (isGreaterThanSum(fwMatrix[i][j], fwMatrix[i][k], fwMatrix[k][j])) {
        isUpdated = true;
        const updated = fwMatrix[i][k] + fwMatrix[k][j];
        if (updated < 0 && i === j) negativeCycle = true;
        console.log('updating i' + i + ' ' + j + ' to ' + updated);
        fwMatrix = fwMatrix.map( (row, rindex) => {
          return rindex !== i ? row : row.map( (col, cindex) => {
            return cindex !== j ? col : updated;
          });
        });
      }

      return {
        ...state,
        fwMatrix,
        negativeCycle,
        isUpdated,
        k, i, j
      };
    }
    default:
      return state;
  }
}

function makeAdjMatrix2(numVertices) {
  const ret = new Array(numVertices);
  for (let ind = 0; ind < numVertices; ++ind) {
    const row = new Array(numVertices).fill(null);
    row[ind] = 0;
    ret[ind] = row;
  }
  return ret;
}

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case SET_VERTICES: {
      const adjMatrix = makeAdjMatrix2(action.numVertices);
      return {
        ...state,
        numVertices: action.numVertices,
        adjacencyMatrix: adjMatrix, // , state.adjacencyMatrix)
        fwMatrix: adjMatrix,
        fwComplete: false
      };
    }
    case SET_EDGE: {
      if (action.row === action.col) return state;

      const adjacencyMatrix = state.adjacencyMatrix.slice(0, action.row)
          .concat([
            state.adjacencyMatrix[action.row].slice(0, action.col)
            .concat(action.value)
            .concat(state.adjacencyMatrix[action.row].slice(action.col + 1))
          ])
          .concat(state.adjacencyMatrix.slice(action.row + 1));
      /*
        adjMatrix = state.adjacencyMatrix.map((row, rindex) => {  // eslint-disable-line
          if (rindex !== action.row) return row;
          return row.map((col, cindex) => {
            return cindex === action.col ? action.value : col;
          });
        });
      } */

      return {
        ...state,
        adjacencyMatrix,
        fwMatrix: adjacencyMatrix,
        fwComplete: false
      };
    }
    case SET_MULTI_INCEMENT_DELAY_MS:
      return {
        ...state,
        multiIncrementDelayMs: action.delay
      };
    default:
      return floydWarshallReducer(state, action);
  }
}

export function setVertices(numVertices) {
  return {
    type: SET_VERTICES,
    numVertices
  };
}

export function setEdge(row, col, value) {
  return {
    type: SET_EDGE,
    row,
    col,
    value
  };
}

export function incrementJ() {
  return {
    type: INCREMENT_J
  };
}

export function setMultiIncrementDelayMs(delay) {
  let delayInt = parseInt(delay, 10);
  if (isNaN(delayInt)) delayInt = 1000;
  return {
    type: SET_MULTI_INCEMENT_DELAY_MS,
    delay: delayInt
  };
}

export function incrementTo(toKp, toIp, toJp, lengthp) {
  const adjust = toJp === -1 ? 1 : 0;
  let toI = toIp + adjust + Math.floor(toJp / lengthp);
  let toJ = (toJp + adjust) % lengthp;
  let toK = toKp + adjust + Math.floor(toI / lengthp);
  toI %= lengthp;
  if (toK >= lengthp) {
    toJ = toI = toK = lengthp - 1;
  }
  const funcAction = (dispatch, getState) => {
    const state = getState();
    const {k, i, j, fwComplete, multiIncrementDelayMs} = state.graph;
    const length = state.graph.fwMatrix.length;
    console.log('incrementTo ', toK, toI, toJ, k, i, j, fwComplete, multiIncrementDelayMs);
    if (fwComplete || (k >= toK % length && i >= toI && j >= toJ)) return state;
    setTimeout( function() {dispatch(funcAction);}, multiIncrementDelayMs);
    return dispatch(incrementJ());
  };
  return funcAction;
}
