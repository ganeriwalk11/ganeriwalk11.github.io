import Rx from 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import axios from 'axios';
import { setValue } from '../containers/ActualData';

import { SAVE_DATA } from '../actions/index';
import { FETCH_DATA } from '../actions/index';
import { FETCH_FUL } from '../actions/index';
import { DELETE_ROW } from '../actions/index';
import { DELETE_COL } from '../actions/index';
import { ADDED_ROW } from '../actions/index';
import { ADDED_COL } from '../actions/index';
import { CHECK_INTEGER } from '../actions/index';
import { APPLY_FUNCTION } from '../actions/index';
import { S_COLOR } from '../actions/index';
import { CHANGE_COLOR } from '../actions/index';
import { RUN_URL } from '../actions/index';
import { GET_URL } from '../actions/index';
import { ADDED_URL } from '../actions/index';
import { REJECTED_URL } from '../actions/index';
import { DUMMY } from '../actions/index';

const rxFetch = require('rxjs-fetch');
const urla = 'http://localhost:5000/';


export default function (state = [], action) {

  switch (action.type) {
    case FETCH_DATA:
      {
        return state;
        break;
      }

    case FETCH_FUL:
      {
        var data = action.payload;
        return data;
        break;
      }

    case SAVE_DATA:
      {
        return state;
        break;
      }

    case ADDED_ROW:
      {
        var data = [...state];
        data.push(action.payload);
        return data;
        break;
      }

    case ADDED_COL:
      {
        return action.payload;
        break;
      }

      case DUMMY: 
      {
        return state;
      }
    case ADDED_URL:
      {
        var data = action.payload;
        return data;
        break;
      }

    case GET_URL:
      {
        var data = [...state];
        var i = action.i;
        var j = action.j;
        var val = action.payload;
        data[i][j]['value'] = val['a'];
        return data;
      }

    case REJECTED_URL:
      {
        var data = [...state];
        var i = action.i;
        var j = action.j;
        var val = action.payload;
        data[i][j]['value'] = "ERROR";
        data[i][j]['url'] = "";
        setValue(0);
        return data;
      }

    case CHECK_INTEGER:
      {
        var data = [...state];
        var dupdata;
        var i = action.payload.i;
        var j = action.payload.j;
        var checkInt$ = Observable.of(data);
        var check$ = checkInt$.map(function (data) {
          data[i][j]['color'] = 'forestgreen';
          data[i][j]['value'] = action.payload.target;
          return data;
        });
        var stream$ = check$.subscribe((data) => dupdata = data)
        return dupdata;
        break;
      }

    case CHANGE_COLOR:
      {
        var data = [...state];
        var i = action.payload.i;
        var j = action.payload.j;
        var color = action.payload.color;
        data[i][j]['color'] = color;
        return data;
        break;
      }

    case S_COLOR:
      {
        var data = [...state];
        var i = action.payload.i;
        var j = action.payload.j;
        var color = action.payload.color;
        if ("op1i" in data[i][j]["fx"]) {
          data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].map(function (obj, q) {
            if (obj["row"] == i && obj["column"] == j) {
              data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].splice(q, 1);
            }
          });
          data[i][j]["fx"]["formula"] = "";
          delete data[i][j]["fx"]["op1i"];
          delete data[i][j]["fx"]["op1j"];
          data[i][j]["fx"] = {};
        }
        if ("op2i" in data[i][j]["fx"]) {
          data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].map(function (obj, q) {
            if (obj["row"] == i && obj["column"] == j) {
              data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].splice(q, 1);
            }
          });
          data[i][j]["fx"]["formula"] = "";
          delete data[i][j]["fx"]["op2i"];
          delete data[i][j]["fx"]["op2j"];
          data[i][j]["fx"] = {};
        }
        data[i][j]['color'] = color;
        data[i][j]['value'] = action.payload.target;
        return data;
        break;
      }

    case APPLY_FUNCTION:
      {
        var i = action.payload.i;
        var j = action.payload.j;
        var op1i = action.payload.op1i;
        var op1j = action.payload.op1j;
        var op2i = action.payload.op2i;
        var op2j = action.payload.op2j;
        var ans = action.payload.ans;
        var color = action.payload.color;
        var a = action.payload.a;
        var data = [...state];
        let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        if ("op1i" in data[i][j]["fx"]) {
          data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].map(function (obj, q) {
            if (obj["row"] == i && obj["column"] == j) {
              data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].splice(q, 1);
            }
          });
        }

        if ("op2i" in data[i][j]["fx"]) {
          data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].map(function (obj, q) {
            if (obj["row"] == i && obj["column"] == j) {
              data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].splice(q, 1);
            }
          });
        }

        data[i][j]["fx"]["formula"] = "";
        delete data[i][j]["fx"]["op1i"];
        delete data[i][j]["fx"]["op1j"];
        data[i][j]["fx"] = {};

        if (op1i !== "") {
          data[op1i][op1j]["dep"].push({ "row": i, "column": j });
          data[i][j]["fx"]["op1i"] = op1i;
          data[i][j]["fx"]["op1j"] = op1j;
        }
        if (op2i !== "") {
          data[op2i][op2j]["dep"].push({ "row": i, "column": j });
          data[i][j]["fx"]["op2i"] = op2i;
          data[i][j]["fx"]["op2j"] = op2j;
        }
        data[i][j]["fx"]["formula"] = a;
        data[i][j]["color"] = color;
        data[i][j]['value'] = ans;
        console.log(data)
        return data;
        break;
      }

    case DELETE_ROW:
      {
        var data = [...state];
        var rowNo = action.payload;
        var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        data[rowNo].map(function (col, j) {
          if (col["dep"].length > 0) {
            for (var i = 0; i < col["dep"].length; i++) {
              var rows = col["dep"][i]["row"];
              var cols = col["dep"][i]["column"];

              data[rows][cols]["fx"]["formula"] = "#REF";
              data[rows][cols]["value"] = "#REF";

              if (data[rows][cols]["fx"]["op1i"] == rowNo) {
                data[rows][cols]["fx"]["op1i"] = "";
                data[rows][cols]["fx"]["op1j"] = "";
              }
              else {
                data[rows][cols]["fx"]["op2i"] = "";
                data[rows][cols]["fx"]["op2j"] = "";
              }
            }
          }
          if (Object.keys(col["fx"]).length > 0) {
            if ("op1i" in col["fx"]) {
              var op1i = col["fx"]["op1i"];
              var op1j = col["fx"]["op1j"];
              data[op1i][op1j]["dep"].map(function (depRow, l) {
                if (depRow["row"] == rowNo) {
                  data[op1i][op1j]["dep"].splice(l, 1);
                }
              });
            }
            if ("op2i" in col["fx"]) {
              var op2i = col["fx"]["op2i"];
              var op2j = col["fx"]["op2j"];
              data[op2i][op2j]["dep"].map(function (depRow, l) {
                if (depRow["row"] == rowNo) {
                  data[op2i][op2j]["dep"].splice(l, 1);
                }
              });
            }
          }
        });
        data.map(function (row, i) {
          row.map(function (col, j) {
            if (col["dep"].length > 0) {
              for (var z = 0; z < col["dep"].length; z++) {
                if (col["dep"][z]["row"] > rowNo) {
                  col["dep"][z]["row"] = col["dep"][z]["row"] - 1;
                }
              }
            }

            if (Object.keys(col["fx"]).length > 0) {
              if (col["fx"]["op1i"] > rowNo) {
                col["fx"]["op1i"] = col["fx"]["op1i"] - 1;
                var temp = col["fx"]["formula"];
                if (temp.indexOf("+") > -1)
                  var oper = temp.indexOf("+");
                else
                  var oper = temp.indexOf("-");
                col["fx"]["formula"] = temp.substring(0, 3) + (col["fx"]["op1i"] + 1) + temp.substring(oper, temp.length);
              }
              if (col["fx"]["op2i"] > rowNo) {
                col["fx"]["op2i"] = col["fx"]["op2i"] - 1;
                var temp = col["fx"]["formula"];
                if (temp.indexOf("+") > -1)
                  var oper = temp.indexOf("+");
                else
                  var oper = temp.indexOf("-");
                col["fx"]["formula"] = temp.substring(0, oper + 2) + (col["fx"]["op2i"] + 1) + ")";
              }
            }
          });
        });

        data.splice(rowNo, 1);
        return data;
        break;
      }

    case DELETE_COL:
      {
        var data = [...state];
        var colNo = action.payload;
        let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        data.map(function (row, i) {
          if (row[colNo]["dep"].length > 0) {
            for (var j = 0; j < row[colNo]["dep"].length; j++) {
              var rows = row[colNo]["dep"][j]["row"];
              var cols = row[colNo]["dep"][j]["column"];
              data[rows][cols]["fx"]["formula"] = "#REF";
              data[rows][cols]["value"] = "#REF";

              if (data[rows][cols]["fx"]["op1j"] == colNo) {
                data[rows][cols]["fx"]["op1i"] = "";
                data[rows][cols]["fx"]["op1j"] = "";
              }
              else {
                data[rows][cols]["fx"]["op2i"] = "";
                data[rows][cols]["fx"]["op2j"] = "";
              }
            }
          }

          if (Object.keys(row[colNo]["fx"]).length > 0) {
            if ("op1i" in row[colNo]["fx"]) {
              var op1i = row[colNo]["fx"]["op1i"];
              var op1j = row[colNo]["fx"]["op1j"];
              data[op1i][op1j]["dep"].map(function (depRow, l) {
                if (depRow["column"] == colNo) {
                  data[op1i][op1j]["dep"].splice(l, 1);
                }
              });
            }
            if ("op2i" in row[colNo]["fx"]) {
              var op2i = row[colNo]["fx"]["op2i"];
              var op2j = row[colNo]["fx"]["op2j"];
              data[op2i][op2j]["dep"].map(function (depRow, l) {
                if (depRow["column"] == colNo) {
                  data[op2i][op2j]["dep"].splice(l, 1);
                }
              });
            }
          }
        });

        data.map(function (row, i) {
          row.map(function (col, j) {
            if (Object.keys(col["fx"]).length > 0) {
              if (col["fx"]["op1j"] > colNo) {
                col["fx"]["op1j"] = col["fx"]["op1j"] - 1;
                var newCol = alpha[col["fx"]["op1j"]];
                col["fx"]["formula"] = col["fx"]["formula"].substr(0, 2) + newCol + col["fx"]["formula"].substr(3, col["fx"]["formula"].length);
              }
              if (col["fx"]["op2j"] > colNo) {
                col["fx"]["op2j"] = col["fx"]["op2j"] - 1;
                var temp = col["fx"]["formula"];
                if (temp.indexOf("+") > -1)
                  var oper = temp.indexOf("+") + 1;
                else
                  var oper = temp.indexOf("-") + 1;
                var newCol = alpha[col["fx"]["op2j"]];
                col["fx"]["formula"] = col["fx"]["formula"].substr(0, oper) + newCol + col["fx"]["formula"].substr(oper + 1, col["fx"]["formula"].length);
              }
            }

            if (col["dep"].length > 0) {
              for (var z = 0; z < col["dep"].length; z++) {
                if (col["dep"][z]["column"] > colNo) {
                  col["dep"][z]["column"] = col["dep"][z]["column"] - 1;
                }
              }
            }
          });
        });

        data.map(function (row, i) {
          row.splice(colNo, 1);
        });
        return data;
        break;
      }
  }
  return state;
}
