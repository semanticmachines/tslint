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
var parse = require("../../src/verify/parse");
var testData = require("./testData");
describe("Rule Test Parse", function () {
    describe("removeErrorMarkup", function () {
        it("should return the contents of a regular string unchanged", function () {
            chai_1.assert.strictEqual(parse.removeErrorMarkup(testData.lintStr1), testData.codeStr1);
        });
        it("should remove a single-line error markup correctly", function () {
            chai_1.assert.strictEqual(parse.removeErrorMarkup(testData.lintStr2), testData.codeStr2);
        });
        it("should remove a mix of error markup correctly", function () {
            chai_1.assert.strictEqual(parse.removeErrorMarkup(testData.lintStr3), testData.codeStr3);
        });
        it("should handle message substitutions correctly", function () {
            chai_1.assert.strictEqual(parse.removeErrorMarkup(testData.lintStr6), testData.codeStr6);
        });
        it("should handle nil-length errors correctly", function () {
            chai_1.assert.strictEqual(parse.removeErrorMarkup(testData.lintStr7), testData.codeStr7);
        });
    });
    describe("parseErrors", function () {
        it("should return no errors from a regular string", function () {
            chai_1.assert.deepEqual(parse.parseErrorsFromMarkup(testData.lintStr1), testData.resultErrs1);
        });
        it("should find a single-line error correctly", function () {
            chai_1.assert.deepEqual(parse.parseErrorsFromMarkup(testData.lintStr2), testData.resultErrs2);
        });
        it("should find a mix of errors correctly", function () {
            chai_1.assert.deepEqual(parse.parseErrorsFromMarkup(testData.lintStr3), testData.resultErrs3);
        });
        it("should handle message substitutions correctly", function () {
            chai_1.assert.deepEqual(parse.parseErrorsFromMarkup(testData.lintStr6), testData.resultErrs6);
        });
        it("should handle nil-length errors correctly", function () {
            chai_1.assert.deepEqual(parse.parseErrorsFromMarkup(testData.lintStr7), testData.resultErrs7);
        });
    });
    describe("createMarkupFromErrors", function () {
        it("should generate correct markup", function () {
            chai_1.assert.strictEqual(parse.createMarkupFromErrors(testData.codeStr5, testData.resultErrs5), testData.lintStr5);
        });
        it("should generate correct markup with nil-length errors", function () {
            chai_1.assert.strictEqual(parse.createMarkupFromErrors(testData.codeStr7, testData.resultErrs7), testData.lintStr7);
        });
    });
});
//# sourceMappingURL=parseTests.js.map