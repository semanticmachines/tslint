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
var fs = require("fs");
var path = require("path");
var configuration_1 = require("../src/configuration");
var utils_1 = require("./utils");
describe("Configuration", function () {
    describe("parseConfigFile", function () {
        it("parses empty config", function () {
            var rawConfig = {};
            var expected = getEmptyConfig();
            assertConfigEquals(configuration_1.parseConfigFile(rawConfig), expected);
        });
        it("arrayifies `extends`", function () {
            var rawConfig = {
                extends: "a",
            };
            var expected = getEmptyConfig();
            expected.extends = ["a"];
            assertConfigEquals(configuration_1.parseConfigFile(rawConfig), expected);
        });
        it("parses different ways of storing options", function () {
            var rawConfig = {
                rules: {
                    a: true,
                    b: [true],
                    c: false,
                    d: [false],
                    e: [true, 1],
                    f: [false, 2, 3],
                    g: { severity: "off" },
                    h: { severity: "warn" },
                    i: { severity: "warning" },
                    j: { severity: "error" },
                    k: { severity: "none" },
                    l: { options: 1 },
                    m: { options: [2] },
                    n: { options: [{ no: false }] },
                    o: { severity: "warn", options: 1 },
                    p: null,
                    q: {},
                    r: "garbage",
                    s: { junk: 1 },
                },
            };
            var expected = getEmptyConfig();
            expected.rules.set("a", { ruleArguments: [], ruleSeverity: "error" });
            expected.rules.set("b", { ruleArguments: [], ruleSeverity: "error" });
            expected.rules.set("c", { ruleArguments: [], ruleSeverity: "off" });
            expected.rules.set("d", { ruleArguments: [], ruleSeverity: "off" });
            expected.rules.set("e", { ruleArguments: [1], ruleSeverity: "error" });
            expected.rules.set("f", { ruleArguments: [2, 3], ruleSeverity: "off" });
            expected.rules.set("g", { ruleArguments: undefined, ruleSeverity: "off" });
            expected.rules.set("h", { ruleArguments: undefined, ruleSeverity: "warning" });
            expected.rules.set("i", { ruleArguments: undefined, ruleSeverity: "warning" });
            expected.rules.set("j", { ruleArguments: undefined, ruleSeverity: "error" });
            expected.rules.set("k", { ruleArguments: undefined, ruleSeverity: "off" });
            expected.rules.set("l", { ruleArguments: [1], ruleSeverity: "error" });
            expected.rules.set("m", { ruleArguments: [2], ruleSeverity: "error" });
            expected.rules.set("n", { ruleArguments: [{ no: false }], ruleSeverity: "error" });
            expected.rules.set("o", { ruleArguments: [1], ruleSeverity: "warning" });
            expected.rules.set("p", { ruleArguments: [], ruleSeverity: "off" });
            expected.rules.set("q", { ruleArguments: undefined, ruleSeverity: "error" });
            expected.rules.set("r", { ruleArguments: undefined, ruleSeverity: "error" });
            expected.rules.set("s", { ruleArguments: undefined, ruleSeverity: "error" });
            assertConfigEquals(configuration_1.parseConfigFile(rawConfig), expected);
        });
        it("fills in default values", function () {
            var initial = getEmptyConfig();
            initial.rules.set("s", { ruleArguments: undefined, ruleSeverity: undefined });
            chai_1.assert.deepEqual(configuration_1.convertRuleOptions(initial.rules)[0], {
                disabledIntervals: [],
                ruleArguments: [],
                ruleName: "s",
                ruleSeverity: "error",
            });
        });
        it("resolves exclude pattern relative to the configuration file", function () {
            var config = {
                linterOptions: {
                    exclude: ["foo.ts", "**/*.d.ts"],
                },
            };
            chai_1.assert.deepEqual(configuration_1.parseConfigFile(config, "/path").linterOptions, {
                exclude: [path.resolve("/path", "foo.ts"), path.resolve("/path", "**/*.d.ts")],
            });
        });
        it("parses jsRules when jsRules is a config", function () {
            var rawConfig = {
                jsRules: {
                    a: true,
                },
            };
            var expected = getEmptyConfig();
            expected.jsRules.set("a", { ruleArguments: [], ruleSeverity: "error" });
            assertConfigEquals(configuration_1.parseConfigFile(rawConfig), expected);
        });
        it("copies valid rules to jsRules when jsRules is a boolean", function () {
            var _a;
            var rawConfig = {
                jsRules: true,
                rules: {},
            };
            var expected = getEmptyConfig();
            assertConfigEquals(configuration_1.parseConfigFile(rawConfig), expected);
            rawConfig = {
                jsRules: true,
                rules: {
                    eofline: true,
                },
            };
            var _b = configuration_1.parseConfigFile(rawConfig), rules = _b.rules, jsRules = _b.jsRules;
            chai_1.assert.deepEqual(demap(rules), demap(jsRules));
            rawConfig = {
                jsRules: true,
                rules: {
                    eofline: true,
                    typedef: true,
                },
            };
            (_a = configuration_1.parseConfigFile(rawConfig), rules = _a.rules, jsRules = _a.jsRules);
            chai_1.assert(jsRules.has("eofline"));
            chai_1.assert(!jsRules.has("typedef"));
            rules.delete("typedef");
            chai_1.assert.deepEqual(demap(rules), demap(jsRules));
        });
    });
    describe("defaultSeverity", function () {
        it("uses defaultSeverity if severity is default", function () {
            var rawConfig = {
                defaultSeverity: "warning",
                rules: {
                    a: { severity: "error" },
                    b: { severity: "warning" },
                    c: { severity: "off" },
                    d: { severity: "default" },
                },
            };
            var expected = getEmptyConfig();
            expected.rules.set("a", { ruleArguments: undefined, ruleSeverity: "error" });
            expected.rules.set("b", { ruleArguments: undefined, ruleSeverity: "warning" });
            expected.rules.set("c", { ruleArguments: undefined, ruleSeverity: "off" });
            expected.rules.set("d", { ruleArguments: undefined, ruleSeverity: "warning" });
            assertConfigEquals(configuration_1.parseConfigFile(rawConfig), expected);
        });
    });
    describe("extendConfigurationFile", function () {
        var EMPTY_CONFIG = getEmptyConfig();
        it("verifies that empty extending empty is empty", function () {
            assertConfigEquals(configuration_1.extendConfigurationFile(EMPTY_CONFIG, EMPTY_CONFIG), EMPTY_CONFIG);
        });
        it("extends empty with non-empty", function () {
            var config = getEmptyConfig();
            config.jsRules.set("row", { ruleArguments: ["oar", "column"], ruleSeverity: "error" });
            config.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "off" });
            config.rulesDirectory = ["foo"];
            config.linterOptions = { exclude: ["foo"] };
            assertConfigEquals(configuration_1.extendConfigurationFile(EMPTY_CONFIG, config), config);
        });
        it("extends empty, with undefined ruleSeverity or ruleArguments", function () {
            var config = getEmptyConfig();
            config.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            config.rules.set("foo", { ruleSeverity: "off" });
            config.linterOptions = {};
            assertConfigEquals(configuration_1.extendConfigurationFile(EMPTY_CONFIG, config), config);
        });
        it("unions values", function () {
            var baseConfig = getEmptyConfig();
            baseConfig.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "off" });
            baseConfig.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            baseConfig.rulesDirectory = ["foo"];
            var extendingConfig = getEmptyConfig();
            extendingConfig.rules.set("flow", { ruleArguments: ["river"] });
            extendingConfig.jsRules.set("good", {
                ruleArguments: ["does"],
                ruleSeverity: "warning",
            });
            extendingConfig.rulesDirectory = ["baz"];
            var expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "off" });
            expectedConfig.rules.set("flow", { ruleArguments: ["river"] });
            expectedConfig.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            expectedConfig.jsRules.set("good", {
                ruleArguments: ["does"],
                ruleSeverity: "warning",
            });
            expectedConfig.rulesDirectory = ["foo", "baz"];
            var actualConfig = configuration_1.extendConfigurationFile(baseConfig, extendingConfig);
            assertConfigEquals(actualConfig, expectedConfig);
        });
        it("overrides values", function () {
            var baseConfig = getEmptyConfig();
            baseConfig.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "off" });
            baseConfig.jsRules.set("row", { ruleArguments: ["oar", "column"] });
            baseConfig.rulesDirectory = ["foo"];
            var extendingConfig = getEmptyConfig();
            extendingConfig.rules.set("foo", { ruleSeverity: "warning" });
            extendingConfig.jsRules.set("row", { ruleArguments: ["skid"] });
            extendingConfig.rulesDirectory = ["foo"];
            var expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("foo", { ruleArguments: ["bar"], ruleSeverity: "warning" });
            expectedConfig.jsRules.set("row", { ruleArguments: ["skid"] });
            expectedConfig.rulesDirectory = ["foo"];
            var actualConfig = configuration_1.extendConfigurationFile(baseConfig, extendingConfig);
            assertConfigEquals(actualConfig, expectedConfig);
        });
        it("replaces exclude option", function () {
            var baseConfig = getEmptyConfig();
            baseConfig.linterOptions = {
                exclude: ["src"],
            };
            var extendingConfig = getEmptyConfig();
            extendingConfig.linterOptions = {
                exclude: ["lib", "bin"],
            };
            var expectedConfig = getEmptyConfig();
            expectedConfig.linterOptions = {
                exclude: ["lib", "bin"],
            };
            var actualConfig = configuration_1.extendConfigurationFile(baseConfig, extendingConfig);
            assertConfigEquals(actualConfig, expectedConfig);
        });
        it("empty linter options does not replace exclude", function () {
            var baseConfig = getEmptyConfig();
            baseConfig.linterOptions = {
                exclude: ["src"],
            };
            var extendingConfig = getEmptyConfig();
            extendingConfig.linterOptions = {};
            var expectedConfig = getEmptyConfig();
            expectedConfig.linterOptions = {
                exclude: ["src"],
            };
            var actualConfig = configuration_1.extendConfigurationFile(baseConfig, extendingConfig);
            assertConfigEquals(actualConfig, expectedConfig);
        });
        it("overrides defaultSeverity of base configs", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-default-severity.json");
            chai_1.assert.equal(config.rules.get("default-severity-unspecified").ruleSeverity, "warning", "should apply defaultSeverity to base config with no defaultSeverity");
            chai_1.assert.equal(config.rules.get("default-severity-error").ruleSeverity, "warning", "should override defaultSeverity defined in base config");
            chai_1.assert.equal(config.rules.get("default-severity-warning").ruleSeverity, "warning", "should apply defaultSeverity to extending config");
        });
        it("inherits defaultSeverity from base config if not specified", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-default-severity-only-in-extended.json");
            chai_1.assert.equal(config.rules.get("default-severity-unspecified").ruleSeverity, "warning", "should apply defaultSeverity to base config with no defaultSeverity");
            chai_1.assert.equal(config.rules.get("default-severity-error").ruleSeverity, "warning", "should override defaultSeverity defined in base config");
            chai_1.assert.equal(config.rules.get("default-severity-warning").ruleSeverity, "warning", "should apply defaultSeverity to extending config");
            chai_1.assert.equal(config.rules.get("default-severity-only-in-extended").ruleSeverity, "warning", "should inherit defaultSeverity from base configs");
        });
        it("applies defaultSeverity to preceding base configs", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-default-severity-precedence.json");
            chai_1.assert.equal(config.rules.get("default-severity-unspecified").ruleSeverity, "off", "should apply defaultSeverity to base config with no defaultSeverity");
            chai_1.assert.equal(config.rules.get("default-severity-error").ruleSeverity, "off", "should override defaultSeverity defined in preceding base config");
            chai_1.assert.equal(config.rules.get("default-severity-warning").ruleSeverity, "off", "should override defaultSeverity defined in preceding base config");
            chai_1.assert.equal(config.rules.get("default-severity-off").ruleSeverity, "off", "should not override last declared defaultSeverity");
        });
    });
    describe("findConfigurationPath", function () {
        it("finds the closest tslint.json", function () {
            chai_1.assert.strictEqual(configuration_1.findConfigurationPath(null, "./test/files/config-findup/contains-config"), path.resolve("test/files/config-findup/contains-config/tslint.json"));
            chai_1.assert.strictEqual(configuration_1.findConfigurationPath(null, "./test/files/config-findup/no-config"), path.resolve("./test/files/config-findup/tslint.json"));
            chai_1.assert.strictEqual(configuration_1.findConfigurationPath(null, "./test/files/config-findup"), path.resolve("./test/files/config-findup/tslint.json"));
            // gulp-tslint uses a path including the filename
            chai_1.assert.strictEqual(configuration_1.findConfigurationPath(null, "./test/files/config-findup/somefilename.ts"), path.resolve("./test/files/config-findup/tslint.json"));
        });
        it("prefers json over yaml over yml configuration files", function () {
            chai_1.assert.strictEqual(configuration_1.findConfigurationPath(null, "./test/files/config-findup/yaml-config"), path.resolve("test/files/config-findup/yaml-config/tslint.json"));
            chai_1.assert.strictEqual(configuration_1.findConfigurationPath(null, "./test/files/config-findup/yml-config"), path.resolve("test/files/config-findup/yml-config/tslint.yaml"));
        });
    });
    describe("loadConfigurationFromPath", function () {
        it("extends with relative path", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-relative.json");
            chai_1.assert.isArray(config.rulesDirectory);
            chai_1.assert.equal("error", config.rules.get("no-fail").ruleSeverity, "should pick up 'no-fail' in base config");
            chai_1.assert.equal("off", config.rules.get("always-fail").ruleSeverity, "should set 'always-fail' in top config");
            chai_1.assert.equal("error", config.jsRules.get("no-fail").ruleSeverity);
            chai_1.assert.equal("off", config.jsRules.get("always-fail").ruleSeverity);
        });
        it("extends with package", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-package.json");
            var expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("rule-one", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-two", { ruleSeverity: "off" });
            expectedConfig.rules.set("rule-three", { ruleSeverity: "error" });
            assertConfigEquals(config.jsRules, expectedConfig.rules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });
        it("extends with package - boolean configuration", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-package-boolean.json");
            var expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("rule-one", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-two", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-three", { ruleSeverity: "off" });
            assertConfigEquals(config.jsRules, expectedConfig.rules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });
        it("extends only severity or only arguments", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-package-partial.json");
            var expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("always-fail", { ruleSeverity: "error", ruleArguments: [2] });
            expectedConfig.jsRules.set("always-fail", {
                ruleArguments: [1],
                ruleSeverity: "warning",
            });
            assertConfigEquals(config.jsRules, expectedConfig.jsRules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });
        it("extends with package without customization", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-package-no-mod.json");
            var expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("rule-one", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-two", { ruleSeverity: "off" });
            assertConfigEquals(config.jsRules, expectedConfig.rules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });
        it("extends with builtin", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-builtin.json");
            chai_1.assert.isUndefined(config.jsRules.get("no-var-keyword"));
            chai_1.assert.equal("off", config.jsRules.get("no-eval").ruleSeverity);
            chai_1.assert.equal("error", config.rules.get("no-var-keyword").ruleSeverity);
            chai_1.assert.equal("off", config.rules.get("no-eval").ruleSeverity);
        });
        it("resolve rule directory from package", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-custom-rules-with-package.json");
            chai_1.assert.deepEqual(config.rulesDirectory, [
                path.join(process.cwd(), "test/config/node_modules/tslint-test-custom-rules/rules"),
            ]);
        });
        it("resolve rule directory from package fallback", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-custom-rules-with-package-fallback.json");
            chai_1.assert.deepEqual(config.rulesDirectory, [
                path.join(process.cwd(), "test/config/relative-rules-directory"),
            ]);
        });
        describe("with config not relative to tslint", function () {
            var tmpfile;
            beforeEach(function () {
                tmpfile = utils_1.createTempFile("json");
            });
            afterEach(function () {
                if (tmpfile !== undefined) {
                    fs.unlinkSync(tmpfile);
                }
            });
            it("extends with package installed relative to tslint", function () {
                fs.writeFileSync(tmpfile, JSON.stringify({ extends: "tslint-test-config-non-relative" }));
                var config = configuration_1.loadConfigurationFromPath(tmpfile);
                var expectedConfig = getEmptyConfig();
                expectedConfig.rules.set("class-name", { ruleSeverity: "error" });
                assertConfigEquals(config.rules, expectedConfig.rules);
            });
        });
        it("extends with package two levels (and relative path in rulesDirectory)", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-package-two-levels.json");
            chai_1.assert.lengthOf(config.rulesDirectory, 2);
            chai_1.assert.isTrue(fs.existsSync(config.rulesDirectory[0]));
            chai_1.assert.isTrue(fs.existsSync(config.rulesDirectory[1]));
            var expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("always-fail", { ruleSeverity: "off" });
            expectedConfig.rules.set("rule-one", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-two", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-four", { ruleSeverity: "error" });
            assertConfigEquals(config.jsRules, expectedConfig.rules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });
        it("extends with array", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-extends-package-array.json");
            var expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("always-fail", { ruleSeverity: "off" });
            expectedConfig.rules.set("no-fail", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-one", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-two", { ruleSeverity: "error" });
            assertConfigEquals(config.jsRules, expectedConfig.rules);
            assertConfigEquals(config.rules, expectedConfig.rules);
        });
        it("can load .json files with comments", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-with-comments.json");
            var expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("rule-two", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-three", {
                ruleArguments: ["//not a comment"],
                ruleSeverity: "error",
            });
            expectedConfig.rules.set("rule-four", {
                ruleArguments: ["/*also not a comment*/"],
                ruleSeverity: "error",
            });
            assertConfigEquals(config.rules, expectedConfig.rules);
            assertConfigEquals(config.jsRules, expectedConfig.rules);
        });
        it("can load .json files with BOM", function () {
            chai_1.assert.doesNotThrow(function () {
                return configuration_1.loadConfigurationFromPath("./test/config/tslint-with-bom.json");
            });
        });
        it("can load .yaml files with comments", function () {
            var config = configuration_1.loadConfigurationFromPath("./test/config/tslint-with-comments.yaml");
            var expectedConfig = getEmptyConfig();
            expectedConfig.rules.set("rule-two", { ruleSeverity: "error" });
            expectedConfig.rules.set("rule-three", {
                ruleArguments: ["#not a comment"],
                ruleSeverity: "error",
            });
            assertConfigEquals(config.rules, expectedConfig.rules);
            assertConfigEquals(config.jsRules, expectedConfig.rules);
        });
        it("can load a built-in configuration", function () {
            var config = configuration_1.loadConfigurationFromPath("tslint:recommended");
            chai_1.assert.strictEqual("error", config.jsRules.get("no-eval").ruleSeverity);
            chai_1.assert.strictEqual("error", config.rules.get("no-eval").ruleSeverity);
        });
        it("throws on an invalid built-in configuration path", function () {
            chai_1.assert.throws(function () {
                configuration_1.loadConfigurationFromPath("tslint:doesnotexist");
            });
        });
    });
});
function getEmptyConfig() {
    return {
        extends: [],
        jsRules: new Map(),
        linterOptions: {},
        rules: new Map(),
        rulesDirectory: [],
    };
}
function demap(map) {
    if (map == undefined) {
        return map;
    }
    var output = {};
    map.forEach(function (value, key) {
        output[key] = value;
    });
    return output;
}
// this is needed since `assertConfigEquals` doesn't go into Map object
function assertConfigEquals(actual, expected) {
    chai_1.assert.deepEqual(actual, expected);
    // tslint:disable no-unsafe-any strict-boolean-expressions
    if (actual && (actual.jsRules || actual.rules)) {
        chai_1.assert.deepEqual(demap(actual.jsRules), demap(expected.jsRules));
        chai_1.assert.deepEqual(demap(actual.rules), demap(expected.rules));
    }
    // tslint:enable no-unsafe-any
}
//# sourceMappingURL=configurationTests.js.map