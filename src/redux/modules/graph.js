const SET_VERTICES = 'graph/SET_VERTICES';
const SET_EDGE = 'graph/SET_EDGE';


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

function makeAdjMatrix2(numVertices) {
  const ret = new Array();
  for (let ind = 0; ind < numVertices; ++ind) {
    const row = [];
    for (let jind = 0; jind < numVertices; ++jind) {
      row.push(ind !== jind ? null : 0);
    }
    ret.push(row);
  }
  return ret;
}

const initialState = {
  numVertices: 4,
  adjacencyMatrix: [[0, 1, 2, 3], [null, 0, null, null], [null, null, 0, null], [null, null, null, 0]]
};

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case SET_VERTICES:
      return {
        numVertices: action.numVertices,
        adjacencyMatrix: makeAdjMatrix2(action.numVertices) // , state.adjacencyMatrix)
      };
    case SET_EDGE:
      if (action.row === action.col) return state;
      return {
        ...state,
        adjacencyMatrix: state.adjacencyMatrix.map((row, rindex) => {
          if (rindex !== action.row) return row;
          return row.map((col, cindex) => {
            return cindex === action.col ? action.value : col;
          });
        })
      };
    default:
      return state;
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
