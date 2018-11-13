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
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Lint = require("../index");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.ruleName, parseOptions(this.ruleArguments)));
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: "ordered-imports",
        description: "Requires that import statements be alphabetized and grouped.",
        descriptionDetails: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Enforce a consistent ordering for ES6 imports:\n            - Named imports must be alphabetized (i.e. \"import {A, B, C} from \"foo\";\")\n                - The exact ordering can be controlled by the named-imports-order option.\n                - \"longName as name\" imports are ordered by \"longName\".\n            - Import sources must be alphabetized within groups, i.e.:\n                    import * as foo from \"a\";\n                    import * as bar from \"b\";\n            - Groups of imports are delineated by blank lines. You can use this rule to group\n                imports however you like, e.g. by first- vs. third-party or thematically or\n                you can define groups based upon patterns in import path names."], ["\n            Enforce a consistent ordering for ES6 imports:\n            - Named imports must be alphabetized (i.e. \"import {A, B, C} from \"foo\";\")\n                - The exact ordering can be controlled by the named-imports-order option.\n                - \"longName as name\" imports are ordered by \"longName\".\n            - Import sources must be alphabetized within groups, i.e.:\n                    import * as foo from \"a\";\n                    import * as bar from \"b\";\n            - Groups of imports are delineated by blank lines. You can use this rule to group\n                imports however you like, e.g. by first- vs. third-party or thematically or\n                you can define groups based upon patterns in import path names."]))),
        hasFix: true,
        optionsDescription: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            You may set the `\"import-sources-order\"` option to control the ordering of source\n            imports (the `\"foo\"` in `import {A, B, C} from \"foo\"`).\n\n            Possible values for `\"import-sources-order\"` are:\n\n            * `\"case-insensitive'`: Correct order is `\"Bar\"`, `\"baz\"`, `\"Foo\"`. (This is the default.)\n            * `\"lowercase-first\"`: Correct order is `\"baz\"`, `\"Bar\"`, `\"Foo\"`.\n            * `\"lowercase-last\"`: Correct order is `\"Bar\"`, `\"Foo\"`, `\"baz\"`.\n            * `\"any\"`: Allow any order.\n\n            You may set the `\"grouped-imports\"` option to control the grouping of source\n            imports (the `\"foo\"` in `import {A, B, C} from \"foo\"`).  The grouping used\n            is controlled by the `\"groups\"` option.\n\n            Possible values for `\"grouped-imports\"` are:\n\n            * `false`: Do not enforce grouping. (This is the default.)\n            * `true`: Group source imports using default grouping or groups setting.\n\n            The value of `\"groups\"` is a list of group rules of the form:\n\n                [{\n                    \"name\": \"optional rule name\",\n                    \"match\": \"regex string\",\n                    \"order\": 10\n                }, {\n                    \"name\": \"pkga imports\",\n                    \"match\": \"^@pkga\",\n                    \"order\": 20\n                }]\n\n            there is also a simplified form where you only pass a list of patterns and\n            the order is given by the position in the list\n\n                [\"^@pkga\", \"^\\.\\.\"]\n\n            The first rule in the list to match a given import is the group that is used.\n            If no rule in matched then the import will be put in an `unmatched` group\n            at the end of all groups. The groups must be ordered based upon the sequential\n            value of the `order` value. (ie. order 0 is first)\n\n            If no `\"groups\"` options is set, a default grouping is used of third-party,\n            parent directories and the current directory. (`\"bar\"`, `\"../baz\"`, `\"./foo\"`.)\n\n            You may set the `\"named-imports-order\"` option to control the ordering of named\n            imports (the `{A, B, C}` in `import {A, B, C} from \"foo\"`).\n\n            Possible values for `\"named-imports-order\"` are:\n\n            * `\"case-insensitive'`: Correct order is `{A, b, C}`. (This is the default.)\n            * `\"lowercase-first\"`: Correct order is `{b, A, C}`.\n            * `\"lowercase-last\"`: Correct order is `{A, C, b}`.\n            * `\"any\"`: Allow any order.\n\n            You may set the `\"module-source-path\"` option to control the ordering of imports based full path\n            or just the module name\n\n            Possible values for `\"module-source-path\"` are:\n\n            * `\"full'`: Correct order is  `\"./a/Foo\"`, `\"./b/baz\"`, `\"./c/Bar\"`. (This is the default.)\n            * `\"basename\"`: Correct order is `\"./c/Bar\"`, `\"./b/baz\"`, `\"./a/Foo\"`.\n\n        "], ["\n            You may set the \\`\"import-sources-order\"\\` option to control the ordering of source\n            imports (the \\`\"foo\"\\` in \\`import {A, B, C} from \"foo\"\\`).\n\n            Possible values for \\`\"import-sources-order\"\\` are:\n\n            * \\`\"case-insensitive'\\`: Correct order is \\`\"Bar\"\\`, \\`\"baz\"\\`, \\`\"Foo\"\\`. (This is the default.)\n            * \\`\"lowercase-first\"\\`: Correct order is \\`\"baz\"\\`, \\`\"Bar\"\\`, \\`\"Foo\"\\`.\n            * \\`\"lowercase-last\"\\`: Correct order is \\`\"Bar\"\\`, \\`\"Foo\"\\`, \\`\"baz\"\\`.\n            * \\`\"any\"\\`: Allow any order.\n\n            You may set the \\`\"grouped-imports\"\\` option to control the grouping of source\n            imports (the \\`\"foo\"\\` in \\`import {A, B, C} from \"foo\"\\`).  The grouping used\n            is controlled by the \\`\"groups\"\\` option.\n\n            Possible values for \\`\"grouped-imports\"\\` are:\n\n            * \\`false\\`: Do not enforce grouping. (This is the default.)\n            * \\`true\\`: Group source imports using default grouping or groups setting.\n\n            The value of \\`\"groups\"\\` is a list of group rules of the form:\n\n                [{\n                    \"name\": \"optional rule name\",\n                    \"match\": \"regex string\",\n                    \"order\": 10\n                }, {\n                    \"name\": \"pkga imports\",\n                    \"match\": \"^@pkga\",\n                    \"order\": 20\n                }]\n\n            there is also a simplified form where you only pass a list of patterns and\n            the order is given by the position in the list\n\n                [\"^@pkga\", \"^\\\\.\\\\.\"]\n\n            The first rule in the list to match a given import is the group that is used.\n            If no rule in matched then the import will be put in an \\`unmatched\\` group\n            at the end of all groups. The groups must be ordered based upon the sequential\n            value of the \\`order\\` value. (ie. order 0 is first)\n\n            If no \\`\"groups\"\\` options is set, a default grouping is used of third-party,\n            parent directories and the current directory. (\\`\"bar\"\\`, \\`\"../baz\"\\`, \\`\"./foo\"\\`.)\n\n            You may set the \\`\"named-imports-order\"\\` option to control the ordering of named\n            imports (the \\`{A, B, C}\\` in \\`import {A, B, C} from \"foo\"\\`).\n\n            Possible values for \\`\"named-imports-order\"\\` are:\n\n            * \\`\"case-insensitive'\\`: Correct order is \\`{A, b, C}\\`. (This is the default.)\n            * \\`\"lowercase-first\"\\`: Correct order is \\`{b, A, C}\\`.\n            * \\`\"lowercase-last\"\\`: Correct order is \\`{A, C, b}\\`.\n            * \\`\"any\"\\`: Allow any order.\n\n            You may set the \\`\"module-source-path\"\\` option to control the ordering of imports based full path\n            or just the module name\n\n            Possible values for \\`\"module-source-path\"\\` are:\n\n            * \\`\"full'\\`: Correct order is  \\`\"./a/Foo\"\\`, \\`\"./b/baz\"\\`, \\`\"./c/Bar\"\\`. (This is the default.)\n            * \\`\"basename\"\\`: Correct order is \\`\"./c/Bar\"\\`, \\`\"./b/baz\"\\`, \\`\"./a/Foo\"\\`.\n\n        "]))),
        options: {
            type: "object",
            properties: {
                "grouped-imports": {
                    type: "boolean",
                },
                groups: {
                    type: "list",
                    listType: {
                        oneOf: [
                            {
                                type: "string",
                            },
                            {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    match: { type: "string" },
                                    order: { type: "number" },
                                },
                                required: ["match", "order"],
                            },
                        ],
                    },
                },
                "import-sources-order": {
                    type: "string",
                    enum: ["case-insensitive", "lowercase-first", "lowercase-last", "any"],
                },
                "named-imports-order": {
                    type: "string",
                    enum: ["case-insensitive", "lowercase-first", "lowercase-last", "any"],
                },
                "module-source-path": {
                    type: "string",
                    enum: ["full", "basename"],
                },
            },
            additionalProperties: false,
        },
        optionExamples: [
            true,
            [
                true,
                {
                    "import-sources-order": "lowercase-last",
                    "named-imports-order": "lowercase-first",
                },
            ],
        ],
        type: "style",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */
    Rule.IMPORT_SOURCES_NOT_GROUPED_PREFIX = "Import sources of different groups must be sorted by:";
    Rule.IMPORT_SOURCES_UNORDERED = "Import sources within a group must be alphabetized.";
    Rule.NAMED_IMPORTS_UNORDERED = "Named imports must be alphabetized.";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var TRANSFORMS = new Map([
    ["any", function () { return ""; }],
    ["case-insensitive", function (x) { return x.toLowerCase(); }],
    ["lowercase-first", flipCase],
    ["lowercase-last", function (x) { return x; }],
    ["full", function (x) { return x; }],
    [
        "basename",
        function (x) {
            if (!ts.isExternalModuleNameRelative(x)) {
                return x;
            }
            var splitIndex = x.lastIndexOf("/");
            if (splitIndex === -1) {
                return x;
            }
            return x.substr(splitIndex + 1);
        },
    ],
]);
var ImportType;
(function (ImportType) {
    ImportType[ImportType["LIBRARY_IMPORT"] = 1] = "LIBRARY_IMPORT";
    ImportType[ImportType["PARENT_DIRECTORY_IMPORT"] = 2] = "PARENT_DIRECTORY_IMPORT";
    ImportType[ImportType["CURRENT_DIRECTORY_IMPORT"] = 3] = "CURRENT_DIRECTORY_IMPORT";
})(ImportType || (ImportType = {}));
function parseOptions(ruleArguments) {
    var optionSet = ruleArguments[0];
    var defaultGroups = [
        { name: "parent directories", match: "^\\.\\.", order: 20 },
        { name: "current directory", match: "^\\.", order: 30 },
        { name: "libraries", match: ".*", order: 10 },
    ];
    var _a = optionSet === undefined ? {} : optionSet, _b = _a["grouped-imports"], isGrouped = _b === void 0 ? false : _b, _c = _a["import-sources-order"], sources = _c === void 0 ? "case-insensitive" : _c, _d = _a["named-imports-order"], named = _d === void 0 ? "case-insensitive" : _d, _e = _a["module-source-path"], path = _e === void 0 ? "full" : _e, _f = _a.groups, groups = _f === void 0 ? defaultGroups : _f;
    // build up list of compiled groups
    // - handle case where "group" is just a string pattern
    //   vs a full group object
    var compiledGroups = groups.map(function (g, idx) {
        if (typeof g === "string") {
            return { name: g, match: new RegExp(g), order: idx };
        }
        else {
            return {
                match: new RegExp(g.match),
                name: g.name !== undefined ? g.name : g.match,
                order: g.order,
            };
        }
    });
    return {
        groupedImports: isGrouped,
        groups: compiledGroups,
        importSourcesOrderTransform: TRANSFORMS.get(sources),
        moduleSourceTransform: TRANSFORMS.get(path),
        namedImportsOrderTransform: TRANSFORMS.get(named),
    };
}
var Walker = /** @class */ (function (_super) {
    __extends(Walker, _super);
    function Walker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.importsBlocks = [new ImportsBlock()];
        // group to use when no other group matches
        _this.defaultGroup = {
            match: /.*/,
            name: "unmatched",
            order: Number.MAX_SAFE_INTEGER,
        };
        return _this;
    }
    Object.defineProperty(Walker.prototype, "currentImportsBlock", {
        get: function () {
            return this.importsBlocks[this.importsBlocks.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Walker.prototype.walk = function (sourceFile) {
        for (var _i = 0, _a = sourceFile.statements; _i < _a.length; _i++) {
            var statement = _a[_i];
            this.checkStatement(statement);
        }
        this.endBlock();
        if (this.options.groupedImports) {
            this.checkBlocksGrouping();
        }
    };
    Walker.prototype.checkStatement = function (statement) {
        if (!(tsutils_1.isImportDeclaration(statement) || tsutils_1.isImportEqualsDeclaration(statement)) ||
            /\r?\n\r?\n/.test(this.sourceFile.text.slice(statement.getFullStart(), statement.getStart(this.sourceFile)))) {
            this.endBlock();
        }
        if (tsutils_1.isImportDeclaration(statement)) {
            this.checkImportDeclaration(statement);
        }
        else if (tsutils_1.isImportEqualsDeclaration(statement)) {
            this.checkImportEqualsDeclaration(statement);
        }
        else if (tsutils_1.isModuleDeclaration(statement)) {
            var body = moduleDeclarationBody(statement);
            if (body !== undefined) {
                for (var _i = 0, _a = body.statements; _i < _a.length; _i++) {
                    var subStatement = _a[_i];
                    this.checkStatement(subStatement);
                }
                this.endBlock();
            }
        }
    };
    Walker.prototype.checkImportDeclaration = function (node) {
        if (!tsutils_1.isStringLiteral(node.moduleSpecifier)) {
            // Ignore grammar error
            return;
        }
        var source = this.options.importSourcesOrderTransform(removeQuotes(node.moduleSpecifier.text));
        this.checkSource(source, node);
        var importClause = node.importClause;
        if (importClause !== undefined &&
            importClause.namedBindings !== undefined &&
            tsutils_1.isNamedImports(importClause.namedBindings)) {
            this.checkNamedImports(importClause.namedBindings);
        }
    };
    Walker.prototype.checkImportEqualsDeclaration = function (node) {
        // only allowed `import x = require('y');`
        var moduleReference = node.moduleReference;
        if (!tsutils_1.isExternalModuleReference(moduleReference)) {
            return;
        }
        var expression = moduleReference.expression;
        if (expression === undefined || !tsutils_1.isStringLiteral(expression)) {
            return;
        }
        var source = this.options.importSourcesOrderTransform(removeQuotes(expression.text));
        this.checkSource(source, node);
    };
    Walker.prototype.checkSource = function (source, node) {
        var matchingGroup = this.getMatchingGroup(source);
        var currentSource = this.options.moduleSourceTransform(source);
        var previousSource = this.currentImportsBlock.getLastImportSource();
        this.currentImportsBlock.addImportDeclaration(this.sourceFile, node, currentSource, matchingGroup);
        if (previousSource !== null && compare(currentSource, previousSource) === -1) {
            this.lastFix = [];
            this.addFailureAtNode(node, Rule.IMPORT_SOURCES_UNORDERED, this.lastFix);
        }
    };
    Walker.prototype.endBlock = function () {
        if (this.lastFix !== undefined) {
            var replacement = this.currentImportsBlock.getReplacement();
            if (replacement !== undefined) {
                this.lastFix.push(replacement);
            }
            this.lastFix = undefined;
        }
        this.importsBlocks.push(new ImportsBlock());
    };
    Walker.prototype.checkNamedImports = function (node) {
        var _this = this;
        var imports = node.elements;
        var pair = findUnsortedPair(imports, this.options.namedImportsOrderTransform);
        if (pair !== undefined) {
            var a = pair[0], b = pair[1];
            var sortedDeclarations = sortByKey(imports, function (x) {
                return _this.options.namedImportsOrderTransform(x.getText());
            }).map(function (x) { return x.getText(); });
            // replace in reverse order to preserve earlier offsets
            for (var i = imports.length - 1; i >= 0; i--) {
                var start = imports[i].getStart();
                var length = imports[i].getText().length;
                // replace the named imports one at a time to preserve whitespace
                this.currentImportsBlock.replaceNamedImports(start, length, sortedDeclarations[i]);
            }
            this.lastFix = [];
            this.addFailure(a.getStart(), b.getEnd(), Rule.NAMED_IMPORTS_UNORDERED, this.lastFix);
        }
    };
    /**
     * Check all import blocks stopping at the first failure.
     */
    Walker.prototype.checkBlocksGrouping = function () {
        var _this = this;
        var prevBlockOrder = Number.MIN_SAFE_INTEGER;
        var addFailingImportDecl = function (decl) {
            var groupsMsg = _this.options.groups.slice().sort(function (a, b) { return a.order - b.order; })
                .map(function (g) { return g.name; })
                .join(", ");
            var msg = Rule.IMPORT_SOURCES_NOT_GROUPED_PREFIX + " " + groupsMsg + " .";
            _this.addFailureAtNode(decl.node, msg, _this.getGroupOrderReplacements());
        };
        for (var _i = 0, _a = this.importsBlocks; _i < _a.length; _i++) {
            var block = _a[_i];
            var importDeclarations = block.getImportDeclarations();
            if (importDeclarations.length === 0) {
                continue;
            }
            // check if group is out of order
            var blockOrder = importDeclarations[0].group.order;
            if (blockOrder <= prevBlockOrder) {
                addFailingImportDecl(importDeclarations[0]);
                return;
            }
            // check if all declarations have the same order value
            for (var _b = 0, importDeclarations_1 = importDeclarations; _b < importDeclarations_1.length; _b++) {
                var decl = importDeclarations_1[_b];
                if (decl.group.order !== blockOrder) {
                    addFailingImportDecl(decl);
                    return;
                }
            }
            prevBlockOrder = blockOrder;
        }
    };
    /**
     * Return the first import group pattern matching the given import path.
     */
    Walker.prototype.getMatchingGroup = function (importPath) {
        // find the first matching group.
        for (var _i = 0, _a = this.options.groups; _i < _a.length; _i++) {
            var group = _a[_i];
            if (group.match.test(importPath)) {
                return group;
            }
        }
        return this.defaultGroup;
    };
    /**
     * Build up replaces to remove all imports and replace with grouped and sorted imports.
     */
    Walker.prototype.getGroupOrderReplacements = function () {
        var _a;
        // Get all import declarations for all ImportBlocks groups that are not empty
        var groupedDeclarations = this.importsBlocks
            .map(function (block) { return block.getImportDeclarations(); })
            .filter(function (imports) { return imports.length > 0; });
        var replacements = this.getGroupRemovalReplacements(groupedDeclarations);
        var allImportDeclarations = (_a = []).concat.apply(_a, groupedDeclarations);
        var startOffset = allImportDeclarations.length === 0 ? 0 : allImportDeclarations[0].nodeStartOffset;
        replacements.push(Lint.Replacement.appendText(startOffset, this.getGroupedImports(allImportDeclarations)));
        return replacements;
    };
    /**
     * Get set of replacements that delete all existing imports.
     */
    Walker.prototype.getGroupRemovalReplacements = function (groupedDeclarations) {
        var _this = this;
        return groupedDeclarations.map(function (items, index) {
            var start = items[0].nodeStartOffset;
            if (index > 0) {
                var prevItems = groupedDeclarations[index - 1];
                var last = prevItems[prevItems.length - 1];
                if (/[\r\n]+/.test(_this.sourceFile.text.slice(last.nodeEndOffset, start))) {
                    // remove whitespace between blocks
                    start = last.nodeEndOffset;
                }
            }
            return Lint.Replacement.deleteFromTo(start, items[items.length - 1].nodeEndOffset);
        });
    };
    /**
     * Get text of new set of grouped and sorted imports as text.
     */
    Walker.prototype.getGroupedImports = function (importDeclarations) {
        // list of all unique order values in sorted order
        var orderValues = importDeclarations
            .map(function (decl) { return decl.group.order; })
            .filter(function (v, i, a) { return a.indexOf(v) === i; })
            .sort(function (a, b) { return a - b; });
        return orderValues
            .map(function (curOrder) {
            var imports = importDeclarations.filter(function (i) { return i.group.order === curOrder; });
            return getSortedImportDeclarationsAsText(imports);
        })
            .filter(function (text) { return text.length > 0; })
            .join(this.getEolChar());
    };
    /**
     * Return the type of newline that should be used in the codebase.
     */
    Walker.prototype.getEolChar = function () {
        var lineEnd = this.sourceFile.getLineEndOfPosition(0);
        var newLine;
        if (lineEnd > 0) {
            if (lineEnd > 1 && this.sourceFile.text[lineEnd - 1] === "\r") {
                newLine = "\r\n";
            }
            else if (this.sourceFile.text[lineEnd] === "\n") {
                newLine = "\n";
            }
        }
        return newLine === undefined ? ts.sys.newLine : newLine;
    };
    return Walker;
}(Lint.AbstractWalker));
/**
 * Wrapper around a set of imports grouped together in a sequence (block)
 * in the source code.
 */
var ImportsBlock = /** @class */ (function () {
    function ImportsBlock() {
        this.importDeclarations = [];
    }
    ImportsBlock.prototype.addImportDeclaration = function (sourceFile, node, sourcePath, group) {
        var start = this.getStartOffset(node);
        var end = this.getEndOffset(sourceFile, node);
        var text = sourceFile.text.substring(start, end);
        var type = this.getImportType(sourcePath);
        if (start > node.getStart() || end === 0) {
            // skip block if any statements don't end with a newline to simplify implementation
            this.importDeclarations = [];
            return;
        }
        this.importDeclarations.push({
            group: group,
            node: node,
            nodeEndOffset: end,
            nodeStartOffset: start,
            sourcePath: sourcePath,
            text: text,
            type: type,
        });
    };
    ImportsBlock.prototype.getImportDeclarations = function () {
        return this.importDeclarations;
    };
    // replaces the named imports on the most recent import declaration
    ImportsBlock.prototype.replaceNamedImports = function (fileOffset, length, replacement) {
        var importDeclaration = this.getLastImportDeclaration();
        if (importDeclaration === undefined) {
            // nothing to replace. This can happen if the block is skipped
            return;
        }
        var start = fileOffset - importDeclaration.nodeStartOffset;
        if (start < 0 || start + length > importDeclaration.node.getEnd()) {
            throw new Error("Unexpected named import position");
        }
        var initialText = importDeclaration.text;
        importDeclaration.text =
            initialText.substring(0, start) + replacement + initialText.substring(start + length);
    };
    ImportsBlock.prototype.getLastImportSource = function () {
        if (this.importDeclarations.length === 0) {
            return null;
        }
        return this.getLastImportDeclaration().sourcePath;
    };
    // creates a Lint.Replacement object with ordering fixes for the entire block
    ImportsBlock.prototype.getReplacement = function () {
        if (this.importDeclarations.length === 0) {
            return undefined;
        }
        var fixedText = getSortedImportDeclarationsAsText(this.importDeclarations);
        var start = this.importDeclarations[0].nodeStartOffset;
        var end = this.getLastImportDeclaration().nodeEndOffset;
        return new Lint.Replacement(start, end - start, fixedText);
    };
    // gets the offset immediately after the end of the previous declaration to include comment above
    ImportsBlock.prototype.getStartOffset = function (node) {
        if (this.importDeclarations.length === 0) {
            return node.getStart();
        }
        return this.getLastImportDeclaration().nodeEndOffset;
    };
    // gets the offset of the end of the import's line, including newline, to include comment to the right
    ImportsBlock.prototype.getEndOffset = function (sourceFile, node) {
        return sourceFile.text.indexOf("\n", node.end) + 1;
    };
    ImportsBlock.prototype.getLastImportDeclaration = function () {
        return this.importDeclarations[this.importDeclarations.length - 1];
    };
    ImportsBlock.prototype.getImportType = function (sourcePath) {
        if (sourcePath.charAt(0) === ".") {
            if (sourcePath.charAt(1) === ".") {
                return ImportType.PARENT_DIRECTORY_IMPORT;
            }
            else {
                return ImportType.CURRENT_DIRECTORY_IMPORT;
            }
        }
        else {
            return ImportType.LIBRARY_IMPORT;
        }
    };
    return ImportsBlock;
}());
// Convert aBcD --> AbCd
function flipCase(str) {
    return Array.from(str)
        .map(function (char) {
        if (char >= "a" && char <= "z") {
            return char.toUpperCase();
        }
        else if (char >= "A" && char <= "Z") {
            return char.toLowerCase();
        }
        return char;
    })
        .join("");
}
// After applying a transformation, are the nodes sorted according to the text they contain?
// If not, return the pair of nodes which are out of order.
function findUnsortedPair(xs, transform) {
    for (var i = 1; i < xs.length; i++) {
        if (transform(xs[i].getText()) < transform(xs[i - 1].getText())) {
            return [xs[i - 1], xs[i]];
        }
    }
    return undefined;
}
function compare(a, b) {
    function isLow(value) {
        return value[0] === "." || value[0] === "/";
    }
    if (isLow(a) && !isLow(b)) {
        return 1;
    }
    else if (!isLow(a) && isLow(b)) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    else if (a < b) {
        return -1;
    }
    return 0;
}
function removeQuotes(value) {
    // strip out quotes
    if (value.length > 1 && (value[0] === "'" || value[0] === '"')) {
        value = value.substr(1, value.length - 2);
    }
    return value;
}
function getSortedImportDeclarationsAsText(importDeclarations) {
    var sortedDeclarations = sortByKey(importDeclarations.slice(), function (x) { return x.sourcePath; });
    return sortedDeclarations.map(function (x) { return x.text; }).join("");
}
function sortByKey(xs, getSortKey) {
    return xs.slice().sort(function (a, b) { return compare(getSortKey(a), getSortKey(b)); });
}
function moduleDeclarationBody(node) {
    var body = node.body;
    while (body !== undefined && body.kind === ts.SyntaxKind.ModuleDeclaration) {
        body = body.body;
    }
    return body !== undefined && body.kind === ts.SyntaxKind.ModuleBlock ? body : undefined;
}
var templateObject_1, templateObject_2;
//# sourceMappingURL=orderedImportsRule.js.map