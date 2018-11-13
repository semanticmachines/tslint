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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var utils_1 = require("../src/utils");
describe("Utils", function () {
    it("arrayify", function () {
        chai_1.assert.deepEqual(utils_1.arrayify(undefined), []);
        chai_1.assert.deepEqual(utils_1.arrayify(null), []);
        chai_1.assert.deepEqual(utils_1.arrayify([]), []);
        chai_1.assert.deepEqual(utils_1.arrayify("foo"), ["foo"]);
        chai_1.assert.deepEqual(utils_1.arrayify(1), [1]);
        chai_1.assert.deepEqual(utils_1.arrayify({ foo: 2 }), [{ foo: 2 }]);
        chai_1.assert.deepEqual(utils_1.arrayify([1, 2]), [1, 2]);
        chai_1.assert.deepEqual(utils_1.arrayify(["foo"]), ["foo"]);
    });
    it("dedent", function () {
        chai_1.assert.equal(utils_1.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            foo\n            bar"], ["\n            foo\n            bar"]))), "\nfoo\nbar");
        chai_1.assert.equal(utils_1.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["   one-line"], ["   one-line"]))), "one-line");
        chai_1.assert.equal(utils_1.dedent(templateObject_3 || (templateObject_3 = __makeTemplateObject(["  "], ["  "]))), "  ");
        chai_1.assert.equal(utils_1.dedent(templateObject_4 || (templateObject_4 = __makeTemplateObject([""], [""]))), "");
    });
    it("escapeRegExp", function () {
        var plus = utils_1.escapeRegExp("(a+|d)?b[ci]{2,}");
        var plusRe = new RegExp(plus);
        // contains substring that matches regular expression pattern
        chai_1.assert.equal(plusRe.test("regexpaaaabcicmatch"), false);
        // properly matches exact string with special characters
        chai_1.assert.equal(plusRe.test("string(a+|d)?b[ci]{2,}match"), true);
    });
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=utilsTests.js.map