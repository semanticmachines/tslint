"use strict";
/**
 * @license
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
var fs = require("fs");
var path = require("path");
var all_1 = require("../src/configs/all");
var utils_1 = require("../src/utils");
var lint_1 = require("./lint");
var builtRulesDir = "build/src/rules";
var srcRulesDir = "src/rules";
var testRulesDir = "test/rules";
describe("Rule Loader", function () {
    it("loads core rules", function () {
        var validConfiguration = [
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "class-name",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "eofline",
                ruleSeverity: "error",
            },
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "no-debugger",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: ["double"],
                ruleName: "quotemark",
                ruleSeverity: "error",
            },
        ];
        var rules = lint_1.loadRules(validConfiguration, builtRulesDir);
        chai_1.assert.equal(rules.length, 5);
    });
    it("ignores off rules", function () {
        var validConfiguration = [
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "off", disabledIntervals: [] },
        ];
        var rules = lint_1.loadRules(validConfiguration, builtRulesDir);
        chai_1.assert.equal(rules.length, 0);
    });
    it("ignores invalid rules", function () {
        var invalidConfiguration = [
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "class-name",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "invalidConfig1",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "invalidConfig2",
                ruleSeverity: "off",
            },
        ];
        var rules = lint_1.loadRules(invalidConfiguration, [builtRulesDir]);
        chai_1.assert.equal(rules.length, 1);
    });
    it("properly sets rule severity with options", function () {
        var withOptions = [
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "callable-types",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [140],
                ruleName: "max-line-length",
                ruleSeverity: "warning",
            },
        ];
        var rules = lint_1.loadRules(withOptions, [builtRulesDir]);
        chai_1.assert.equal(rules.length, 2);
        chai_1.assert.equal(rules[0].getOptions().ruleSeverity, "error");
        chai_1.assert.equal(rules[1].getOptions().ruleSeverity, "warning");
    });
    it("works with rulesDirectory argument as an Array", function () {
        var validConfiguration = [
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "class-name",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "eofline",
                ruleSeverity: "error",
            },
            { ruleName: "forin", ruleArguments: [], ruleSeverity: "error", disabledIntervals: [] },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "no-debugger",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: ["double"],
                ruleName: "quotemark",
                ruleSeverity: "error",
            },
        ];
        var rules = lint_1.loadRules(validConfiguration, [builtRulesDir]);
        chai_1.assert.equal(rules.length, 5);
    });
    it("loads rules for JS files, excluding typescript-only ones", function () {
        var validConfiguration = [
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "class-name",
                ruleSeverity: "error",
            },
            {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "await-promise",
                ruleSeverity: "error",
            },
        ];
        var rules = lint_1.loadRules(validConfiguration, builtRulesDir, true);
        chai_1.assert.equal(rules.length, 1);
    });
    it("tests exist for every rule", function () {
        var tests = fs
            .readdirSync(testRulesDir)
            .filter(function (file) {
            return !file.startsWith("_") &&
                fs.statSync(path.join(testRulesDir, file)).isDirectory();
        })
            .map(utils_1.camelize)
            .sort();
        chai_1.assert.deepEqual(everyRule(), tests, "List of rules doesn't match list of tests");
    });
    it("includes every rule in 'tslint:all'", function () {
        var expectedAllRules = everyRule().filter(function (ruleName) { return all_1.RULES_EXCLUDED_FROM_ALL_CONFIG.indexOf(ruleName) === -1; });
        var tslintAllRules = Object.keys(all_1.rules)
            .map(utils_1.camelize)
            .sort();
        chai_1.assert.deepEqual(expectedAllRules, tslintAllRules, "rule is missing in tslint:all");
    });
    it("resolves custom rule directories as relative paths", function () {
        var rule;
        chai_1.assert.doesNotThrow(function () {
            rule = lint_1.findRule("always-fail", "test/files/custom-rules");
        });
        chai_1.assert.isDefined(rule);
    });
    it("supports rulesDirectory set to empty string", function () {
        // see https://github.com/palantir/tslint/issues/3638
        chai_1.assert.doesNotThrow(function () {
            lint_1.findRule("always-fail", "");
        });
    });
    it("throws an error for invalid rulesDirectories", function () {
        chai_1.assert.throws(function () {
            lint_1.findRule("always-fail", "some/invalid/dir");
        });
    });
});
function everyRule() {
    return fs
        .readdirSync(srcRulesDir)
        .filter(function (file) { return /Rule.ts$/.test(file); })
        .map(function (file) { return file.substr(0, file.length - "Rule.ts".length); })
        .sort();
}
//# sourceMappingURL=ruleLoaderTests.js.map