import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Rx from "rxjs";
import { Observable } from 'rxjs/Observable';
import rootReducer from '../reducers/index';

import { inputEdit } from '../actions/validations';
import { applyFunc } from '../actions/index';
import { postData } from '../actions/index';
import { addData } from '../actions/index';
import { deleteRow } from '../actions/index';
import { deleteCol } from '../actions/index';
import { addColData } from '../actions/index';  
import { checkIntegerAction } from '../actions/index';
import { fetchUserFulfilled } from '../actions/index';
import { writeUrl } from '../actions/index';
import { runUrl } from '../actions/index';
import { stringColor } from '../actions/index';
import { changeColor } from '../actions/index';
import { fetchData } from '../actions/index';

export var interval;

require("babel-polyfill");

class ActualData extends Component {
    constructor(props) {
        super(props);
        this.prevValue = [];
        this.fbarData = {};
        this.flag = 0;
    }

    componentDidUpdate() {
        var me = this;
        if (!(me.flag)) {
            var dupdata = this.props.data;
            var stream$ = Observable.from(dupdata).map(function (row,i){
               var x = row.map(function(col,j){
                    if(col['url'].length > 0)
                    {
                        return [col['url'],i,j];
                    }
                    return 1;
                });
                for(var k =0; k<x.length;k++)
                {
                    if(x[k] != 1)
                        return x[k];
                }                       
            });
            stream$.subscribe(function(url){
                if(url){
                    me.checkBlur(url[1],url[2],url[0]);
                }
            },function(err){
                console.log(err);
            }); 
        me.flag = 1;
    }
}

