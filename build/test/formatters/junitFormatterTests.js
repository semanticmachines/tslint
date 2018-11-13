"use strict";
/**
 * @license
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
var chai_1 = require("chai");
var lint_1 = require("../lint");
var utils_1 = require("./utils");
describe("JUnit Formatter", function () {
    var TEST_FILE_1 = "formatters/jsonFormatter.test.ts"; // reuse existing sample file
    var TEST_FILE_2 = "formatters/pmdFormatter.test.ts"; // reuse existing sample file
    var sourceFile1;
    var sourceFile2;
    var formatter;
    before(function () {
        var Formatter = lint_1.TestUtils.getFormatter("junit");
        sourceFile1 = lint_1.TestUtils.getSourceFile(TEST_FILE_1);
        sourceFile2 = lint_1.TestUtils.getSourceFile(TEST_FILE_2);
        formatter = new Formatter();
    });
    it("formats failures", function () {
        var maxPosition1 = sourceFile1.getFullWidth();
        var maxPosition2 = sourceFile2.getFullWidth();
        var failures = [
            utils_1.createFailure(sourceFile1, 0, 1, "first failure", "first-name", undefined, "error"),
            utils_1.createFailure(sourceFile1, 2, 3, "&<>'\" should be escaped", "escape", undefined, "error"),
            utils_1.createFailure(sourceFile1, maxPosition1 - 1, maxPosition1, "last failure", "last-name", undefined, "error"),
            utils_1.createFailure(sourceFile2, 0, 1, "first failure", "first-name", undefined, "error"),
            utils_1.createFailure(sourceFile2, 2, 3, "&<>'\" should be escaped", "escape", undefined, "warning"),
            utils_1.createFailure(sourceFile2, maxPosition2 - 1, maxPosition2, "last failure", "last-name", undefined, "warning"),
        ];
        var expectedResult = ("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n            <testsuites package=\"tslint\">\n                <testsuite name=\"" + TEST_FILE_1 + "\">\n                    <testcase name=\"Line 1, Column 1: first-name\">\n                        <failure type=\"error\">first failure</failure>\n                    </testcase>\n                    <testcase name=\"Line 1, Column 3: escape\">\n                        <failure type=\"error\">&amp;&lt;&gt;&#39;&quot; should be escaped</failure>\n                    </testcase>\n                    <testcase name=\"Line 6, Column 3: last-name\">\n                        <failure type=\"error\">last failure</failure>\n                    </testcase>\n                </testsuite>\n                <testsuite name=\"" + TEST_FILE_2 + "\">\n                    <testcase name=\"Line 1, Column 1: first-name\">\n                        <failure type=\"error\">first failure</failure>\n                    </testcase>\n                    <testcase name=\"Line 1, Column 3: escape\">\n                        <failure type=\"warning\">&amp;&lt;&gt;&#39;&quot; should be escaped</failure>\n                    </testcase>\n                    <testcase name=\"Line 6, Column 3: last-name\">\n                        <failure type=\"warning\">last failure</failure>\n                    </testcase>\n                </testsuite>\n            </testsuites>").replace(/>\s+/g, ">"); // Remove whitespace between tags;
        chai_1.assert.equal(formatter.format(failures), expectedResult);
    });
    it("handles no failures", function () {
        var result = formatter.format([]);
        chai_1.assert.deepEqual(result, '<?xml version="1.0" encoding="utf-8"?><testsuites package="tslint"></testsuites>');
    });
});
//# sourceMappingURL=junitFormatterTests.js.map