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
var path = require("path");
var lint_1 = require("../lint");
var utils_1 = require("./utils");
describe("MSBuild Formatter", function () {
    var TEST_FILE = "formatters/msbuildFormatter.test.ts";
    var sourceFile;
    var formatter;
    before(function () {
        var Formatter = lint_1.TestUtils.getFormatter("msbuild");
        sourceFile = lint_1.TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });
    it("formats failures", function () {
        var maxPosition = sourceFile.getFullWidth();
        var failures = [
            utils_1.createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            utils_1.createFailure(sourceFile, 32, 36, "mid failure", "mid-name", undefined, "error"),
            utils_1.createFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", "last-name", undefined, "warning"),
        ];
        var expectedResult = getFailureString(TEST_FILE, 1, 1, "first failure", "firstName", "error") +
            getFailureString(TEST_FILE, 2, 12, "mid failure", "midName", "error") +
            getFailureString(TEST_FILE, 9, 2, "last failure", "lastName", "warning");
        var actualResult = formatter.format(failures);
        chai_1.assert.equal(actualResult, expectedResult);
    });
    it("handles no failures", function () {
        var result = formatter.format([]);
        chai_1.assert.equal(result, "\n");
    });
    function getFailureString(file, line, character, reason, ruleCamelCase, severity) {
        return path.normalize(file) + "(" + line + "," + character + "): " + severity + " " + ruleCamelCase + ": " + reason + "\n";
    }
});
//# sourceMappingURL=msbuildFormatterTests.js.map