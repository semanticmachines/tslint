"use strict";
/*
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
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var glob = require("glob");
var path = require("path");
var test_1 = require("../src/test");
process.stdout.write(chalk_1.default.underline("\nTesting Lint Rules:\n"));
var testDirectories = glob.sync("test/rules/**/tslint.json").map(path.dirname);
for (var _i = 0, testDirectories_1 = testDirectories; _i < testDirectories_1.length; _i++) {
    var testDirectory = testDirectories_1[_i];
    var results = test_1.runTest(testDirectory);
    var didAllTestsPass = test_1.consoleTestResultHandler(results, {
        log: function (m) {
            process.stdout.write(m);
        },
        error: function (m) {
            process.stderr.write(m);
        },
    });
    if (!didAllTestsPass) {
        process.exitCode = 1;
        break;
    }
}
//# sourceMappingURL=ruleTestRunner.js.map