    checkBlur(i, j, q, event) {
        console.log(i,j);
        var dupdata = this.props.data;
        var me = this;
        let len = dupdata[0].length;
        var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var target;
        if (q != "zaq")
            target = q;
        else
            target = event.target.innerText;
        // Observable.of(target).if(() => target == parseInt(target,10), console.log("Number"),console.log("NO"));
        if (dupdata[i][j]["value"] != target) {
            if (this.prevValue[this.prevValue.length - 1] != target) {
                if (target == parseInt(target, 10) || target == "") {
                    this.props.checkIntegerAction(i, j, target);
                    if (dupdata[i][j]["dep"].length) {
                        var deep = [];
                        deep = dupdata[i][j]["dep"];
                        deep.map(function (depf) {
                            var p = depf["row"];
                            var t = depf["column"];
                            var f = dupdata[p][t]["fx"]["formula"];
                            me.checkBlur(p, t, f);
                        });
                    }
                }
                else {
                    if (target[0] == '=' && target[1] == '(' && target[target.length - 1] == ')') {
                        if (target[2] == parseInt(target[2], 10)) {
                            var z = 2, num = "";
                            for (z = 2; z < target.length; z++) {
                                if (target[z] != '+' && target[z] != '-' && target[z] != ')') {
                                    num = num + target[z];
                                }
                                else
                                    break;
                            }
                            num = Number(num);
                            var op1 = num;
                            if (target[z] == ')') {
                                target = num;
                                this.props.stringColor(i, j, target, "darkblue");
                                var me = this;
                                setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                            }
                            else {
                                if (target[z] == '+' || target[z] == '-') {
                                    var operator = target[z];
                                    z = z + 1;
                                    if (target[z] == parseInt(target[z], 10)) {
                                        let c = z, numb = "";
                                        while (target[c] != ')') {
                                            numb = numb + target[c++];
                                        }
                                        numb = Number(numb);
                                        var op2 = numb;
                                        if (operator == '+')
                                            target = op1 + op2;
                                        else
                                            target = op1 - op2;
                                        this.props.stringColor(i, j, target, "darkblue");
                                        var me = this;
                                        setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                    }
                                    else if (alpha.indexOf(target[z]) > -1 && alpha.indexOf(target[z]) < len) {
                                        let k = z + 1, nu = "";
                                        while (target[k] !== ')') {
                                            nu = nu + target[k++];
                                        }
                                        nu = Number(nu);
                                        if (dupdata[nu - 1]) {
                                            var op2i = nu - 1;
                                            var op2j = alpha.indexOf(target[z]);
                                            this.props.applyFunc(j, target, i, this.props.data, "darkblue", op1, "", "", "", op2i, op2j, operator);
                                            var me = this;
                                            setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                        }
                                        else {
                                            this.props.stringColor(i, j, target, "darkblue");
                                            var me = this;
                                            setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                        }
                                    }
                                    else {
                                        this.props.stringColor(i, j, target, "darkblue");
                                        var me = this;
                                        setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                    }
                                }
                                else {
                                    this.props.stringColor(i, j, target, "darkblue");
                                    var me = this;
                                    setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                }
                            }
                        }
                        else if (alpha.indexOf(target[2]) > -1 && alpha.indexOf(target[2]) < len) {
                            let z = 3, num = "";
                            for (z = 3; z < target.length; z++) {
                                if ((target[z] !== '+') && (target[z] !== '-') && (target[z] !== ')')) {
                                    num = num + target[z];
                                }
                                else
                                    break;
                            }
                            num = Number(num);
                            if (dupdata[num - 1]) {
                                var op1i = num - 1;
                                var op1j = alpha.indexOf(target[2]);
                                if (target[z] == ')') {
                                    this.props.applyFunc(j, target, i, this.props.data, "darkblue", "", "", op1i, op1j, "", "", "");
                                    var me = this;
                                    setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                }
                                else {
                                    if (target[z] == '+' || target[z] == '-') {
                                        var operator = target[z];
                                        z = z + 1;
                                        if (target[z] == parseInt(target[z], 10)) {
                                            let c = z, numb = "";
                                            while (target[c] !== ')') {
                                                numb = numb + target[c++];
                                            }
                                            numb = Number(numb);
                                            var op2 = numb;
                                            this.props.applyFunc(j, target, i, this.props.data, "darkblue", "", op2, op1i, op1j, "", "", operator);
                                            var me = this;
                                            setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                        }
                                        else if (alpha.indexOf(target[z]) > -1 && alpha.indexOf(target[z]) < len) {
                                            let k = z + 1, nu = "";
                                            while (target[k] !== ')') {
                                                nu = nu + target[k++];
                                            }
                                            nu = Number(nu);
                                            if (dupdata[nu - 1]) {
                                                var op2i = nu - 1;
                                                var op2j = alpha.indexOf(target[z]);
                                                this.props.applyFunc(j, target, i, this.props.data, "darkblue", "", "", op1i, op1j, op2i, op2j, operator);
                                                var me = this;
                                                setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                            }
                                            else {
                                                this.props.stringColor(i, j, target, "darkblue");
                                                var me = this;
                                                setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                            }
                                        }
                                        else {
                                            this.props.stringColor(i, j, target, "darkblue");
                                            var me = this;
                                            setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                        }
                                    }
                                    else {
                                        this.props.stringColor(i, j, target, "darkblue");
                                        var me = this;
                                        setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                    }
                                }
                            }
                            else {
                                this.props.stringColor(i, j, target, "darkblue");
                                var me = this;
                                setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                            }
                        }
                        else {
                            this.props.stringColor(i, j, target, "darkblue");
                            var me = this;
                            setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                        }
                    }
                    else if (target[0] == 'u' && target[1] == 'r' && target[2] == 'l') {
                        var regex = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$");

                        var urlTest = target.slice(4, target.indexOf(','));
                        var timer = target.slice(target.indexOf(',') + 1, target.indexOf(')'));
                        if (regex.test(urlTest)) {
                            this.props.writeUrl(i, j, target, timer);
                            this.props.runUrl(i, j,urlTest,timer);
                            interval = setInterval(() => { this.props.runUrl(i, j,urlTest,timer) }, timer);
                        }
                        else {
                            this.props.stringColor(i, j, target, "red");
                            var me = this;
                            setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                        }
                    }
                    else {
                        this.props.stringColor(i, j, target, "red");
                    }
                }
            }
        }
    }

    saveData() {
        var dupdata = this.props.data;
        this.props.postData(dupdata);
    }

    delRow = (i) => {
        this.props.deleteRow(i);
    }

    delCol = (i) => {
        this.props.deleteCol(i);
    }

    addRow = () => {
        this.props.addData(this.props.data[0]);
    }

    addColumn = () => {
        this.props.addColData(this.props.data);
    }

    refFxCallback = (fxelem) => {
        var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        if (fxelem) {
            var element = ReactDOM.findDOMNode(fxelem);
            fxelem.contentEditable = true;

            var streamKeyUp$ = Observable.fromEvent(element, 'keyup')
                .map(function (e) { return e.target; })
            streamKeyUp$.subscribe((elem) => {
                var cell = document.getElementById(elem.className);
                cell.innerText = elem.innerText;
            });

            var streamFxBlur$ = Observable.fromEvent(element, 'blur')
                .map(function (e) { return e; })
            streamFxBlur$.subscribe((e) => {
                var dupdata = this.props.data;
                var j = alpha.indexOf(e.target.className[0]);
                var i = Number(e.target.className.substr(1, e.target.className.length)) - 1;
                this.checkBlur(i, j, "zaq", e);
                var cell = document.getElementById(e.target.className);
                cell.innerText = dupdata[i][j]["value"];
            });

            var streamFxClick$ = Observable.fromEvent(element, 'click')
                .map(function (e) { return e; })
            streamFxClick$.subscribe((e) => {
                var cell = document.getElementById(e.target.className);
                cell.innerText = e.target.innerText;
            });

        }
    }

