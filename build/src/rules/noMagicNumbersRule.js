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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var tsutils_1 = require("tsutils");
var Lint = require("../index");
var utils_1 = require("../language/utils");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoMagicNumbersWalker(sourceFile, this.ruleName, this.ruleArguments.length > 0 ? this.ruleArguments : Rule.DEFAULT_ALLOWED));
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-magic-numbers",
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Disallows the use constant number values outside of variable assignments.\n            When no list of allowed values is specified, -1, 0 and 1 are allowed by default."], ["\n            Disallows the use constant number values outside of variable assignments.\n            When no list of allowed values is specified, -1, 0 and 1 are allowed by default."]))),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            Magic numbers should be avoided as they often lack documentation.\n            Forcing them to be stored in variables gives them implicit documentation.\n        "], ["\n            Magic numbers should be avoided as they often lack documentation.\n            Forcing them to be stored in variables gives them implicit documentation.\n        "]))),
        optionsDescription: "A list of allowed numbers.",
        options: {
            type: "array",
            items: {
                type: "number",
            },
            minLength: 1,
        },
        optionExamples: [true, [true, 1, 2, 3]],
        type: "typescript",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = "'magic numbers' are not allowed";
    Rule.ALLOWED_NODES = new Set([
        ts.SyntaxKind.ExportAssignment,
        ts.SyntaxKind.FirstAssignment,
        ts.SyntaxKind.LastAssignment,
        ts.SyntaxKind.PropertyAssignment,
        ts.SyntaxKind.ShorthandPropertyAssignment,
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.VariableDeclarationList,
        ts.SyntaxKind.EnumMember,
        ts.SyntaxKind.PropertyDeclaration,
        ts.SyntaxKind.Parameter,
    ]);
    Rule.DEFAULT_ALLOWED = [-1, 0, 1];
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoMagicNumbersWalker = /** @class */ (function (_super) {
    __extends(NoMagicNumbersWalker, _super);
    function NoMagicNumbersWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoMagicNumbersWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            if (tsutils_1.isCallExpression(node) &&
                tsutils_1.isIdentifier(node.expression) &&
                node.expression.text === "parseInt") {
                return node.arguments.length === 0 ? undefined : cb(node.arguments[0]);
            }
            if (node.kind === ts.SyntaxKind.NumericLiteral) {
                return _this.checkNumericLiteral(node, node.text);
            }
            if (utils_1.isNegativeNumberLiteral(node)) {
                return _this.checkNumericLiteral(node, "-" + node.operand.text);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    };
    NoMagicNumbersWalker.prototype.checkNumericLiteral = function (node, num) {
        /* Using Object.is() to differentiate between pos/neg zero */
        if (!Rule.ALLOWED_NODES.has(node.parent.kind) &&
            !this.options.some(function (allowedNum) { return Object.is(allowedNum, parseFloat(num)); })) {
            this.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
    };
    return NoMagicNumbersWalker;
}(Lint.AbstractWalker));
var templateObject_1, templateObject_2;
//# sourceMappingURL=noMagicNumbersRule.js.map