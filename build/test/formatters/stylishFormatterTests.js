"use strict";
/*
 * Copyright 2013 Palantir Technologies, Inc.
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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var utils_1 = require("../../src/utils");
var lint_1 = require("../lint");
var utils_2 = require("./utils");
describe("Stylish Formatter", function () {
    var TEST_FILE = "formatters/stylishFormatter.test.ts";
    var sourceFile;
    var formatter;
    before(function () {
        var Formatter = lint_1.TestUtils.getFormatter("stylish");
        sourceFile = lint_1.TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });
    it("formats failures", function () {
        var maxPosition = sourceFile.getFullWidth();
        var failures = [
            utils_2.createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            utils_2.createFailure(sourceFile, 2, 3, "&<>'\" should be escaped", "escape", undefined, "error"),
            utils_2.createFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", "last-name", undefined, "error"),
            utils_2.createFailure(sourceFile, 0, maxPosition, "full failure", "full-name", undefined, "error"),
        ];
        var maxPositionObj = sourceFile.getLineAndCharacterOfPosition(maxPosition - 1);
        var maxPositionTuple = maxPositionObj.line + 1 + ":" + (maxPositionObj.character + 1);
        var expectedResult = utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            formatters/stylishFormatter.test.ts\u001B[8m:1:1\u001B[28m\n            \u001B[31mERROR: 1:1\u001B[39m  \u001B[90mfirst-name\u001B[39m  \u001B[33mfirst failure\u001B[39m\n            \u001B[31mERROR: 1:1\u001B[39m  \u001B[90mfull-name \u001B[39m  \u001B[33mfull failure\u001B[39m\n            \u001B[31mERROR: 1:3\u001B[39m  \u001B[90mescape    \u001B[39m  \u001B[33m&<>'\" should be escaped\u001B[39m\n            \u001B[31mERROR: ", "\u001B[39m  \u001B[90mlast-name \u001B[39m  \u001B[33mlast failure\u001B[39m\n"], ["\n            formatters/stylishFormatter.test.ts\\u001b[8m:1:1\\u001b[28m\n            \\u001b[31mERROR: 1:1\\u001b[39m  \\u001b[90mfirst-name\\u001b[39m  \\u001b[33mfirst failure\\u001b[39m\n            \\u001b[31mERROR: 1:1\\u001b[39m  \\u001b[90mfull-name \\u001b[39m  \\u001b[33mfull failure\\u001b[39m\n            \\u001b[31mERROR: 1:3\\u001b[39m  \\u001b[90mescape    \\u001b[39m  \\u001b[33m&<>'\\\" should be escaped\\u001b[39m\n            \\u001b[31mERROR: ", "\\u001b[39m  \\u001b[90mlast-name \\u001b[39m  \\u001b[33mlast failure\\u001b[39m\\n"])), maxPositionTuple).slice(1); // remove leading newline
        chai_1.assert.equal(formatter.format(failures), expectedResult);
    });
    it("handles no failures", function () {
        var result = formatter.format([]);
        chai_1.assert.equal(result, "\n");
    });
});
var templateObject_1;
//# sourceMappingURL=stylishFormatterTests.js.map