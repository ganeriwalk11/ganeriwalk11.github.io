import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Rx from "rxjs";
import { Observable } from 'rxjs/Observable';
import rootReducer from '../reducers/index';

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
export function setValue(newValue) {
    clearInterval(interval);
}
require("babel-polyfill");

class ActualData extends Component {
    constructor(props) {
        super(props);
        this.prevValue = [];
        this.flag = 0;
    }

    componentWillMount() {
        this.props.fetchData();
    }

    componentDidMount() {
        const saveBtn = document.getElementById('save');
        const addRowBtn = document.getElementById('addRow');
        const addColBtn = document.getElementById('addCol');

        const saveStream$ = Observable.fromEvent(saveBtn, 'click').subscribe((e) => this.props.postData(this.props.data));
        const addRowStream$ = Observable.fromEvent(addRowBtn, 'click').subscribe((e) => this.props.addData(this.props.data[0]));
        const addColStream$ = Observable.fromEvent(addColBtn, 'click').subscribe((e) => this.props.addColData(this.props.data));

        var URLstream$ = Observable.from(this.props.data).map(row ,i => {
            Observable.from(row).map((col,j) => {
                
            })
        })

        var URLstream$ = Observable.from(this.props.data).map(function (row, i) {
                var x = row.map(function (col, j) {
                    if (col['url'].length > 0) {
                        return [col['url'], i, j];
                    }
                    return 1;
                });
                for (var k = 0; k < x.length; k++) {
                    if (x[k] != 1)
                        return x[k];
                }
            }).subscribe(function (url) {
                if (url) {
                    me.checkBlur(url[1], url[2], url[0]);
                }
            }, function (err) {
                console.log(err);
            });
    }

    componentDidUpdate() {
        var me = this;
        if (!(me.flag)) {
            
            me.flag = 1;
        }
    }

    checkURL(i, j) {
        var data = this.props.data;
        Observable.of(data).map(function (data) {
            return data[i][j];
        }).subscribe(function (val) {
            if (val['url'].length) {
                val['url'] = "";
                clearInterval(interval);
            }
        });
    }

    checkDep = (i, j) => {
        var me = this;
        var dupdata = me.props.data;
        Observable.of(dupdata).map(function (dupdata) {
            if (dupdata[i][j]["dep"].length) {
                var deep = [];
                deep = dupdata[i][j]["dep"];
                deep.map(function (depf) {
                    var deprow = depf["row"];
                    var depcol = depf["column"];
                    var depformula = dupdata[deprow][depcol]["fx"]["formula"];
                    me.checkBlur(deprow, depcol, depformula);
                });
            }
        }).subscribe((val) => { });
    }

    checkFx = (i, j) => {
        var me = this;
        var dupdata = me.props.data;
        Observable.of(dupdata).map(function (dupdata) {
            if (Object.keys(dupdata[i][j]["fx"]).length > 0) {
                if ("op1i" in dupdata[i][j]["fx"]) {
                    var op1i = dupdata[i][j]["fx"]["op1i"];
                    var op1j = dupdata[i][j]["fx"]["op1j"];
                    dupdata[op1i][op1j]["dep"].map(function (depRow, l) {
                        if (depRow["column"] == j && depRow["row"] == i) {
                            dupdata[op1i][op1j]["dep"].splice(l, 1);
                        }
                    });
                }
                if ("op2i" in dupdata[i][j]["fx"]) {
                    var op2i = dupdata[i][j]["fx"]["op2i"];
                    var op2j = dupdata[i][j]["fx"]["op2j"];
                    dupdata[op2i][op2j]["dep"].map(function (depRow, l) {
                        if (depRow["column"] == j && depRow["row"] == i) {
                            dupdata[op2i][op2j]["dep"].splice(l, 1);
                        }
                    });
                }
                dupdata[i][j]['fx'] = {};
            }
        }).subscribe((val) => { });
    }

