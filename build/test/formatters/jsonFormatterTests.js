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
var lint_1 = require("../lint");
var utils_1 = require("./utils");
describe("JSON Formatter", function () {
    var TEST_FILE = "formatters/jsonFormatter.test.ts";
    var sourceFile;
    var formatter;
    before(function () {
        var Formatter = lint_1.TestUtils.getFormatter("json");
        sourceFile = lint_1.TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });
    it("formats failures", function () {
        var maxPosition = sourceFile.getFullWidth();
        var failures = [
            utils_1.createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            utils_1.createFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", "last-name", undefined, "error"),
            utils_1.createFailure(sourceFile, 0, maxPosition, "full failure", "full-name", new lint_1.Replacement(0, 0, ""), "error"),
        ];
        /* tslint:disable:object-literal-sort-keys */
        var expectedResult = [
            {
                name: TEST_FILE,
                failure: "first failure",
                startPosition: {
                    position: 0,
                    line: 0,
                    character: 0,
                },
                endPosition: {
                    position: 1,
                    line: 0,
                    character: 1,
                },
                ruleName: "first-name",
                ruleSeverity: "ERROR",
            },
            {
                name: TEST_FILE,
                failure: "last failure",
                startPosition: {
                    position: maxPosition - 1,
                    line: 5,
                    character: 2,
                },
                endPosition: {
                    position: maxPosition,
                    line: 6,
                    character: 0,
                },
                ruleName: "last-name",
                ruleSeverity: "ERROR",
            },
            {
                name: TEST_FILE,
                failure: "full failure",
                fix: {
                    innerLength: 0,
                    innerStart: 0,
                    innerText: "",
                },
                startPosition: {
                    position: 0,
                    line: 0,
                    character: 0,
                },
                endPosition: {
                    position: maxPosition,
                    line: 6,
                    character: 0,
                },
                ruleName: "full-name",
                ruleSeverity: "ERROR",
            },
        ];
        /* tslint:enable:object-literal-sort-keys */
        var actualResult = JSON.parse(formatter.format(failures));
        chai_1.assert.deepEqual(actualResult, expectedResult);
    });
    it("handles no failures", function () {
        var result = JSON.parse(formatter.format([]));
        chai_1.assert.deepEqual(result, []);
    });
});
//# sourceMappingURL=jsonFormatterTests.js.map