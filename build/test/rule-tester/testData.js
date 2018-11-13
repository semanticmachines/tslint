"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:object-literal-sort-keys no-consecutive-blank-lines */
exports.lintStr1 = "\nYay some file contents\nThat have ~~ in it in the middle\nAnd some brackets too   [brackets are here]\n~~~ And even lines that start with   [tildes]\n";
exports.codeStr1 = exports.lintStr1;
exports.resultErrs1 = [];
exports.lintStr2 = "\nA file with an error\n~~~~~                  [error]\n";
exports.codeStr2 = "\nA file with an error\n";
exports.resultErrs2 = [
    { startPos: { line: 1, col: 0 }, endPos: { line: 1, col: 5 }, message: "error" },
];
exports.lintStr3 = "\nA file with lots of errors\n~~~~~                  [error]\n    ~~~~~~~~~~~~~      [error2]\n   ~~~~~~~~~~~~~~~~~~~~~~~\n   Some more code goes here\n~~~~~~~~~~~~~~~~~~~~~~~~~~~\n~~~~~~~~~~~~~~~~~~~~~~~~~~~\n   And more code here\n~~~~~~~~~~~~    [multiline error1]\n~~~~~~~~~~~~~~~~~~~~~\n      ~  [error3: fun]\n   Final code here\n~~  [multiline error2]\n";
exports.codeStr3 = "\nA file with lots of errors\n   Some more code goes here\n   And more code here\n   Final code here\n";
exports.resultErrs3 = [
    { startPos: { line: 1, col: 0 }, endPos: { line: 1, col: 5 }, message: "error" },
    { startPos: { line: 1, col: 3 }, endPos: { line: 3, col: 12 }, message: "multiline error1" },
    { startPos: { line: 1, col: 4 }, endPos: { line: 1, col: 17 }, message: "error2" },
    { startPos: { line: 2, col: 0 }, endPos: { line: 4, col: 2 }, message: "multiline error2" },
    { startPos: { line: 3, col: 6 }, endPos: { line: 3, col: 7 }, message: "error3: fun" },
];
exports.lintStr4 = "";
exports.codeStr4 = "";
exports.resultErrs4 = [];
// this is a ideally formatted lint string, errors ordered by start position,
// error messages one space after end of line of code above
exports.lintStr5 = "\nsomeObject.someProperty.doSomething();\n          ~~~~~~~~~~~~~                [unsafe access]\n            ~~~~~~~~~~~~~~~~~~~~~~~~~~\nsomeVar <- someObject.crazyMethod(arg1, arg2, arg3);\n~~~~~~~                                              [another error]\n";
exports.codeStr5 = "\nsomeObject.someProperty.doSomething();\nsomeVar <- someObject.crazyMethod(arg1, arg2, arg3);\n";
exports.resultErrs5 = [
    { startPos: { line: 1, col: 10 }, endPos: { line: 1, col: 23 }, message: "unsafe access" },
    { startPos: { line: 1, col: 12 }, endPos: { line: 2, col: 7 }, message: "another error" },
];
exports.lintStr6 = "\nif (code === lint-error-free) {\n             ~~~~~~~~~~~~~~~    [err]\n}\n\n[err]: A longer error message I didn't want to type every time!\n";
exports.codeStr6 = "\nif (code === lint-error-free) {\n}\n\n";
exports.resultErrs6 = [
    {
        startPos: { line: 1, col: 13 },
        endPos: { line: 1, col: 28 },
        message: "A longer error message I didn't want to type every time!",
    },
];
exports.lintStr7 = "\nsomeCode.something();\n ~nil                 [some error]\nmore code {\n\n~nil\n\n~nil [another error]\n}\n";
exports.codeStr7 = "\nsomeCode.something();\nmore code {\n\n\n}\n";
exports.resultErrs7 = [
    { startPos: { line: 1, col: 1 }, endPos: { line: 1, col: 1 }, message: "some error" },
    { startPos: { line: 3, col: 0 }, endPos: { line: 4, col: 0 }, message: "another error" },
];
/* tslint:enable:object-literal-sort-keys */
//# sourceMappingURL=testData.js.map