    checkBlur(i, j, q, event) {
        var dupdata = this.props.data;
        var me = this;
        let len = dupdata[0].length;
        var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var target;
        if (q != "zaq")
            target = q;
        else
            target = event.target.innerText;

        if (dupdata[i][j]["value"] != target) {
            if (this.prevValue[this.prevValue.length - 1] != target) {
                this.checkURL(i, j);
                if (target == parseInt(target, 10) || target == "") {
                    this.props.checkIntegerAction(i, j, target);
                    this.checkDep(i, j);
                    this.checkFx(i, j);
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
                            if (Number.isNaN(num)) {
                                this.props.stringColor(i, j, target, "red");
                                var me = this;
                                setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                this.checkDep(i, j);
                            }
                            else {
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
                                            if (Number.isNaN(num)) {
                                                this.props.stringColor(i, j, target, "red");
                                                var me = this;
                                                setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                                this.checkDep(i, j);
                                            }
                                            else {
                                                var op2 = numb;
                                                if (operator == '+')
                                                    target = op1 + op2;
                                                else
                                                    target = op1 - op2;
                                                this.props.stringColor(i, j, target, "darkblue");
                                                var me = this;
                                                setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                            }
                                        }

                                        else if (alpha.indexOf(target[z]) > -1 && alpha.indexOf(target[z]) < len) {
                                            let k = z + 1, nu = "";
                                            while (target[k] !== ')') {
                                                nu = nu + target[k++];
                                            }
                                            nu = Number(nu);
                                            if (Number.isNaN(num)) {
                                                this.props.stringColor(i, j, target, "red");
                                                var me = this;
                                                setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                                this.checkDep(i, j);
                                            }
                                            else {
                                                if (dupdata[nu - 1]) {
                                                    var op2i = nu - 1;
                                                    var op2j = alpha.indexOf(target[z]);
                                                    this.props.applyFunc(j, target, i, this.props.data, "darkblue", op1, "", "", "", op2i, op2j, operator);
                                                    var me = this;
                                                    setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                                }
                                                else {
                                                    this.props.stringColor(i, j, target, "red");
                                                    var me = this;
                                                    setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                                    this.checkDep(i, j);
                                                }
                                            }
                                        }
                                        else {
                                            this.props.stringColor(i, j, target, "red");
                                            var me = this;
                                            setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                            this.checkDep(i, j);
                                        }
                                    }
                                    else {
                                        this.props.stringColor(i, j, target, "red");
                                        var me = this;
                                        setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                        this.checkDep(i, j);
                                    }
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
                            if (Number.isNaN(num)) {
                                this.props.stringColor(i, j, target, "red");
                                var me = this;
                                setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                this.checkDep(i, j);
                            }
                            else {
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
                                                    this.props.stringColor(i, j, target, "red");
                                                    var me = this;
                                                    setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                                    this.checkDep(i, j);
                                                }
                                            }
                                            else {
                                                this.props.stringColor(i, j, target, "red");
                                                var me = this;
                                                setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                                this.checkDep(i, j);
                                            }
                                        }
                                        else {
                                            this.props.stringColor(i, j, target, "red");
                                            var me = this;
                                            setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                            this.checkDep(i, j);
                                        }
                                    }
                                }
                                else {
                                    this.props.stringColor(i, j, target, "red");
                                    var me = this;
                                    setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                                    this.checkDep(i, j);
                                }
                            }

                        }
                        else {
                            this.props.stringColor(i, j, target, "red");
                            var me = this;
                            setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                            this.checkDep(i, j);
                        }
                    }

                    else if (target[0] == 'u' && target[1] == 'r' && target[2] == 'l') {
                        var regex = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$");

                        var urlTest = target.slice(4, target.indexOf(','));
                        var timer = target.slice(target.indexOf(',') + 1, target.indexOf(')'));
                        if (regex.test(urlTest)) {
                            this.props.writeUrl(i, j, target, dupdata);
                            this.props.runUrl(i, j, urlTest, timer);
                            interval = setInterval(() => { this.props.runUrl(i, j, urlTest, timer) }, timer);
                        }
                        else {
                            this.props.stringColor(i, j, target, "red");
                            var me = this;
                            setTimeout(function () { me.props.changeColor(i, j, "black"); }, 500);
                            this.checkDep(i, j);
                        }
                    }
                    else {
                        this.props.stringColor(i, j, target, "red");
                        this.checkDep(i, j);
                    }
                }
            }
        }
    }

    colDelRefCallback = (col) => {
        if (col) {
            var me = this;
            var element = ReactDOM.findDOMNode(col);
            var delColStream$ = Observable.fromEvent(element, 'click').map(function (e) {
                return e;
            }).subscribe(function (e) { me.props.deleteCol(e.target.id) });
        }
    }

    rowDelRefCallback = (row) => {
        if (row) {
            var me = this;
            var element = ReactDOM.findDOMNode(row);
            var delRowStream$ = Observable.fromEvent(element, 'click').map(function (e) {
                return e;
            }).subscribe(function (e) { me.props.deleteRow(e.target.id) });
        }
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
        var me = this;
        var dupData = data;
        if (dupData[0]) {
            var len = dupData[0].length;
            let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            var dataHolder = [<th key="blank"></th>];
            var me = this;
            dupData[0].map(function (col, i) {
                dataHolder.push(<th key={i}>{alpha[i]} <button style={{ color: 'red' }} id={i} ref={me.colDelRefCallback}>X</button> </th>);
            });
            return (<tr key="header">{dataHolder}</tr>);
        }
    }

    renderData = (row, i) => {
        let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var dupdata = row;
        let len = dupdata.length;
        var dataHolder = [];
        dataHolder.push(<td key={i}>{i + 1}</td>);
        dataHolder.push(dupdata.map((col, j) => {
            var s = alpha[j] + (i + 1);
            return (
                <td
                    ref={this.refCallback}
                    key={s}
                    id={s}
                    style={{ color: dupdata[j]['color'], borderColor: dupdata[j]['color'] }}
                    className={s}
                >{dupdata[j]['value']}</td>
            );
        }));
        dataHolder.push(<button id={i} style={{ color: 'red' }} ref={this.rowDelRefCallback}>X</button>);
        return (<tr key={i}>{dataHolder}</tr>);
    }

    render() {
        return (
            <div>
                <button id="save" >SAVE</button>
                <button id="addRow">ADD ROW</button>
                <button id="addCol" >ADD COLUMN</button>
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
        writeUrl: bindActionCreators(writeUrl, dispatch),
        runUrl: bindActionCreators(runUrl, dispatch),
        stringColor: bindActionCreators(stringColor, dispatch),
        changeColor: bindActionCreators(changeColor, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActualData);
