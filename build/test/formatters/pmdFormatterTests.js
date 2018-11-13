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
describe("PMD Formatter", function () {
    var TEST_FILE = "formatters/pmdFormatter.test.ts";
    var sourceFile;
    var formatter;
    before(function () {
        var Formatter = lint_1.TestUtils.getFormatter("pmd");
        sourceFile = lint_1.TestUtils.getSourceFile(TEST_FILE);
        formatter = new Formatter();
    });
    it("formats failures", function () {
        var maxPosition = sourceFile.getFullWidth();
        var failures = [
            utils_1.createFailure(sourceFile, 0, 1, "first failure", "first-name", undefined, "error"),
            utils_1.createFailure(sourceFile, 2, 3, "&<>'\" should be escaped", "escape", undefined, "error"),
            utils_1.createFailure(sourceFile, maxPosition - 1, maxPosition, "last failure", "last-name", undefined, "warning"),
            utils_1.createFailure(sourceFile, 0, maxPosition, "full failure", "full-name", undefined, "warning"),
        ];
        var expectedResult = "<pmd version=\"tslint\">\n                <file name=\"formatters/pmdFormatter.test.ts\">\n                    <violation begincolumn=\"1\" beginline=\"1\" priority=\"3\" rule=\"first failure\">\n                    </violation>\n                </file>\n                <file name=\"formatters/pmdFormatter.test.ts\">\n                    <violation begincolumn=\"3\" beginline=\"1\" priority=\"3\" rule=\"&amp;&lt;&gt;&#39;&quot; should be escaped\">\n                    </violation>\n                </file>\n                <file name=\"formatters/pmdFormatter.test.ts\">\n                    <violation begincolumn=\"3\" beginline=\"6\" priority=\"4\" rule=\"last failure\">\n                    </violation>\n                </file>\n                <file name=\"formatters/pmdFormatter.test.ts\">\n                    <violation begincolumn=\"1\" beginline=\"1\" priority=\"4\" rule=\"full failure\">\n                    </violation>\n                </file>\n            </pmd>".replace(/>\s+/g, ">"); // Remove whitespace between tags
        chai_1.assert.equal(formatter.format(failures), expectedResult);
    });
    it("handles no failures", function () {
        var result = formatter.format([]);
        chai_1.assert.deepEqual(result, '<pmd version="tslint"></pmd>');
    });
});
//# sourceMappingURL=pmdFormatterTests.js.map