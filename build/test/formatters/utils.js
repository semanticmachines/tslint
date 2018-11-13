"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("../../src/language/rule/rule");
function createFailure(sourceFile, start, end, failure, ruleName, fix, ruleSeverity) {
    if (ruleSeverity === void 0) { ruleSeverity = "warning"; }
    var rule = new rule_1.RuleFailure(sourceFile, start, end, failure, ruleName, fix);
    rule.setRuleSeverity(ruleSeverity);
    return rule;
}
exports.createFailure = createFailure;
//# sourceMappingURL=utils.js.map