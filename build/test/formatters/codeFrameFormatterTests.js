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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var chalk_1 = require("chalk");
var lint_1 = require("../lint");
var utils_1 = require("./utils");
describe("CodeFrame Formatter", function () {
    var TEST_FILE = "formatters/codeFrameFormatter.test.ts";
    var sourceFile;
    var formatter;
    var colorsEnabled;
    before(function () {
        colorsEnabled = chalk_1.default.enabled;
        var Formatter = lint_1.TestUtils.getFormatter("codeFrame");
        sourceFile = lint_1.TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });
    after(function () {
        chalk_1.default.enabled = colorsEnabled;
    });
    it("formats failures with colors", function () {
        chalk_1.default.enabled = true;
        var maxPosition = sourceFile.getFullWidth();
        var failures = [
            utils_1.createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            utils_1.createFailure(sourceFile, 2, 3, "&<>'\" should be escaped", "escape", undefined, "error"),
            utils_1.createFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", "last-name", undefined, "error"),
            utils_1.createFailure(sourceFile, 0, maxPosition, "full failure", "full-name", undefined, "error"),
            utils_1.createFailure(sourceFile, 0, maxPosition, "warning failure", "warning-name", undefined, "warning"),
        ];
        var expectedResultColored = "formatters/codeFrameFormatter.test.ts\n            \u001B[31mfirst failure\u001B[39m \u001B[90m(first-name)\u001B[39m\n            \u001B[0m\u001B[31m\u001B[1m>\u001B[22m\u001B[39m\u001B[90m 1 | \u001B[39mmodule \u001B[33mCodeFrameModule\u001B[39m {\n            \u001B[90m 2 | \u001B[39m    \u001B[36mexport\u001B[39m \u001B[36mclass\u001B[39m \u001B[33mCodeFrameClass\u001B[39m {\n            \u001B[90m 3 | \u001B[39m        private name\u001B[33m:\u001B[39m string\u001B[33m;\u001B[39m\n            \u001B[90m 4 | \u001B[39m\u001B[0m\n\n            \u001B[31mfull failure\u001B[39m \u001B[90m(full-name)\u001B[39m\n            \u001B[0m\u001B[31m\u001B[1m>\u001B[22m\u001B[39m\u001B[90m 1 | \u001B[39mmodule \u001B[33mCodeFrameModule\u001B[39m {\n            \u001B[90m 2 | \u001B[39m    \u001B[36mexport\u001B[39m \u001B[36mclass\u001B[39m \u001B[33mCodeFrameClass\u001B[39m {\n            \u001B[90m 3 | \u001B[39m        private name\u001B[33m:\u001B[39m string\u001B[33m;\u001B[39m\n            \u001B[90m 4 | \u001B[39m\u001B[0m\n\n            \u001B[33mwarning failure\u001B[39m \u001B[90m(warning-name)\u001B[39m\n            \u001B[0m\u001B[31m\u001B[1m>\u001B[22m\u001B[39m\u001B[90m 1 | \u001B[39mmodule \u001B[33mCodeFrameModule\u001B[39m {\n            \u001B[90m 2 | \u001B[39m    \u001B[36mexport\u001B[39m \u001B[36mclass\u001B[39m \u001B[33mCodeFrameClass\u001B[39m {\n            \u001B[90m 3 | \u001B[39m        private name\u001B[33m:\u001B[39m string\u001B[33m;\u001B[39m\n            \u001B[90m 4 | \u001B[39m\u001B[0m\n\n            \u001B[31m&<>'\" should be escaped\u001B[39m \u001B[90m(escape)\u001B[39m\n            \u001B[0m\u001B[31m\u001B[1m>\u001B[22m\u001B[39m\u001B[90m 1 | \u001B[39mmodule \u001B[33mCodeFrameModule\u001B[39m {\n            \u001B[90m   | \u001B[39m \u001B[31m\u001B[1m^\u001B[22m\u001B[39m\n            \u001B[90m 2 | \u001B[39m    \u001B[36mexport\u001B[39m \u001B[36mclass\u001B[39m \u001B[33mCodeFrameClass\u001B[39m {\n            \u001B[90m 3 | \u001B[39m        private name\u001B[33m:\u001B[39m string\u001B[33m;\u001B[39m\n            \u001B[90m 4 | \u001B[39m\u001B[0m\n\n            \u001B[31mlast failure\u001B[39m \u001B[90m(last-name)\u001B[39m\n            \u001B[0m \u001B[90m  7 | \u001B[39m        }\n            \u001B[90m  8 | \u001B[39m    }\n            \u001B[31m\u001B[1m>\u001B[22m\u001B[39m\u001B[90m  9 | \u001B[39m}\n            \u001B[90m    | \u001B[39m\u001B[31m\u001B[1m^\u001B[22m\u001B[39m\n            \u001B[90m 10 | \u001B[39m\u001B[0m\n\n        ";
        /** Convert output lines to an array of trimmed lines for easier comparing */
        function toTrimmedLines(lines) {
            return lines.split("\n").map(function (line) { return line.trim(); });
        }
        var expectedResult = toTrimmedLines(expectedResultColored);
        var result = toTrimmedLines(formatter.format(failures));
        chai_1.assert.deepEqual(result, expectedResult);
    });
    it("handles no failures", function () {
        var result = formatter.format([]);
        chai_1.assert.equal(result, "\n");
    });
});
//# sourceMappingURL=codeFrameFormatterTests.js.map