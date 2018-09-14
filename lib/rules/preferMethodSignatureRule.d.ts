import * as ts from "typescript";
import * as Lint from "../index";
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static FAILURE_STRING: string;
    static METH_SIGN_STRING(ps: ts.PropertySignature): string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
