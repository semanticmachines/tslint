"use strict";
/**
 * @license
 * Copyright 2018 Palantir Technologies, Inc.
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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("../../index");
// tslint:disable: object-literal-sort-keys
exports.codeExamples = [
    {
        description: "Disallows sparse arrays",
        config: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            \"rules\": { \"no-sparse-arrays\": true }\n        "], ["\n            \"rules\": { \"no-sparse-arrays\": true }\n        "]))),
        pass: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            const arr: string[] = ['elemenet1', 'element2'];\n        "], ["\n            const arr: string[] = ['elemenet1', 'element2'];\n        "]))),
        fail: Lint.Utils.dedent(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n            const arr: string[] = ['elemenet1',, 'element2'];\n        "], ["\n            const arr: string[] = ['elemenet1',, 'element2'];\n        "]))),
    },
];
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=noSparseArrays.examples.js.map