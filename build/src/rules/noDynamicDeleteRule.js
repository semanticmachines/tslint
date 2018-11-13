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
var tsutils = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    Rule.metadata = {
        description: "Bans usage of the delete operator with computed key expressions.",
        optionExamples: [true],
        options: null,
        optionsDescription: "Not configurable.",
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Deleting dynamically computed keys is dangerous and not well optimized.\n\n            Also consider using a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)\n            or [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)\n            if you're storing collections of objects.\n            Using `Object`s can cause occasional edge case bugs, such as if a key is named \"hasOwnProperty\".\n        "], ["\n            Deleting dynamically computed keys is dangerous and not well optimized.\n\n            Also consider using a [\\`Map\\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)\n            or [\\`Set\\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)\n            if you're storing collections of objects.\n            Using \\`Object\\`s can cause occasional edge case bugs, such as if a key is named \"hasOwnProperty\".\n        "]))),
        ruleName: "no-dynamic-delete",
        type: "functionality",
        typescriptOnly: false,
    };
    Rule.FAILURE_STRING = "Do not delete dynamically computed property keys.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(context) {
    function checkDeleteAccessExpression(node) {
        if (node === undefined || !tsutils.isElementAccessExpression(node)) {
            return;
        }
        var argumentExpression = node.argumentExpression;
        if (argumentExpression === undefined || isNecessaryDynamicAccess(argumentExpression)) {
            return;
        }
        var start = argumentExpression.getStart(context.sourceFile) - 1;
        var width = argumentExpression.getWidth() + 2;
        var fix;
        if (tsutils.isPrefixUnaryExpression(argumentExpression)) {
            var convertedOperand = convertUnaryOperand(argumentExpression);
            if (convertedOperand !== undefined) {
                fix = Lint.Replacement.replaceFromTo(start, start + width, "[" + convertedOperand + "]");
            }
        }
        else if (tsutils.isStringLiteral(argumentExpression)) {
            fix = Lint.Replacement.replaceFromTo(start, start + width, "." + argumentExpression.text);
        }
        context.addFailureAt(start, width, Rule.FAILURE_STRING, fix);
    }
    return ts.forEachChild(context.sourceFile, function callback(node) {
        if (isDeleteExpression(node)) {
            checkDeleteAccessExpression(node.expression);
        }
        return ts.forEachChild(node, callback);
    });
}
function convertUnaryOperand(node) {
    return tsutils.isNumericLiteral(node.operand) ? node.operand.text : undefined;
}
function isDeleteExpression(node) {
    return node.kind === ts.SyntaxKind.DeleteExpression;
}
function isNumberLike(node) {
    if (tsutils.isPrefixUnaryExpression(node)) {
        return tsutils.isNumericLiteral(node.operand) && node.operator === ts.SyntaxKind.MinusToken;
    }
    return tsutils.isNumericLiteral(node);
}
function isNecessaryDynamicAccess(argumentExpression) {
    if (isNumberLike(argumentExpression)) {
        return true;
    }
    return (tsutils.isStringLiteral(argumentExpression) &&
        !tsutils.isValidPropertyAccess(argumentExpression.text));
}
var templateObject_1;
//# sourceMappingURL=noDynamicDeleteRule.js.map