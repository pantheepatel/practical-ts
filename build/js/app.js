"use strict";
// FEATURE: added event delegation on mainTable.
// import { changeTheme } from "./storage";
// import { main, inputField, inputFieldHistory, point } from "./event";
// import { changeButton, Calculator } from "./calculator";
// code of events.ts
let main = document.getElementById("main");
let inputField = document.getElementById("spanOutput");
let inputFieldHistory = document.getElementById("spanOutputHistory");
let point = document.getElementById("point");
function changeTheme() {
    let themeClass;
    if (main?.classList.contains("theme_light")) {
        main.classList.replace("theme_light", "theme_dark"); // dark mode
        themeClass = "theme_dark";
    }
    else {
        main?.classList.replace("theme_dark", "theme_light"); // light mode
        themeClass = "theme_light";
    }
    try {
        sessionStorage.setItem('theme', themeClass);
    }
    catch (err) {
        console.error(`error in storing theme: ${err}`);
    }
}
// code of calculator.js 
// change buttons normal - when clicking 2nd btn
const changeButton = function () {
    console.log("in chnage buttons");
    document.querySelectorAll(".btnTd").forEach((ele) => {
        ele.classList.toggle("swap");
    });
};
let operatorsBasic = ["+", "-", "/", "*", "%"];
class Calculator {
    display;
    displayCurrVal = "";
    displayExp;
    currentValue = "";
    isAns = false;
    isConstant = false;
    addpoint = true;
    constructor(displayEle, displayExpEle) {
        this.display = displayEle;
        this.displayCurrVal = "";
        this.displayExp = displayExpEle;
        this.currentValue = "";
        this.isAns = false;
        this.isConstant = false;
        this.addpoint = true;
    }
    appendValue(value) {
        if (value === ".") {
            if (!this.displayCurrVal) {
                this.displayCurrVal = "0.";
                this.updateDisplay();
                return;
            }
            else if (!this.displayCurrVal.includes('.')) {
                console.log("in point: ", value);
                this.displayCurrVal += ".";
                this.updateDisplay();
                return;
            }
            return;
        }
        if (value === "(" || value === ")") {
            return this.handleBrackets(value);
        }
        if (value === "0" && this.displayCurrVal === "") {
            return;
        }
        if (this.displayCurrVal === "" && !this.currentValue) {
            console.log("blank");
            // document.getElementById("zero").setAttribute('disabled');
            if (operatorsBasic.includes(value)) {
                this.displayCurrVal = "";
                this.updateTopDisplay("0", value);
            }
            else if (!isNaN(value)) {
                this.displayCurrVal += value;
                this.updateDisplay();
            }
            else if (value === "(") {
                this.updateTopDisplay("(", "");
            }
            // else if (value === "(") {
            //     this.updateTopDisplay("(0", "")
            // }
            // else if (this.isConstant) {
            //     console.log("direct constant")
            //     this.displayCurrVal = value;
            //     this.updateDisplay()
            // }
        }
        else if (this.isAns && this.displayCurrVal) {
            console.log("ans");
            if (operatorsBasic.includes(value)) {
                this.updateTopDisplay(this.displayCurrVal, value);
                this.isAns = false;
            }
            else if (!isNaN(value)) {
                console.log("in here: ", this.isAns);
                this.displayCurrVal = value;
                this.updateDisplay();
                this.isAns = false;
            }
        }
        else if (this.isConstant && this.displayCurrVal) {
            console.log("constant");
            if (operatorsBasic.includes(value)) {
                this.updateTopDisplay(this.displayCurrVal, value);
            }
            else if (!isNaN(value)) {
                this.displayCurrVal = value;
                this.updateDisplay();
            }
            this.isConstant = false;
        }
        else {
            console.log("other case");
            if (this.currentValue && operatorsBasic.includes(this.currentValue.slice(-1)) && operatorsBasic.includes(value) && !this.displayCurrVal) {
                console.log("in replace", this.currentValue.slice(-1), value);
                this.replaceLast(-1, value);
            }
            else if (operatorsBasic.includes(value)) {
                console.log("in here");
                this.updateTopDisplay(this.displayCurrVal, value);
            }
            else if (!isNaN(value)) {
                this.displayCurrVal += value;
                this.updateDisplay();
            }
        }
    }
    updateTopDisplay(value = "", operator = "", ans = false, replace = false) {
        // console.log("in update top display: ", this.currentValue.toString())
        if (this.currentValue.length && !replace) {
            this.currentValue = this.currentValue + value + operator;
        }
        else {
            this.currentValue = value + operator;
        }
        // console.log("now: ",this.currentValue)
        this.displayExp.value = this.currentValue;
        if (!ans) {
            this.displayCurrVal = "";
            this.updateDisplay();
        }
    }
    clearDisplay() {
        if (this.displayCurrVal) {
            this.displayCurrVal = "";
            this.updateDisplay();
        }
        else if (this.displayCurrVal === "" && this.currentValue !== "") {
            this.currentValue = "";
            this.updateTopDisplay();
        }
        this.isAns = false;
        this.isConstant = false;
    }
    deleteLast() {
        // this.currentValue = this.currentValue.slice(0, -1);
        this.displayCurrVal = this.displayCurrVal.slice(0, -1);
        this.updateDisplay();
    }
    replaceLast(length, operator) {
        let updateStr = this.currentValue.slice(0, length);
        // this.displayCurrVal = this.currentValue.slice(0, length);
        this.updateTopDisplay(updateStr, operator, false, true);
    }
    updateDisplay() {
        this.display.value = this.displayCurrVal;
        // this.displayExp.value = this.currentValue;
        // console.log(this.displayCurrVal, this.currentValue)
    }
    basicOperations() {
        try {
            // Check for unbalanced brackets before evaluation
            if (!this.areBracketsBalanced()) {
                this.display.value = "Error: Unbalanced brackets";
                return;
            }
            let expression = this.currentValue;
            // completing a root or log operation
            if (expression.includes('Math.pow') || expression.includes('Math.log')) {
                if (this.displayCurrVal) {
                    // Complete the expression
                    if (expression.includes('Math.pow')) {
                        // if (expression.includes('* Math.pow(10,')) {
                        //     // EXP operation
                        //     expression = expression + this.displayCurrVal + ')';
                        // } 
                        // else {
                        // yRootX operation
                        expression = expression + this.displayCurrVal + ')';
                        // }
                    }
                    else if (expression.includes('Math.log')) {
                        expression = expression + this.displayCurrVal + ')';
                    }
                }
            }
            else {
                // Normal operation
                if (!this.displayCurrVal) {
                    expression = expression + expression.substring(0, expression.length - 1);
                }
                else {
                    expression = expression + this.displayCurrVal;
                }
            }
            let ans = eval(expression);
            this.currentValue = "";
            this.displayCurrVal = (ans !== 0) ? ans.toString() : "";
            this.updateDisplay();
            this.isAns = true;
            this.updateTopDisplay("", "", true);
        }
        catch (error) {
            this.display.value = "Error(In calculation)";
        }
    }
    handleBrackets(bracket) {
        // Opening bracket cases
        if (bracket === "(") {
            // Case 1: Empty calculator
            if (this.displayCurrVal === "" && !this.currentValue) {
                this.updateTopDisplay("(", "");
                return;
            }
            // Case 2: After an operator
            if (this.currentValue && operatorsBasic.includes(this.currentValue.slice(-1))) {
                this.currentValue += "(";
                this.updateTopDisplay();
                return;
            }
            // Case 3: After a number in displayCurrVal
            if (this.displayCurrVal) {
                this.updateTopDisplay(this.displayCurrVal, "*(");
                return;
            }
            // Default case: Just append the opening bracket
            this.currentValue += "(";
            this.updateTopDisplay();
        }
        // Closing bracket cases
        if (bracket === ")") {
            // Case 1: No opening bracket exists
            if (!this.currentValue.includes("(")) {
                return;
            }
            // Case 2: After a number in displayCurrVal
            if (this.displayCurrVal) {
                this.updateTopDisplay(this.displayCurrVal, ")");
                return;
            }
            // Case 3: After an operator (invalid case)
            if (operatorsBasic.includes(this.currentValue.slice(-1))) {
                return;
            }
            // Default case: Just append the closing bracket
            this.currentValue += ")";
            this.updateTopDisplay();
        }
    }
    ;
    // Add a method to check if brackets are balanced
    areBracketsBalanced() {
        let count = 0;
        for (let char of this.currentValue) {
            if (char === '(')
                count++;
            if (char === ')')
                count--;
            if (count < 0)
                return false; // More closing than opening brackets
        }
        return count === 0; // Should be zero if perfectly balanced
    }
    ;
    toggleSign() {
        if (this.displayCurrVal) {
            this.displayCurrVal = (-parseFloat(this.displayCurrVal)).toString();
            console.log("replace dis: ", this.displayCurrVal.length - 1);
            // this.replaceLast(-parseFloat(this.displayCurrVal.length));
            // this.currentValue += this.displayCurrVal
            this.updateDisplay();
        }
    }
    ;
    addConstants(value) {
        // console.log(value)
        if (value) {
            this.displayCurrVal = value;
            if (operatorsBasic.includes(this.currentValue.toString().slice(-1))) {
                this.currentValue += this.displayCurrVal;
            }
            else {
                this.currentValue = this.displayCurrVal;
            }
            this.isConstant = true;
            this.updateDisplay();
        }
    }
    absolute() {
        if (this.displayCurrVal !== "") {
            this.displayCurrVal = Math.abs(Number(this.displayCurrVal)).toString();
            // this.ans = true;
            this.updateDisplay();
        }
    }
    // root x, log, ln
    factorial() {
        let n = this.displayCurrVal ? Number(this.displayCurrVal) : 0;
        let res = 1;
        let i;
        for (i = 1; i <= n; i++) {
            res *= i;
        }
        this.displayCurrVal = res.toString();
        this.updateDisplay();
    }
    mathFunc(method) {
        let value = this.displayCurrVal;
        this.displayCurrVal = eval(`Math.${method}(${value})`);
        this.updateDisplay();
    }
    fixed() {
        let num = this.displayCurrVal;
        this.displayCurrVal = Number(num).toExponential().toString();
        this.updateDisplay();
    }
    xToY() {
        if (this.currentValue) {
            this.currentValue = this.currentValue.toString() + this.displayCurrVal + "**";
        }
        else if (this.currentValue === "" && this.displayCurrVal) {
            this.currentValue = this.displayCurrVal.toString() + "**";
        }
        this.updateTopDisplay();
    }
    yRootX() {
        if (this.displayCurrVal) {
            // Store the current value as the number to find root of
            let x = this.displayCurrVal;
            this.currentValue = `Math.pow(${x}, 1/`;
            this.displayCurrVal = "";
            this.updateDisplay();
            this.updateTopDisplay();
        }
    }
    ;
    logXbaseY() {
        if (this.displayCurrVal) {
            // Store the current value as the number to find log of
            let x = this.displayCurrVal;
            this.currentValue = `Math.log(${x})/Math.log(`;
            this.displayCurrVal = "";
            this.updateDisplay();
            this.updateTopDisplay();
        }
    }
    ;
    exp() {
        if (this.displayCurrVal) {
            // Store the current value as the coefficient
            let coefficient = this.displayCurrVal;
            this.currentValue = `${coefficient} * Math.pow(10,`;
            this.displayCurrVal = "";
            this.updateDisplay();
            this.updateTopDisplay();
        }
    }
    ;
    singleValue(method) {
        let num = this.displayCurrVal;
        if ((typeof eval(`Math.${method}`) === "function") && num) {
            this.displayCurrVal = eval(`Math.${method}(${num})`);
            this.updateDisplay();
        }
    }
    mathPowValue(power) {
        let num = Number(this.displayCurrVal);
        if (num) {
            this.displayCurrVal = Math.pow(num, power).toString();
        }
        this.updateDisplay();
    }
    basePowValue(base) {
        let power = Number(this.displayCurrVal);
        if (power) {
            this.displayCurrVal = Math.pow(base, power).toString();
            this.updateDisplay();
        }
    }
    basicTrigoFunc(method, isIns = false, degree = false) {
        let disValue = this.displayCurrVal;
        // console.log(value, method)
        if (disValue === "")
            return;
        let value = degree ? (disValue * Math.PI) / 180 : disValue;
        if (!isIns) {
            this.displayCurrVal = eval(`Math.${method}(${value})`);
        }
        else {
            this.displayCurrVal = (1 / eval(`Math.${method}(${value})`)).toString();
        }
        this.updateDisplay();
    }
}
// code of app.ts
// changes that are need to be done on page load
document.addEventListener("DOMContentLoaded", () => {
    let theme = localStorage.getItem("theme") || "theme_light";
    main?.classList.add(theme);
    const displayEle = document.getElementById("spanOutput");
    const displayExp = document.getElementById("spanOutputHistory");
    const calculator = new Calculator(displayEle, displayExp);
    // all event listners that are importtant
    let themeBtn = document.getElementById("changeThemeBtn");
    themeBtn.addEventListener("click", changeTheme);
    let themeBtnLg = document.getElementById("changeThemeBtnLg");
    themeBtnLg.addEventListener("click", changeTheme);
    let changeBtn = document.getElementById("changeButtons");
    changeBtn.addEventListener("click", changeButton);
    let mainTable = document.getElementById("mainTable");
    mainTable.addEventListener("click", function (event) {
        let constantsArr = { "pi": Math.PI, "e": Math.E };
        let oneValue = ["sqrt", "cbrt", "log10", "log", "abs", "ceil", "floor"];
        let pow = { "sqr": "2", "cube": "3", "inverse": "-1" };
        let basePow = { "2ToX": "2", "10ToX": "10", "eToX": Math.E };
        let targetEvent = event.target;
        if (targetEvent.tagName === "BUTTON") {
            const buttonValue = targetEvent.value;
            // console.log(buttonValue)
            if (buttonValue === "clear") {
                calculator.clearDisplay();
            }
            else if (buttonValue === "backspace") {
                calculator.deleteLast();
            }
            else if (buttonValue === "eq") {
                calculator.basicOperations();
            }
            else if (buttonValue in constantsArr) {
                calculator.addConstants(constantsArr[buttonValue]);
            }
            // for btn +/-
            else if (buttonValue === "toggleSign") {
                calculator.toggleSign();
            }
            else if (buttonValue === "absX") {
                calculator.absolute();
            }
            else if (buttonValue === "fact") {
                calculator.factorial();
            }
            else if (buttonValue === "xToY") {
                calculator.xToY();
            }
            else if (buttonValue === "yRootX") {
                calculator.yRootX();
            }
            else if (buttonValue === "logXbaseY") {
                calculator.logXbaseY();
            }
            else if (buttonValue === "exponent") {
                calculator.exp();
            }
            else if (oneValue.includes(buttonValue)) {
                calculator.singleValue(buttonValue);
            }
            else if (buttonValue in pow) {
                calculator.mathPowValue(pow[buttonValue]);
            }
            else if (buttonValue in basePow) {
                calculator.basePowValue(basePow[buttonValue]);
            }
            else {
                calculator.appendValue(buttonValue);
            }
        }
    });
    let degShow = false;
    document.getElementById("fixedDegree").addEventListener("click", function (event) {
        let buttonValue = event.target.id;
        // console.log(buttonValue)
        let deg = document.getElementById("degree");
        let degLable = document.getElementById("degreeLable");
        degLable.innerText = "RAD";
        if (buttonValue === "fixed") {
            calculator.fixed();
        }
        if (deg.checked) {
            degLable.innerText = "DEG";
            degShow = true;
        }
    });
    document.getElementById("mathFunc").addEventListener("click", function (event) {
        let func = ["ceil", "floor"];
        let targetEvent = event.target;
        if ((targetEvent).tagName === "BUTTON") {
            const buttonValue = targetEvent.value;
            if (func.includes(buttonValue)) {
                calculator.mathFunc(buttonValue);
            }
            else if (buttonValue === "absX") {
                calculator.absolute();
            }
        }
    });
    document.getElementById("trigonometry").addEventListener("click", function (event) {
        let trigoNormal = ["sin", "cos", "tan", "sec", "csc", "cot"];
        let trigoHyp = ["sinh", "cosh", "tanh", "sech", "csch", "coth"];
        let trigoIns = ["sin-1", "cos-1", "tan-1", "sec-1", "csc-1", "cot-1"];
        let trigoInsHyp = ["sin-1h", "cos-1h", "tan-1h", "sec-1h", "csc-1h", "cot-1h"];
        // these 2 arr are for calculation
        let basicTrigo = [
            { "sin": "sin" }, { "cos": "cos" }, { "tan": "tan" },
            { "sinh": "sinh" }, { "cosh": "cosh" }, { "tanh": "tanh" },
            { "sin-1": "asin" }, { "cos-1": "acos" }, { "tan-1": "atan" },
            { "sin-1h": "asinh" }, { "cos-1h": "acosh" }, { "tan-1h": "atanh" }
        ];
        let insTrigo = [
            { "csc": "sin" }, { "sec": "cos" }, { "cot": "tan" },
            { "csc": "sinh" }, { "sech": "cosh" }, { "coth": "tanh" },
            { "csc-1": "asin" }, { "sec-1": "acos" }, { "cot-1": "atan" },
            { "csc-1h": "asinh" }, { "sec-1h": "acosh" }, { "cot-1h": "atanh" }
        ];
        // for below array sin-cosec, cos-sec, tan-cot
        // let insTrigo = ["sin", "cos", "tan", "sinh", "cosh", "tanh", "sin-1", "cos-1", "tan-1", "sin-1h", "cos-1h", "tan-1h"]
        let isInverse = document.getElementById("changeButtonsIns").checked;
        let isHyp = document.getElementById("changeButtonsHyp").checked;
        const buttonValue = event.target.value;
        // console.log(isHyp, isInverse)
        let trigoElements = Array.from(document.getElementsByClassName("trigoFun"));
        if (isHyp && isInverse) {
            trigoElements.forEach((ele, index) => {
                ele.value = trigoInsHyp[index];
                ele.innerHTML = ele.value;
            });
        }
        else if (isHyp) {
            trigoElements.forEach((ele, index) => {
                ele.value = trigoHyp[index];
                ele.innerHTML = ele.value;
            });
        }
        else if (isInverse) {
            trigoElements.forEach((ele, index) => {
                ele.value = trigoIns[index];
                ele.innerHTML = ele.value;
            });
        }
        else {
            trigoElements.forEach((ele, index) => {
                ele.value = trigoNormal[index];
                ele.innerHTML = ele.value;
            });
        }
        let foundTrigo = basicTrigo.find(obj => Object.keys(obj)[0] === buttonValue);
        let foundInsTrigo = insTrigo.find(obj => Object.keys(obj)[0] === buttonValue);
        if (foundTrigo) {
            let method = Object.values(foundTrigo)[0]; // Extract corresponding function name
            calculator.basicTrigoFunc(method, false, degShow);
        }
        else if (foundInsTrigo) {
            let method = Object.values(foundInsTrigo)[0]; // Extract corresponding function name
            calculator.basicTrigoFunc(method, true, degShow);
        }
    });
});
