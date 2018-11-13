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
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.id = function (input) {
        return input;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-string-literal",
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Forbids unnecessary string literal property access.\n            Allows `obj[\"prop-erty\"]` (can't be a regular property access).\n            Disallows `obj[\"property\"]` (should be `obj.property`)."], ["\n            Forbids unnecessary string literal property access.\n            Allows \\`obj[\"prop-erty\"]\\` (can't be a regular property access).\n            Disallows \\`obj[\"property\"]\\` (should be \\`obj.property\\`)."]))),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            If `--noImplicitAny` is turned off,\n            property access via a string literal will be 'any' if the property does not exist."], ["\n            If \\`--noImplicitAny\\` is turned off,\n            property access via a string literal will be 'any' if the property does not exist."]))),
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
        hasFix: true,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = "object access via string literals is disallowed";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (tsutils_1.isElementAccessExpression(node)) {
            var argument = node.argumentExpression;
            if (argument !== undefined &&
                tsutils_1.isStringLiteral(argument) &&
                tsutils_1.isValidPropertyAccess(argument.text)) {
                var unescapeIdentifier = 
                // typescript@<2.5.0 has an extra underscore in escaped identifier text content,
                // to avoid fixing issue `expr['__foo'] → expr.___foo`, unescapeIdentifier() is to be used
                // As of typescript@3, unescapeIdentifier() removed, thus check in runtime, if the method exists
                // tslint:disable-next-line no-unsafe-any strict-boolean-expressions
                ts.unescapeIdentifier || Rule.id;
                var propertyName = unescapeIdentifier(argument.text);
                ctx.addFailureAtNode(argument, Rule.FAILURE_STRING, 
                // expr['foo'] -> expr.foo
                Lint.Replacement.replaceFromTo(node.expression.end, node.end, "." + propertyName));
            }
        }
        return ts.forEachChild(node, cb);
    });
}
var templateObject_1, templateObject_2;
//# sourceMappingURL=noStringLiteralRule.js.map