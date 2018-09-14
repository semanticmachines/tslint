import * as ts from "typescript";
import * as Lint from "../index";
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    private static FAILURE_STRING(expectedCasing);
    private static stylizedNameForCasing(casing);
    private static isCorrectCasing(fileName, casing);
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