    refCallback = (item) => {
        var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var dupdata = this.props.data;
        if (item) {
            item.contentEditable = true;
            var element = ReactDOM.findDOMNode(item);

            var streamFocus$ = Observable.fromEvent(element, 'focus')
                .map(function (e) { return e.target; })
            streamFocus$.subscribe((elem) => {
                this.prevValue.push(elem.innerText);
            });

            var streamBlur$ = Observable.fromEvent(element, 'blur')
                .map(function (e) { return e; })
            streamBlur$.subscribe((e) => {
                var j = alpha.indexOf(e.target.id[0]);
                var i = Number(e.target.id.substr(1, e.target.id.length)) - 1;
                this.checkBlur(i, j, "zaq", e);
            });

            var streamKeyUp$ = Observable.fromEvent(element, 'keyup')
                .map(function (e) { return e.target; })
            streamKeyUp$.subscribe((elem) => {
                var fxelem = document.getElementById("fbar");
                fxelem.innerText = elem.innerText;
                fxelem.className = elem.id;
            });

            var streamClick$ = Observable.fromEvent(element, 'click')
                .map(function (e) { return e.target; })
            streamClick$.subscribe((elem) => {
                var j = alpha.indexOf(elem.id[0]);
                var i = Number(elem.id.substr(1, elem.id.length)) - 1;
                var data;
                if (Object.keys(dupdata[i][j]["fx"]).length > 0) {
                    data = dupdata[i][j]["fx"]["formula"];
                }
                else if (dupdata[i][j]["url"]) {
                    data = dupdata[i][j]["url"];
                }
                else {
                    data = dupdata[i][j]["value"];
                }
                var fxelem = document.getElementById("fbar");
                fxelem.innerText = data;
                fxelem.className = elem.id;
            });
        }
    }

    renderHead = (data) => {
        var dupData = data;
        if (dupData[0]) {
            var len = dupData[0].length;
            let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            var a = [<th key="blank"></th>];
            var me = this;
            dupData[0].map(function (col, i) {
                a.push(<th key={i}>{alpha[i]} <button style={{ color: 'red' }} id={i} onClick={() => { me.delCol(i) }}>X</button> </th>);
            });
            return (<tr key="header">{a}</tr>);
        }
    }

    renderData = (row, i) => {
        let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var dupdata = row;
        let len = dupdata.length;
        var a = [];
        a.push(<td key={i}>{i + 1}</td>);
        a.push(dupdata.map((col, j) => {
            var s = alpha[j] + (i + 1);
            return (
                <td
                    ref={this.refCallback}
                    key={s}
                    id={s}
                    style={{ color: dupdata[j]['color'] }}
                    className={s}
                >{dupdata[j]['value']}</td>
            );
        }));
        a.push(<button style={{ color: 'red' }} onClick={() => { this.delRow(i) }}>X</button>);
        return (<tr key={i}>{a}</tr>);
    }

    render() {
        return (
            <div>
                <button id="save" onClick={this.saveData.bind(this)}>SAVE</button>
                <button id="addRow" onClick={this.addRow.bind(this)}>ADD ROW</button>
                <button id="addCol" onClick={this.addColumn.bind(this)}>ADD COLUMN</button>
                <table><tbody><tr><td>fxbar:</td><td id="fbar" ref={this.refFxCallback} >{this.props.vad}</td></tr></tbody></table>
                <table>
                    <thead>{this.renderHead(this.props.data)}</thead>
                    <tbody>{this.props.data.map(this.renderData)}</tbody>
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
        vad: state.vad
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchData: bindActionCreators(fetchData, dispatch),
        checkIntegerAction: bindActionCreators(checkIntegerAction, dispatch),
        postData: bindActionCreators(postData, dispatch),
        applyFunc: bindActionCreators(applyFunc, dispatch),
        addData: bindActionCreators(addData, dispatch),
        deleteRow: bindActionCreators(deleteRow, dispatch),
        deleteCol: bindActionCreators(deleteCol, dispatch),
        addColData: bindActionCreators(addColData, dispatch),
        inputEdit: bindActionCreators(inputEdit, dispatch),
        writeUrl: bindActionCreators(writeUrl, dispatch),
        runUrl: bindActionCreators(runUrl, dispatch),
        stringColor: bindActionCreators(stringColor, dispatch),
        changeColor: bindActionCreators(changeColor, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActualData);
