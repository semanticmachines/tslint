"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc.
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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var configuration_1 = require("../src/configuration");
var linter_1 = require("../src/linter");
describe("no-implicit-dependencies", function () {
    it("assumes empty package.json if not found", function () {
        var linter = new linter_1.Linter({
            fix: false,
            formatter: "prose",
        });
        var config = configuration_1.parseConfigFile({
            rules: {
                "no-implicit-dependencies": true,
            },
        });
        linter.lint("/builtin-only.ts", "\n                import * as fs from 'fs';\n                const path = require('path');\n            ", config);
        chai_1.assert.equal(linter.getResult().errorCount, 0, "no error expected");
        linter.lint("/test.ts", "\n                import {assert} from \"chai\";\n            ", config);
        chai_1.assert.equal(linter.getResult().errorCount, 1, "expected one error");
    });
});
//# sourceMappingURL=ruleTests.js.map