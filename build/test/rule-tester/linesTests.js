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
var chai_1 = require("chai");
var lines = require("../../src/verify/lines");
describe("Rule Test Lines", function () {
    describe("createErrorString", function () {
        it("should correctly create strings", function () {
            var code1 = "this is a line of code";
            var errorLine1 = new lines.MultilineErrorLine(2);
            var errorMarkup1 = "  ~~~~~~~~~~~~~~~~~~~~";
            chai_1.assert.strictEqual(lines.printLine(errorLine1, code1), errorMarkup1);
            var code2 = "another line of code here";
            var errorLine2 = new lines.EndErrorLine(0, code2.length, "foo");
            var errorMarkup2 = "~~~~~~~~~~~~~~~~~~~~~~~~~ [foo]";
            chai_1.assert.strictEqual(lines.printLine(errorLine2, code2), errorMarkup2);
        });
        it("should correctly create strings with empty lines of code", function () {
            var code1 = "";
            var errorLine1 = new lines.MultilineErrorLine(0);
            var errorMarkup1 = lines.ZERO_LENGTH_ERROR;
            chai_1.assert.strictEqual(lines.printLine(errorLine1, code1), errorMarkup1);
            var code2 = "";
            var errorLine2 = new lines.EndErrorLine(0, 0, "foo");
            var errorMarkup2 = lines.ZERO_LENGTH_ERROR + " [foo]";
            chai_1.assert.strictEqual(lines.printLine(errorLine2, code2), errorMarkup2);
        });
    });
});
//# sourceMappingURL=linesTests.js.map