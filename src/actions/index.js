import Rx from 'rxjs';
import 'rxjs/add/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import { ajax } from 'rxjs/observable/dom/ajax';
import axios from 'axios';

export const POST_DATA = 'POST_DATA';
export const SAVE_DATA = 'SAVE_DATA';
export const FETCH_DATA = 'FETCH_DATA';
export const FETCH_FUL = 'FETCH_USER_FULFILLED';
export const ADD_DATA = 'ADD_DATA';
export const ADDED_ROW = 'ADDED_ROW';
export const ADDED_COL = 'ADDED_COL';
export const DELETE_ROW = 'DELETE_ROW';
export const DELETE_COL = 'DELETE_COL';
export const ADD_COL = 'ADD_COL';
export const CHECK_INTEGER = 'CHECK_INTEGER';
export const APPLY_FUNCTION = 'APPLY_FUNCTION';
export const S_COLOR = 'S_COLOR';
export const CHANGE_COLOR = 'CHANGE_COLOR';
export const INSERTUrl = 'INSERTUrl';
export const RUN_URL = 'RUN_URL';
export const GET_URL = 'GET_URL';
export const REJECTED_URL = 'REJECTED_URL';
export const ADDED_URL = 'ADDED_URL';

const url = 'src/jsonData/mainData.json';
const urla = 'http://localhost:5000/';

export const fetchUserEpic = action$ =>
  action$.ofType(FETCH_DATA)
    .mergeMap(action =>
      Observable.ajax.getJSON(url)
        .map(response => fetchUserFulfilled(response))
    );

export const RunURLEpic = action$ =>
  action$.ofType(RUN_URL)
    .mergeMap(action =>
      Observable.ajax.getJSON(`${action.payload.url}`)
        .map(resp => urlwork(resp, `${action.payload.i}`, `${action.payload.j}`))
        .catch(error => [{ type: REJECTED_URL, payload: error, i: `${action.payload.i}`, j: `${action.payload.j}` }])
    );

export const AddURLEpic = action$ =>
  action$.ofType(INSERTUrl)
    .mergeMap(action =>
      Observable.of(`${action.payload.data}`)
        .map(function(data){data[`${action.payload.i}`][`${action.payload.j}`]['url'] = [`${action.payload.urlTest}`]; return [{ type: ADDED_URL, payload: data }];  })
    );


export const AddRowEpic = action$ =>
  action$.ofType(ADD_DATA)
    .map(function (action) {
      var add = [];
      var len;
      if (action.payload.length > 0)
        len = action.payload.length;
      else
        len = 1;
      Observable.of(add).map(function (add) {
        function counter(j, i) {
          ;
          if (j < i) {
            add[j] = { "value": "", "color": "", "fx": {}, "dep": [], "url": "" };
          } else {
            return;
          }
          counter(++j, i);
        }
        counter(0, len);
        return add;
      }).subscribe(function (add) { });
      return RowAdded(add);
    });

export const SaveDataEpic = action$ =>
  action$.ofType(POST_DATA)
    .map(action =>
      axios.post(urla, `${action.payload}`)
        .map(response => [{ type: SAVE_DATA, payload: response }])
    );

export const AddColEpic = action$ =>
  action$.ofType(ADD_COL)
    .map(function (action) {
      var dupdata = [];
      Observable.from(action.payload).concatMap(function (row) {
        row[row.length] = { "value": "", "color": "", "fx": {}, "dep": [], "url": "" };
        return Observable.of(row);
      }).subscribe(function (val) { dupdata.push(val) });
      return ColAdded(dupdata);
    });

export const urlwork = (payload, i, j) => (
  {
    type: GET_URL,
    payload: payload,
    i: i,
    j: j
  });


export const RowAdded = payload => (
  {
    type: ADDED_ROW,
    payload
  });

export const ColAdded = payload => (
  {
    type: ADDED_COL,
    payload
  });

export function addData(data) {
  return {
    type: ADD_DATA,
    payload: data
  };
};

