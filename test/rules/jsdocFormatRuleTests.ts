/*
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

import {TestUtils} from "../lint";

describe("<jsdoc-format>", () => {
    const JsdocFormatRule = TestUtils.getRule("jsdoc-format");

    it("ensures jsdoc comments have properly lined up asterisks and start with spaces", () => {
        const fileName = "rules/jsdoc.test.ts";
        const createFormatFailure = TestUtils.createFailuresOnFile(fileName, JsdocFormatRule.FORMAT_FAILURE_STRING);
        const createAlignmentFailure = TestUtils.createFailuresOnFile(fileName, JsdocFormatRule.ALIGNMENT_FAILURE_STRING);
        const expectedFailure1 = createFormatFailure([28, 1], [28, 40]);
        const expectedFailure2 = createAlignmentFailure([34, 1], [34, 6]);
        const expectedFailure3 = createFormatFailure([38, 1], [38, 8]);
        const expectedFailure4 = createFormatFailure([42, 1], [42, 7]);
        const expectedFailure5 = createAlignmentFailure([47, 1], [47, 19]);
        const expectedFailure6 = createFormatFailure([50, 5], [50, 26]);
        const expectedFailure7 = createFormatFailure([52, 5], [52, 32]);

        const actualFailures = TestUtils.applyRuleOnFile(fileName, JsdocFormatRule);

        TestUtils.assertContainsFailure(actualFailures, expectedFailure1);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure2);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure3);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure4);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure5);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure6);
        TestUtils.assertContainsFailure(actualFailures, expectedFailure7);
        assert.lengthOf(actualFailures, 7);
    });

    it("ensures jsdoc commments can have have windows line endings", () => {
        const fileName = "rules/jsdoc-windows.test.ts";
        const actualFailures = TestUtils.applyRuleOnFile(fileName, JsdocFormatRule);
        assert.lengthOf(actualFailures, 0);
    });
});
