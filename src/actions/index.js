import Rx from 'rxjs';
import 'rxjs/add/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import axios from 'axios';

export const POST_DATA = 'POST_DATA';
export const FETCH_DATA = 'FETCH_DATA';
export const FETCH_FUL = 'FETCH_USER_FULFILLED';
export const FETCH_FULL = 'FETCH_USER_F';
export const ADD_DATA = 'ADD_DATA';
export const DELETE_ROW = 'DELETE_ROW';
export const DELETE_COL = 'DELETE_COL';
export const ADD_COL = 'ADD_COL';
export const CHECK_INTEGER = 'CHECK_INTEGER';
export const APPLY_FUNCTION = 'APPLY_FUNCTION';
export const S_COLOR = 'S_COLOR';
export const CHANGE_COLOR = 'CHANGE_COLOR';
export const INSERTUrl = 'INSERTUrl';
export const RUN_URL = 'RUN_URL';

const url = 'src/jsonData/mainData.json';
const urla = 'http://localhost:5000/';

export const fetchUserEpic = action$ =>
  action$.ofType(FETCH_DATA)
    .mergeMap(action =>
      Observable.ajax.getJSON(url)
        .map(response => fetchUserFulfilled(response))
    );

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

export function fetchUrlData(data) {
  return {
    type: FETCH_FULL,
    payload: data
  };
};


export function postData(data) {
  return {
    type: POST_DATA
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

export function addData() {
  return {
    type: ADD_DATA
  };
};

export function addColData() {
  return {
    type: ADD_COL
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

export function writeUrl(i, j, urlTest, timer) {
  return {
    type: INSERTUrl,
    payload: {
      i: i,
      j: j,
      urlTest: urlTest,
      timer: timer
    }
  };
};

export function runUrl(i, j) {
  return {
    type: RUN_URL,
    payload: {
      i: i,
      j: j
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
