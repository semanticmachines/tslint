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
var Lint = require("../index");
var ENFORCE_TRAILING_NEWLINE = "enforce-trailing-newline";
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var text = sourceFile.text;
        var headerFormat = new RegExp(this.ruleArguments[0]);
        var textToInsert = this.ruleArguments[1];
        var enforceExtraTrailingLine = this.ruleArguments.indexOf(ENFORCE_TRAILING_NEWLINE) !== -1;
        // ignore shebang if it exists
        var offset = text.startsWith("#!") ? text.indexOf("\n") : 0;
        // returns the text of the first comment or undefined
        var commentText = ts.forEachLeadingCommentRange(text, offset, function (pos, end, kind) {
            return text.substring(pos + 2, kind === ts.SyntaxKind.SingleLineCommentTrivia ? end : end - 2);
        });
        if (commentText === undefined || !headerFormat.test(commentText)) {
            var isErrorAtStart = offset === 0;
            if (!isErrorAtStart) {
                ++offset; // show warning in next line after shebang
            }
            var leadingNewlines = isErrorAtStart ? 0 : 1;
            var trailingNewlines = isErrorAtStart ? 2 : 1;
            var fix = textToInsert !== undefined
                ? Lint.Replacement.appendText(offset, this.createComment(sourceFile, textToInsert, leadingNewlines, trailingNewlines))
                : undefined;
            return [
                new Lint.RuleFailure(sourceFile, offset, offset, Rule.MISSING_HEADER_FAILURE_STRING, this.ruleName, fix),
            ];
        }
        var trailingNewLineViolation = enforceExtraTrailingLine &&
            headerFormat.test(commentText) &&
            this.doesNewLineEndingViolationExist(text, offset);
        if (trailingNewLineViolation) {
            var trailingCommentRanges = ts.getTrailingCommentRanges(text, offset);
            var endOfComment = trailingCommentRanges[0].end;
            var lineEnding = this.generateLineEnding(sourceFile);
            var fix = textToInsert !== undefined
                ? Lint.Replacement.appendText(endOfComment, lineEnding)
                : undefined;
            return [
                new Lint.RuleFailure(sourceFile, offset, offset, Rule.MISSING_NEW_LINE_FAILURE_STRING, this.ruleName, fix),
            ];
        }
        return [];
    };
    Rule.prototype.createComment = function (sourceFile, commentText, leadingNewlines, trailingNewlines) {
        if (leadingNewlines === void 0) { leadingNewlines = 1; }
        if (trailingNewlines === void 0) { trailingNewlines = 1; }
        var lineEnding = this.generateLineEnding(sourceFile);
        return (lineEnding.repeat(leadingNewlines) +
            [
                "/*!"
            ].concat(commentText.split(/\r?\n/g).map(function (line) { return (" * " + line).replace(/\s+$/, ""); }), [
                " */",
            ]).join(lineEnding) +
            lineEnding.repeat(trailingNewlines));
    };
    Rule.prototype.generateLineEnding = function (sourceFile) {
        var maybeCarriageReturn = sourceFile.text[sourceFile.getLineEndOfPosition(0)] === "\r" ? "\r" : "";
        return maybeCarriageReturn + "\n";
    };
    Rule.prototype.doesNewLineEndingViolationExist = function (text, offset) {
        var entireComment = ts.forEachLeadingCommentRange(text, offset, function (pos, end) {
            return text.substring(pos, end + 2);
        });
        var NEW_LINE_FOLLOWING_HEADER = /^.*((\r)?\n){2,}$/gm;
        return (entireComment !== undefined && NEW_LINE_FOLLOWING_HEADER.test(entireComment) !== null);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "file-header",
        description: "Enforces a certain header comment for all files, matched by a regular expression.",
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            The first option, which is mandatory, is a regular expression that all headers should match.\n            The second argument, which is optional, is a string that should be inserted as a header comment\n            if fixing is enabled and no header that matches the first argument is found.\n            The third argument, which is optional, is a string that denotes whether or not a newline should\n            exist on the header."], ["\n            The first option, which is mandatory, is a regular expression that all headers should match.\n            The second argument, which is optional, is a string that should be inserted as a header comment\n            if fixing is enabled and no header that matches the first argument is found.\n            The third argument, which is optional, is a string that denotes whether or not a newline should\n            exist on the header."]))),
        options: {
            type: "array",
            items: [
                {
                    type: "string",
                },
                {
                    type: "string",
                },
                {
                    type: "string",
                },
            ],
            additionalItems: false,
            minLength: 1,
            maxLength: 3,
        },
        optionExamples: [[true, "Copyright \\d{4}", "Copyright 2018", ENFORCE_TRAILING_NEWLINE]],
        hasFix: true,
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.MISSING_HEADER_FAILURE_STRING = "missing file header";
    Rule.MISSING_NEW_LINE_FAILURE_STRING = "missing new line following the file header";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var templateObject_1;
//# sourceMappingURL=fileHeaderRule.js.map