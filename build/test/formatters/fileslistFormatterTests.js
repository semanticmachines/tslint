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
describe("Files-list Formatter", function () {
    var TEST_FILE = "formatters/fileslistFormatter.test.ts";
    var sourceFile;
    var formatter;
    before(function () {
        var Formatter = lint_1.TestUtils.getFormatter("fileslist");
        sourceFile = lint_1.TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });
    it("formats failures", function () {
        // this part really doesn't matter, as long as we get some failure`
        var failures = [
            utils_1.createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            utils_1.createFailure(sourceFile, 32, 36, "last failure", "last-name", undefined, "error"),
        ];
        // we only print file-names in this formatter
        var expectedResult = TEST_FILE + "\n";
        var actualResult = formatter.format(failures);
        chai_1.assert.equal(actualResult, expectedResult);
    });
    it("handles no failures", function () {
        var result = formatter.format([]);
        chai_1.assert.equal(result, "");
    });
});
//# sourceMappingURL=fileslistFormatterTests.js.map