export function addColData(data) {
  return {
    type: ADD_COL,
    payload: data
  };
};

export const fetchUserFulfilled = payload => (
  {
    type: FETCH_FUL,
    payload
  });

export function fetchData() {
  return {
    type: FETCH_DATA
  }
};

export function postData(data) {
  debugger;
  data.map(function (row) {
    row.map(function (col, j) {
      row[j]['color'] = "";
    });
  });
  return {
    type: POST_DATA,
    payload: data
  }
};

export function deleteRow(rowno) {
  return {
    type: DELETE_ROW,
    payload: rowno
  };
};

export function deleteCol(colno) {
  return {
    type: DELETE_COL,
    payload: colno
  };
};

export function checkIntegerAction(i, j, target) {
  return {
    type: CHECK_INTEGER,
    payload: {
      i: i,
      j: j,
      target: target
    }
  };
};

export function stringColor(i, j, target, color) {
  return {
    type: S_COLOR,
    payload: {
      i: i,
      j: j,
      target: target,
      color: color
    }
  };
};

export function changeColor(i, j, color) {
  return {
    type: CHANGE_COLOR,
    payload: {
      i: i,
      j: j,
      color: color
    }
  };
};

export function writeUrl(i, j, urlTest, data) {
  debugger;
  return {
    type: INSERTUrl,
    payload: {
      i: i,
      j: j,
      urlTest: urlTest,
      data: data
    }
  };
};

export function runUrl(i, j, url, timer) {
  return {
    type: RUN_URL,
    payload: {
      i: i,
      j: j,
      url: url,
      timer: timer
    }
  };
};

export function applyFunc(j, a, i, data, color, op1, op2, op1i, op1j, op2i, op2j, operator) {
  var a = a;
  var data = data;
  var color = color;
  let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  var i = i;
  var op1i = op1i;
  var op1j = op1j;
  var op2i = op2i;
  var op2j = op2j;
  var operator = operator;
  var op1 = op1;
  var op2 = op2;
  var ans;
  if (op1 !== "") {
    if (operator == '+') {
      if (parseInt(data[op2i][op2j]['value'], 10))
        ans = op1 + parseInt(data[op2i][op2j]['value'], 10);
      else
        ans = op1 + 0;
    }
    else {
      if (parseInt(data[op2i][op2j]['value'], 10))
        ans = op1 - parseInt(data[op2i][op2j]['value'], 10);
      else
        ans = op1 - 0;
    }
  }

  else if (op2 !== "") {
    if (operator == '+') {
      if (parseInt(data[op1i][op1j]['value'], 10))
        ans = op2 + parseInt(data[op1i][op1j]['value'], 10);
      else
        ans = op2 + 0;
    }
    else {
      if (parseInt(data[op1i][op1j]['value'], 10))
        ans = parseInt(data[op1i][op1j]['value'], 10) - op2;
      else
        ans = 0 - op2;
    }
  }

  else if (op2i === "") {
    if (parseInt(data[op1i][op1j]['value'], 10))
      ans = parseInt(data[op1i][op1j]['value'], 10)
    else
      ans = 0;
  }
  else {
    var operator1, operator2;
    if (parseInt(data[op1i][op1j]['value'], 10))
      operator1 = parseInt(data[op1i][op1j]['value'], 10);
    else
      operator1 = 0;
    if (parseInt(data[op2i][op2j]['value'], 10))
      operator2 = parseInt(data[op2i][op2j]['value'], 10);
    else
      operator2 = 0;
    if (operator == '+') {
      ans = operator1 + operator2;
    }
    else {
      ans = operator1 - operator2;
    }
  }

  var response = {
    op1i: op1i,
    op1j: op1j,
    op2i: op2i,
    op2j: op2j,
    ans: ans,
    data: data,
    i: i,
    j: j,
    a: a,
    color: "blue"
  };
  return { type: APPLY_FUNCTION, payload: response };
};
