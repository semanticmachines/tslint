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
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "no-construct",
        description: "Disallows access to the constructors of `String`, `Number`, and `Boolean`.",
        descriptionDetails: "Disallows constructor use such as `new Number(foo)` but does not disallow `Number(foo)`.",
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            There is little reason to use `String`, `Number`, or `Boolean` as constructors.\n            In almost all cases, the regular function-call version is more appropriate.\n            [More details](http://stackoverflow.com/q/4719320/3124288) are available on StackOverflow."], ["\n            There is little reason to use \\`String\\`, \\`Number\\`, or \\`Boolean\\` as constructors.\n            In almost all cases, the regular function-call version is more appropriate.\n            [More details](http://stackoverflow.com/q/4719320/3124288) are available on StackOverflow."]))),
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.FAILURE_STRING = "Forbidden constructor, use a literal or simple function call instead";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (tsutils_1.isNewExpression(node) && node.expression.kind === ts.SyntaxKind.Identifier) {
            switch (node.expression.text) {
                case "Boolean":
                case "String":
                case "Number":
                    ctx.addFailure(node.getStart(ctx.sourceFile), node.expression.end, Rule.FAILURE_STRING);
            }
        }
        return ts.forEachChild(node, cb);
    });
}
var templateObject_1;
//# sourceMappingURL=noConstructRule.js.map