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
describe("Verbose Formatter", function () {
    var TEST_FILE = "formatters/proseFormatter.test.ts";
    var sourceFile;
    var formatter;
    before(function () {
        var Formatter = lint_1.TestUtils.getFormatter("verbose");
        sourceFile = lint_1.TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });
    it("formats failures", function () {
        var maxPosition = sourceFile.getFullWidth();
        var failures = [
            utils_2.createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            utils_2.createFailure(sourceFile, 32, 36, "mid failure", "mid-name", undefined, "error"),
            utils_2.createFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", "last-name", undefined, "error"),
        ];
        var expectedResult = utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            ERROR: (first-name) ", "", "first failure\n            ERROR: (mid-name) ", "", "mid failure\n            ERROR: (last-name) ", "", "last failure\n"], ["\n            ERROR: (first-name) ", "", "first failure\n            ERROR: (mid-name) ", "", "mid failure\n            ERROR: (last-name) ", "", "last failure\\n"])), TEST_FILE, getPositionString(1, 1), TEST_FILE, getPositionString(2, 12), TEST_FILE, getPositionString(9, 2)).slice(1); // remove leading newline
        var actualResult = formatter.format(failures);
        chai_1.assert.equal(actualResult, expectedResult);
    });
    it("handles no failures", function () {
        var result = formatter.format([]);
        chai_1.assert.equal(result, "\n");
    });
    function getPositionString(line, character) {
        return "[" + line + ", " + character + "]: ";
    }
});
var templateObject_1;
//# sourceMappingURL=verboseFormatterTests.js.map