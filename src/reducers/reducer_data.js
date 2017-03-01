import Rx from 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import axios from 'axios';

import { POST_DATA } from '../actions/index';
import { FETCH_DATA } from '../actions/index';
import { FETCH_FUL } from '../actions/index';
import { FETCH_FULL } from '../actions/index';
import { DELETE_ROW } from '../actions/index';
import { DELETE_COL } from '../actions/index';
import { ADD_DATA } from '../actions/index';
import { ADD_COL } from '../actions/index';
import { CHECK_INTEGER } from '../actions/index';
import { APPLY_FUNCTION } from '../actions/index';
import { S_COLOR } from '../actions/index';
import { CHANGE_COLOR } from '../actions/index';
import { INSERTUrl } from '../actions/index';
import { RUN_URL } from '../actions/index';

const rxFetch = require('rxjs-fetch');
const urla = 'http://localhost:5000/';

export default function(state = [], action)
{
  switch (action.type)
  {    
    case FETCH_DATA:
    {
      return state;
      break;
    }

    case FETCH_FUL:
    {
      if(action.payload[0])
      {
      var head = Object.keys(action.payload[0]);
      var len = head.length;}
      var data = action.payload;
      return (data);
      break;
    }

     case FETCH_FULL:
    {
      
      var head = Object.keys(action.payload[0]);
      var len = head.length;
      var data = [...state];
      var q;
      var w ;
      Observable.from(data)
        .concatMap(function(row,i)
        {
          var x=[],y;
          head.map(function(h,j){
            if(row[h]['url'])
            {
              x = rxFetch(row[h]['url']).json();
              w = h;
              q=i;
            }
          });
          return x;
        })
        .subscribe(function(response)
        {
          data[q][w]['value'] = response['a'];
        },function(err)
          {
            data[q][w]['value']= "Error!";
            data[q][w]['url']= "";
          });
       return data;
        break;
    }

      case ADD_DATA:
      { 
        var data = [...state];
        var alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var len;
        if(data[0])
          len = data[0].length;
        else
          len = 1;
        var add =[];
        for(var j = 0; j<len; j++)
        {
          add[j] = {"value":"","color":"","fx":{},"dep":[],"url":""};
        };
        data.push(add);
        return data;
        break;
      }

      case ADD_COL:
      {
        var data = [...state];
        data.map(function(row){
          row[row.length] = {"value":"","color":"","fx":{},"dep":[],"url":""};
        });
        return data;
        break;
      }

      
       case CHECK_INTEGER:
       { 
         var data = [...state];
         var i = action.payload.i;
         var j = action.payload.j;
         data[i][j]['color'] = 'green';
         data[i][j]['value'] = action.payload.target;   
         return data;
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
        if(data[i][j]["fx"]["op1i"])
        {
          data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].map(function(obj,q){
            if(obj["row"] == i && obj["column"] == j)
            {
              data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].splice(q,1);
            }
          });
          data[i][j]["fx"]["formula"] = "";
          delete data[i][j]["fx"]["op1i"];
          delete data[i][j]["fx"]["op1j"];
          data[i][j]["fx"] = {};
        }
        if(data[i][j]["fx"]["op2i"])
        {
          data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].map(function(obj,q){
            if(obj["row"] == i && obj["column"] == j)
            {
              data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].splice(q,1);
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

      case INSERTUrl:
      {
        var data = [...state];
        var i = action.payload.i;
        var j = action.payload.j;
        var urla = action.payload.urlTest;
        var timer = action.payload.timer;
        data[i][j]['url'] = urla;
        return data;
        break;
      }

      case RUN_URL:
      {
        var data = [...state];
        var i = action.payload.i;
        var j = action.payload.j;
        var target = data[i][j]["url"];
        debugger;
        var urlTest = target.slice(4,target.indexOf(','));
        var timer = target.slice(target.indexOf(',')+1,target.indexOf(')'));
        
        var  urlStream$ = rxFetch(urlTest).json();
        var stream2$ = urlStream$.map(function(res){return res;});
        stream2$.subscribe(function(val){
          data[i][j]['value'] = val["a"];
        },function(err){
          data[i][j]['value'] = "ERROR";
        });
        return data;
        break;
      }

      case POST_DATA:
      {
        var data = [...state];
        data.map(function(row){
          row.map(function(col,j){
            row[j]['color'] = "";
          });
        });
        const urla = 'http://localhost:5000/';
        const request = Observable.ajax.post(urla,JSON.stringify(data));
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
        let alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        
        if(data[i][j]["fx"]["op1i"])
        {
          data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].map(function(obj,q){
            if(obj["row"] == i && obj["column"] == j)
            {
              data[data[i][j]["fx"]["op1i"]][data[i][j]["fx"]["op1j"]]["dep"].splice(q,1);
            }
          });
          data[i][j]["fx"]["formula"] = "";
          delete data[i][j]["fx"]["op1i"];
          delete data[i][j]["fx"]["op1j"];
          data[i][j]["fx"] = {};
        }
        if(data[i][j]["fx"]["op2i"])
        {
          data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].map(function(obj,q){
            if(obj["row"] == i && obj["column"] == j)
            {
              data[data[i][j]["fx"]["op2i"]][data[i][j]["fx"]["op2j"]]["dep"].splice(q,1);
            }
          });
          data[i][j]["fx"]["formula"] = "";
          delete data[i][j]["fx"]["op2i"];
          delete data[i][j]["fx"]["op2j"];
          data[i][j]["fx"] = {};
        }
        if(op1i !=="")
        {
          data[op1i][op1j]["dep"].push({"row" : i, "column":j});
          data[i][j]["fx"]["op1i"] = op1i;
          data[i][j]["fx"]["op1j"] = op1j;
        }
        if(op2i !=="")
        {
          data[op2i][op2j]["dep"].push({"row" : i, "column":j});
          data[i][j]["fx"]["op2i"] = op2i;
          data[i][j]["fx"]["op2j"] = op2j;
        }
        data[i][j]["fx"]["formula"] = a;
        data[i][j]["color"]  = color;
        data[i][j]['value'] = ans;
        return data;
        break;
      }

      case DELETE_ROW:
      {
        var data = [...state];
        var rowNo = action.payload;
        var alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

        data[rowNo].map(function(col,j){
          if(col["dep"].length>0)
          {
            for(var i = 0; i<col["dep"].length;i++)
            {
              var rows = col["dep"][i]["row"];
              var cols = col["dep"][i]["column"];

              data[rows][cols]["fx"]["formula"] = "#REF";
              data[rows][cols]["value"] = "#REF";

              if(data[rows][cols]["fx"]["op1i"] == rowNo)
              {
                data[rows][cols]["fx"]["op1i"] = "";
                data[rows][cols]["fx"]["op1j"] = "";
              }
              else
              {
                data[rows][cols]["fx"]["op2i"] = "";
                data[rows][cols]["fx"]["op2j"] = "";
              }
            }
          }
          if(Object.keys(col["fx"]).length > 0)
          {
            if(col["fx"]["op1i"])
            {
              var op1i = col["fx"]["op1i"];
              var op1j = col["fx"]["op1j"];
              data[op1i][op1j]["dep"].map(function(depRow,l){
                if(depRow["row"] == rowNo)
                {
                  data[op1i][op1j]["dep"].splice(l,1);   
                }
              });
            }
            if(col["fx"]["op2i"])
            {
              var op2i = col["fx"]["op2i"];
              var op2j = col["fx"]["op2j"];
              data[op2i][op2j]["dep"].map(function(depRow,l){
                if(depRow["row"] == rowNo)
                {
                  data[op2i][op2j]["dep"].splice(l,1);  
                }
              });
            }
          }
        });
        data.map(function(row,i){
          row.map(function(col,j){
            if(col["dep"].length>0)
            {
              for(var z=0;z<col["dep"].length;z++)
              {
                if(col["dep"][z]["row"]> rowNo)
                {
                  col["dep"][z]["row"] = col["dep"][z]["row"] - 1; 
                }
              }
            }

            if(Object.keys(col["fx"]).length>0)
            {
              if(col["fx"]["op1i"] > rowNo)
              {
                col["fx"]["op1i"] = col["fx"]["op1i"] - 1;
                var temp = col["fx"]["formula"];
                if(temp.indexOf("+")>-1)
                  var oper = temp.indexOf("+");
                else
                  var oper = temp.indexOf("-");
                col["fx"]["formula"] = temp.substring(0,3) + (col["fx"]["op1i"] +1) + temp.substring(oper,temp.length);  
              }
              if(col["fx"]["op2i"] > rowNo)
              {
                col["fx"]["op2i"] = col["fx"]["op2i"] - 1;
                var temp = col["fx"]["formula"];
                if(temp.indexOf("+")>-1)
                  var oper = temp.indexOf("+");
                else
                  var oper = temp.indexOf("-");
                col["fx"]["formula"] = temp.substring(0,oper + 2) + (col["fx"]["op2i"] +1) + ")";  
              }  
            }
          });
        });

        data.splice(rowNo,1);
        return data;
        break;
      }

      case DELETE_COL:
      {
        var data = [...state];
        var colNo = action.payload;
        let alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

        data.map(function(row,i){
          if(row[colNo]["dep"].length>0)
          {
            for(var j=0;j<row[colNo]["dep"].length;j++)
            {
              var rows = row[colNo]["dep"][j]["row"];
              var cols = row[colNo]["dep"][j]["column"];
              data[rows][cols]["fx"]["formula"] = "#REF";
              data[rows][cols]["value"] = "#REF";

              if(data[rows][cols]["fx"]["op1j"] == colNo)
              {
                data[rows][cols]["fx"]["op1i"] = "";
                data[rows][cols]["fx"]["op1j"] = "";
              }
              else
              {
                data[rows][cols]["fx"]["op2i"] = "";
                data[rows][cols]["fx"]["op2j"] = "";
              } 
            }
          }

          if(Object.keys(row[colNo]["fx"]).length > 0)
          {
            if(row[colNo]["fx"]["op1i"])
            {
              var op1i = row[colNo]["fx"]["op1i"];
              var op1j = row[colNo]["fx"]["op1j"];
              data[op1i][op1j]["dep"].map(function(depRow,l){
                if(depRow["column"] == colNo)
                {
                  data[op1i][op1j]["dep"].splice(l,1);   
                }
              });
            }
            if(row[colNo]["fx"]["op2i"])
            {
              var op2i = row[colNo]["fx"]["op2i"];
              var op2j = row[colNo]["fx"]["op2j"];
              data[op2i][op2j]["dep"].map(function(depRow,l){
                if(depRow["column"] == colNo)
                {
                  data[op2i][op2j]["dep"].splice(l,1);  
                }
              });
            }
          }          
        });

        data.map(function(row,i){
          row.map(function(col,j){
            if(Object.keys(col["fx"]).length >0)
            {
              if(col["fx"]["op1j"] > colNo)
              {
                col["fx"]["op1j"] = col["fx"]["op1j"] -1;
                var newCol = alpha[col["fx"]["op1j"]];
                col["fx"]["formula"] = col["fx"]["formula"].substr(0,2) + newCol + col["fx"]["formula"].substr(3,col["fx"]["formula"].length);  
              }
              if(col["fx"]["op2j"] > colNo)
              {
                col["fx"]["op2j"] = col["fx"]["op2j"] -1;
                var temp = col["fx"]["formula"];
                if(temp.indexOf("+") > -1)
                  var oper = temp.indexOf("+") + 1;
                else
                  var oper = temp.indexOf("-") + 1;
                var newCol = alpha[col["fx"]["op2j"]];
                col["fx"]["formula"] = col["fx"]["formula"].substr(0,oper) + newCol + col["fx"]["formula"].substr(oper+1,col["fx"]["formula"].length);
              }
            }

            if(col["dep"].length>0)
            {
              for(var z=0;z<col["dep"].length;z++)
              {
                if(col["dep"][z]["column"]> colNo)
                {
                  col["dep"][z]["column"] = col["dep"][z]["column"] - 1; 
                }
              }
            }
          });
        });

        data.map(function(row,i){
          row.splice(colNo,1);
        });
        return data;
        break;
      }
  }
  return state;
}
