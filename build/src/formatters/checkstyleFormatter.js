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
var abstractFormatter_1 = require("../language/formatter/abstractFormatter");
var Utils = require("../utils");
var Formatter = /** @class */ (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Formatter.prototype.format = function (failures) {
        var output = '<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3">';
        if (failures.length !== 0) {
            var failuresSorted = failures.sort(function (a, b) {
                return a.getFileName().localeCompare(b.getFileName());
            });
            var previousFilename = null;
            for (var _i = 0, failuresSorted_1 = failuresSorted; _i < failuresSorted_1.length; _i++) {
                var failure = failuresSorted_1[_i];
                var severity = failure.getRuleSeverity();
                if (failure.getFileName() !== previousFilename) {
                    if (previousFilename !== null) {
                        output += "</file>";
                    }
                    previousFilename = failure.getFileName();
                    output += "<file name=\"" + this.escapeXml(failure.getFileName()) + "\">";
                }
                output += "<error line=\"" + (failure.getStartPosition().getLineAndCharacter().line +
                    1) + "\" ";
                output += "column=\"" + (failure.getStartPosition().getLineAndCharacter().character +
                    1) + "\" ";
                output += "severity=\"" + severity + "\" ";
                output += "message=\"" + this.escapeXml(failure.getFailure()) + "\" ";
                // checkstyle parser wants "source" to have structure like <anything>dot<category>dot<type>
                output += "source=\"failure.tslint." + this.escapeXml(failure.getRuleName()) + "\" />";
            }
            if (previousFilename !== null) {
                output += "</file>";
            }
        }
        output += "</checkstyle>";
        return output;
    };
    Formatter.prototype.escapeXml = function (str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/'/g, "&#39;")
            .replace(/"/g, "&quot;");
    };
    /* tslint:disable:object-literal-sort-keys */
    Formatter.metadata = {
        formatterName: "checkstyle",
        description: "Formats errors as through they were Checkstyle output.",
        descriptionDetails: Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Imitates the XMLLogger from Checkstyle 4.3. All failures have the 'warning' severity."], ["\n            Imitates the XMLLogger from Checkstyle 4.3. All failures have the 'warning' severity."]))),
        sample: Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        <?xml version=\"1.0\" encoding=\"utf-8\"?>\n        <checkstyle version=\"4.3\">\n            <file name=\"myFile.ts\">\n                <error line=\"1\" column=\"14\" severity=\"warning\" message=\"Missing semicolon\" source=\"failure.tslint.semicolon\" />\n            </file>\n        </checkstyle>"], ["\n        <?xml version=\"1.0\" encoding=\"utf-8\"?>\n        <checkstyle version=\"4.3\">\n            <file name=\"myFile.ts\">\n                <error line=\"1\" column=\"14\" severity=\"warning\" message=\"Missing semicolon\" source=\"failure.tslint.semicolon\" />\n            </file>\n        </checkstyle>"]))),
        consumer: "machine",
    };
    return Formatter;
}(abstractFormatter_1.AbstractFormatter));
exports.Formatter = Formatter;
var templateObject_1, templateObject_2;
//# sourceMappingURL=checkstyleFormatter.js.map