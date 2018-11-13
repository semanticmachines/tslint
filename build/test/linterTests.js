"use strict";
/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var fs = require("fs");
var typescript_1 = require("typescript");
var configuration_1 = require("../src/configuration");
var rule_1 = require("../src/language/rule/rule");
var linter_1 = require("../src/linter");
var utils_1 = require("./utils");
var TestLinter = /** @class */ (function (_super) {
    __extends(TestLinter, _super);
    function TestLinter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestLinter.prototype.applyFixesHelper = function (fileName, source, ruleFailures) {
        return _super.prototype.applyFixes.call(this, fileName, source, ruleFailures);
    };
    return TestLinter;
}(linter_1.Linter));
var componentDeclaration = function (templateUrl) {
    return "import { Component } from '@angular/component';\n\n@Component({\n  selector: 'foo-bar',\n  templateUrl: '" + templateUrl + "'\n})\nclass SampleComponent {}\n";
};
var templateDeclaration = "\n<div>{{ foo }}</div>\n";
var templateDeclarationFixed = "\n<div></div>\n";
var withWarningDeclaration = "\n  console.log(\"This line will not pass linting with the default rule set\");\n";
describe("Linter", function () {
    it("apply fixes to correct files", function () {
        var linter = new TestLinter({ fix: true });
        var componentFile = utils_1.createTempFile("ts");
        var templateFile = utils_1.createTempFile("ts");
        fs.writeFileSync(componentFile, componentDeclaration(templateFile));
        fs.writeFileSync(templateFile, templateDeclaration);
        var sourceFile = typescript_1.createSourceFile(templateFile, "" + templateDeclaration, typescript_1.ScriptTarget.ES2015);
        var replacement = new rule_1.Replacement(6, 9, "");
        var failure = new rule_1.RuleFailure(sourceFile, 6, 15, "Declaration doesn't exist", "foo-bar", replacement);
        linter.applyFixesHelper(componentFile, componentDeclaration(templateFile), [failure]);
        chai_1.assert.equal(fs.readFileSync(templateFile, "utf-8"), templateDeclarationFixed);
    });
    it("shows warnings", function () {
        var config = configuration_1.DEFAULT_CONFIG;
        config.rules.set("no-console", {
            ruleArguments: ["log"],
            ruleName: "no-console",
            ruleSeverity: "warning",
        });
        var linter = new TestLinter({ fix: false });
        var fileToLint = utils_1.createTempFile("ts");
        fs.writeFileSync(fileToLint, withWarningDeclaration);
        linter.lint(fileToLint, withWarningDeclaration, config);
        var result = linter.getResult();
        chai_1.assert.equal(result.warningCount, 1);
        chai_1.assert.equal(result.errorCount, 0);
    });
    it("does not show warnings when `quiet` is `true`", function () {
        var config = configuration_1.DEFAULT_CONFIG;
        config.rules.set("no-console", {
            ruleArguments: ["log"],
            ruleName: "no-console",
            ruleSeverity: "warning",
        });
        var linter = new TestLinter({ fix: false, quiet: true });
        var fileToLint = utils_1.createTempFile("ts");
        fs.writeFileSync(fileToLint, withWarningDeclaration);
        linter.lint(fileToLint, withWarningDeclaration, config);
        var result = linter.getResult();
        chai_1.assert.equal(result.warningCount, 0);
        chai_1.assert.equal(result.errorCount, 0);
    });
});
//# sourceMappingURL=linterTests.js.map