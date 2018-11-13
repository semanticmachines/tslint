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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var cp = require("child_process");
var fs = require("fs");
var os = require("os");
var path = require("path");
var runner_1 = require("../../src/runner");
var utils_1 = require("../../src/utils");
var utils_2 = require("../utils");
// when tests are run with mocha from npm scripts CWD points to project root
var EXECUTABLE_DIR = path.resolve(process.cwd(), "test", "executable");
var EXECUTABLE_PATH = path.resolve(EXECUTABLE_DIR, "npm-like-executable");
var TEMP_JSON_PATH = path.resolve(EXECUTABLE_DIR, "tslint.json");
var dummyLogger = {
    log: function () {
        /* do nothing */
    },
    error: function () {
        /* do nothing */
    },
};
describe("Executable", function () {
    var _this = this;
    this.slow(3000); // the executable is JIT-ed each time it runs; avoid showing slowness warnings
    this.timeout(4000);
    describe("Files", function () {
        it("exits with code 1 if no arguments passed", function (done) {
            execCli([], function (err, stdout, stderr) {
                chai_1.assert.isNotNull(err, "process should exit with error");
                chai_1.assert.strictEqual(err.code, 1, "error code should be 1");
                chai_1.assert.include(stderr, "No files specified. Use --project to lint a project folder.", "stderr should contain notification about missing files");
                chai_1.assert.strictEqual(stdout, "", "shouldn't contain any output in stdout");
                done();
            });
        });
        it("exits with code 0 if correct file is passed", function (done) {
            execCli(["src/configuration.ts"], function (err) {
                chai_1.assert.isNull(err, "process should exit without an error");
                done();
            });
        });
        it("exits with code 0 if several files passed without `-f` flag", function (done) {
            execCli(["src/configuration.ts", "src/formatterLoader.ts"], function (err) {
                chai_1.assert.isNull(err, "process should exit without an error");
                done();
            });
        });
        it("exits with code 1 if removed `-f` flag is passed", function (done) {
            execCli(["src/configuration.ts", "-f", "src/formatterLoader.ts"], function (err, stdout, stderr) {
                chai_1.assert.isNotNull(err, "process should exit with error");
                chai_1.assert.strictEqual(err.code, 1, "error code should be 1");
                chai_1.assert.include(stderr, "error: unknown option `-f'");
                chai_1.assert.strictEqual(stdout, "", "shouldn't contain any output in stdout");
                done();
            });
        });
        it("warns if file does not exist", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({ files: ["foo/bar.ts"] })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.strictEqual(result.status, 0 /* Ok */, "process should exit without error");
                        chai_1.assert.include(result.stderr, "'foo/bar.ts' does not exist");
                        return [2 /*return*/];
                }
            });
        }); });
        it("doesn't warn if non-existent file is excluded by --exclude", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({
                            exclude: ["**/*.js"],
                            files: ["foo/bar.js"],
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.strictEqual(result.status, 0 /* Ok */, "process should exit without error");
                        chai_1.assert.notInclude(result.stderr, "does not exist");
                        return [2 /*return*/];
                }
            });
        }); });
        it("doesn't warn if glob pattern doesn't match any file", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({ files: ["foobar/*.js"] })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.strictEqual(result.status, 0 /* Ok */, "process should exit without error");
                        chai_1.assert.notInclude(result.stderr, "does not exist");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Configuration file", function () {
        it("exits with code 0 if relative path is passed without `./`", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "test/config/tslint-almost-empty.json",
                            files: ["src/test.ts"],
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 0 if config file that extends relative config file", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "test/config/tslint-extends-package-no-mod.json",
                            files: ["src/test.ts"],
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 1 if config file is invalid", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({
                            config: "test/config/tslint-invalid.json",
                            files: ["src/test.ts"],
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.equal(result.status, 1 /* FatalError */, "process should exit with error");
                        chai_1.assert.include(result.stderr, "Failed to load", "stderr should contain notification about failing to load json config");
                        chai_1.assert.strictEqual(result.stdout, "", "shouldn't contain any output in stdout");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 1 if yaml config file is invalid", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({
                            config: "test/config/tslint-invalid.yaml",
                            files: ["src/test.ts"],
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.strictEqual(result.status, 1 /* FatalError */, "error code should be 1");
                        chai_1.assert.include(result.stderr, "Failed to load", "stderr should contain notification about failing to load yaml config");
                        chai_1.assert.strictEqual(result.stdout, "", "shouldn't contain any output in stdout");
                        return [2 /*return*/];
                }
            });
        }); });
        it("mentions the root cause if a config file extends from an invalid file", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({
                            config: "test/config/tslint-extends-invalid.json",
                            files: ["src/test.ts"],
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.equal(result.status, 1 /* FatalError */, "process should exit with error");
                        chai_1.assert.include(result.stderr, "Failed to load", "stderr should contain notification about failing to load json config");
                        chai_1.assert.include(result.stderr, "tslint-invalid.json", "stderr should mention the problem file");
                        chai_1.assert.strictEqual(result.stdout, "", "shouldn't contain any output in stdout");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Custom formatters", function () {
        var createFormatVerifier = function (done) { return function (err, stdout) {
            chai_1.assert.isNotNull(err, "process should exit with error");
            chai_1.assert.strictEqual(err.code, 2, "error code should be 2");
            chai_1.assert.include(stdout, "hello from custom formatter", "stdout should contain output of custom formatter");
            done();
        }; };
        it("can be loaded from node_modules", function (done) {
            execCli([
                "-c",
                "tslint-custom-rules-with-dir.json",
                "../../src/test.ts",
                "-t",
                "tslint-test-custom-formatter",
            ], {
                cwd: "./test/config",
            }, createFormatVerifier(done));
        });
        it("can be specified from config", function (done) {
            execCli(["-c", "tslint-custom-rules-with-dir-and-format.json", "../../src/test.ts"], {
                cwd: "./test/config",
            }, createFormatVerifier(done));
        });
    });
    describe("Custom rules", function () {
        it("exits with code 1 if nonexisting custom rules directory is passed", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/config/tslint-custom-rules.json",
                            files: ["src/test.ts"],
                            rulesDirectory: "./someRandomDir",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 1 /* FatalError */, "error code should be 1");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 2 if custom rules directory is passed and file contains lint errors", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/config/tslint-custom-rules.json",
                            files: ["src/test.ts"],
                            rulesDirectory: "./test/files/custom-rules",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 2 /* LintError */, "error code should be 2");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 0 if custom rules directory is passed and file contains lint warnings", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/config/tslint-extends-package-warning.json",
                            files: ["src/test.ts"],
                            rulesDirectory: "./test/files/custom-rules",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 2 if custom rules directory is specified in config file and file contains lint errors", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/config/tslint-custom-rules-with-dir.json",
                            files: ["src/test.ts"],
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 2 /* LintError */, "error code should be 2");
                        return [2 /*return*/];
                }
            });
        }); });
        it("are compiled just in time when using ts-node", function (done) {
            execCli(["-c", "./test/config/tslint-custom-rules-uncompiled.json", "src/test.ts"], {
                env: __assign({}, process.env, { NODE_OPTIONS: "-r ts-node/register", TS_NODE_CACHE: "0", TS_NODE_FAST: "1" }),
            }, function (err) {
                chai_1.assert.isNull(err, "process should exit without an error");
                done();
            });
        });
    });
    describe("Config with excluded files", function () {
        it("exits with code 2 if linter options doesn't exclude file with lint errors", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/files/config-exclude/tslint-exclude-one.json",
                            files: ["./test/files/config-exclude/included.ts"],
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 2 /* LintError */, "error code should be 2");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 0 if linter options exclude one file with lint errors", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/files/config-exclude/tslint-exclude-one.json",
                            files: ["./test/files/config-exclude/excluded.ts"],
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 0 if linter options excludes many files with lint errors", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/files/config-exclude/tslint-exclude-many.json",
                            files: [
                                "./test/rules/config-exclude/excluded1.ts",
                                "./test/rules/config-exclude/subdir/excluded2.ts",
                            ],
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.strictEqual(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("excludes files relative to tslint.json", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/files/config-exclude/tslint-exclude-one.json",
                            files: ["./test/files/config-exclude/subdir/excluded.ts"],
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 2 /* LintError */, "exit code should be 2");
                        return [2 /*return*/];
                }
            });
        }); });
        it("excludes files relative to tslint.json they were declared in", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/files/config-exclude/subdir/tslint-extending.json",
                            files: ["./test/files/config-exclude/subdir/excluded.ts"],
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 2 /* LintError */, "exit code should be 2");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it("finds configuration above current directory", function (done) {
        execCli(["index.test.ts"], {
            cwd: "./test/files/config-findup/no-config",
        }, function (err) {
            chai_1.assert.isNotNull(err, "process should exit with an error");
            chai_1.assert.equal(err.code, 2, "exit code should be 2");
            done();
        });
    });
    describe("--fix flag", function () {
        it("fixes multiple rules without overwriting each other", function () { return __awaiter(_this, void 0, void 0, function () {
            var tempFile, result, content, denormalizedFileName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempFile = path.relative(process.cwd(), utils_2.createTempFile("ts"));
                        fs.writeFileSync(tempFile, 'import * as x from "b"\nimport * as y from "a_long_module";\n');
                        return [4 /*yield*/, execRunnerWithOutput({
                                config: "test/files/multiple-fixes-test/tslint.json",
                                files: [tempFile],
                                fix: true,
                            })];
                    case 1:
                        result = _a.sent();
                        content = fs.readFileSync(tempFile, "utf8");
                        denormalizedFileName = utils_1.denormalizeWinPath(tempFile);
                        fs.unlinkSync(tempFile);
                        chai_1.assert.equal(result.status, 0 /* Ok */, "process should exit without an error");
                        chai_1.assert.strictEqual(content, 'import * as y from "a_long_module";\nimport * as x from "b";\n');
                        chai_1.assert.strictEqual(result.stdout.trim(), "Fixed 2 error(s) in " + denormalizedFileName);
                        return [2 /*return*/];
                }
            });
        }); }).timeout(8000);
    });
    describe("--force flag", function () {
        it("exits with code 0 if `--force` flag is passed", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({
                            config: "./test/config/tslint-custom-rules.json",
                            files: ["src/test.ts"],
                            force: true,
                            rulesDirectory: "./test/files/custom-rules",
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.equal(result.status, 0 /* Ok */, "process should exit without an error");
                        chai_1.assert.include(result.stdout, "failure", "errors should be reported");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("--test flag", function () {
        it("exits with code 0 if `--test` flag is used", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({ test: true, files: ["test/rules/no-eval"] })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 0 if `--test` flag is used with a wildcard", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({ test: true, files: ["test/rules/no-e*"] })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 1 if `--test` flag is used with incorrect rule", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            files: ["test/files/incorrect-rule-test"],
                            test: true,
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 1 /* FatalError */, "error code should be 1");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 1 if `--test` flag is used with incorrect rule in a wildcard", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({ test: true, files: ["test/files/incorrect-rule-*"] })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 1 /* FatalError */, "error code should be 1");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 0 if `--test` flag is used with custom rule", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            files: ["test/files/custom-rule-rule-test"],
                            test: true,
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 0 if `--test` and `-r` flags are used with custom rule", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            files: ["test/files/custom-rule-cli-rule-test"],
                            rulesDirectory: "test/files/custom-rules-2",
                            test: true,
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 0 if `--test` flag is used with fixes", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({ test: true, files: ["test/files/fixes-test"] })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 1 if `--test` flag is used with incorrect fixes", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            files: ["test/files/incorrect-fixes-test"],
                            test: true,
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 1 /* FatalError */, "error code should be 1");
                        return [2 /*return*/];
                }
            });
        }); });
        it("can be used with multiple paths", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            files: ["test/files/custom-rule-rule-test", "test/files/incorrect-fixes-test"],
                            test: true,
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 1 /* FatalError */, "error code should be 1");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("--project flag", function () {
        it("exits with code 0 if `tsconfig.json` is passed and it specifies files without errors", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "test/files/tsconfig-test/tslint.json",
                            project: "test/files/tsconfig-test/tsconfig.json",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("can be passed a directory and defaults to tsconfig.json", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "test/files/tsconfig-test/tslint.json",
                            project: "test/files/tsconfig-test",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with error if passed a directory and there is not tsconfig.json", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "test/files/tsconfig-test/tslint.json",
                            project: "test/files",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 1 /* FatalError */, "exit code should be 1");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with error if passed directory does not exist", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "test/files/tsconfig-test/tslint.json",
                            project: "test/files/non-existent",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 1 /* FatalError */, "exit code should be 1");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 1 if file is not included in project", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "test/files/tsconfig-test/tslint.json",
                            files: ["test/files/tsconfig-test/other.test.ts"],
                            project: "test/files/tsconfig-test/tsconfig.json",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 1 /* FatalError */, "exit code should be 1");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 0 if `tsconfig.json` is passed but it includes no ts files", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "test/files/tsconfig-no-ts-files/tslint.json",
                            project: "test/files/tsconfig-no-ts-files/tsconfig.json",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("can extend `tsconfig.json` with relative path", function () { return __awaiter(_this, void 0, void 0, function () {
            var status1, status2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "test/files/tsconfig-extends-relative/tslint-ok.json",
                            project: "test/files/tsconfig-extends-relative/test/tsconfig.json",
                        })];
                    case 1:
                        status1 = _a.sent();
                        chai_1.assert.equal(status1, 0 /* Ok */, "process should exit without an error");
                        return [4 /*yield*/, execRunner({
                                config: "test/files/tsconfig-extends-relative/tslint-fail.json",
                                project: "test/files/tsconfig-extends-relative/test/tsconfig.json",
                            })];
                    case 2:
                        status2 = _a.sent();
                        chai_1.assert.equal(status2, 2 /* LintError */, "exit code should be 2");
                        return [2 /*return*/];
                }
            });
        }); });
        it("warns if file-to-lint does not exist", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({
                            files: ["test/files/tsconfig-test/non-existent.test.ts"],
                            project: "test/files/tsconfig-test/tsconfig.json",
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.strictEqual(result.status, 0 /* Ok */, "process should exit without error");
                        chai_1.assert.include(result.stderr, path.normalize("test/files/tsconfig-test/non-existent.test.ts") + "' does not exist");
                        return [2 /*return*/];
                }
            });
        }); });
        it("doesn't warn for non-existent file-to-lint if excluded by --exclude", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({
                            exclude: ["**/*"],
                            files: ["test/files/tsconfig-test/non-existent.test.ts"],
                            project: "test/files/tsconfig-test/tsconfig.json",
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.strictEqual(result.status, 0 /* Ok */, "process should exit without error");
                        chai_1.assert.notInclude(result.stderr, "does not exist");
                        return [2 /*return*/];
                }
            });
        }); });
        it("doesn't warn if glob pattern doesn't match any file", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({
                            files: ["*.js"],
                            project: "test/files/tsconfig-test/tsconfig.json",
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.strictEqual(result.status, 0 /* Ok */, "process should exit without error");
                        chai_1.assert.notInclude(result.stderr, "does not exist");
                        return [2 /*return*/];
                }
            });
        }); });
        it("reports errors from parsing tsconfig.json", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({
                            project: "test/files/tsconfig-invalid/syntax-error.json",
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.strictEqual(result.status, 1 /* FatalError */, "exit code should be 1");
                        chai_1.assert.include(result.stderr, "error TS");
                        return [2 /*return*/];
                }
            });
        }); });
        it("reports errors from validating tsconfig.json", function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunnerWithOutput({
                            project: "test/files/tsconfig-invalid/empty-files.json",
                        })];
                    case 1:
                        result = _a.sent();
                        chai_1.assert.strictEqual(result.status, 1 /* FatalError */, "exit code should be 1");
                        chai_1.assert.include(result.stderr, "error TS");
                        return [2 /*return*/];
                }
            });
        }); });
        it("does not report an error if tsconfig.json matches no files", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            project: "test/files/tsconfig-invalid/no-match.json",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.strictEqual(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("can execute typed rules without --type-check", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({ project: "test/files/typed-rule/tsconfig.json" })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 2 /* LintError */, "exit code should be 2");
                        return [2 /*return*/];
                }
            });
        }); });
        it("handles 'allowJs' correctly", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            project: "test/files/tsconfig-allow-js/tsconfig.json",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 2 /* LintError */, "exit code should be 2");
                        return [2 /*return*/];
                }
            });
        }); });
        it("doesn't lint external dependencies with 'allowJs'", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            project: "test/files/allow-js-exclude-node-modules/tsconfig.json",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("works with '--exclude'", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            exclude: ["test/files/tsconfig-allow-js/testfile.test.js"],
                            project: "test/files/tsconfig-allow-js/tsconfig.json",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        return [2 /*return*/];
                }
            });
        }); });
        it("can apply fixes from multiple rules", function () { return __awaiter(_this, void 0, void 0, function () {
            var status, actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fs.writeFileSync("test/files/project-multiple-fixes/testfile.test.ts", fs.readFileSync("test/files/project-multiple-fixes/before.test.ts", "utf-8"));
                        return [4 /*yield*/, execRunner({
                                fix: true,
                                project: "test/files/project-multiple-fixes/",
                            })];
                    case 1:
                        status = _a.sent();
                        actual = fs.readFileSync("test/files/project-multiple-fixes/testfile.test.ts", "utf-8");
                        fs.unlinkSync("test/files/project-multiple-fixes/testfile.test.ts");
                        chai_1.assert.equal(status, 0 /* Ok */, "process should exit without an error");
                        chai_1.assert.strictEqual(actual, fs.readFileSync("test/files/project-multiple-fixes/after.test.ts", "utf-8"));
                        return [2 /*return*/];
                }
            });
        }); }).timeout(8000);
    });
    describe("--type-check", function () {
        it("exits with code 1 if --project is not passed", function (done) {
            execCli(["--type-check"], function (err) {
                chai_1.assert.isNotNull(err, "process should exit with error");
                chai_1.assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });
    });
    describe("--init flag", function () {
        // remove temp file before calling tslint --init
        beforeEach(cleanTempInitFile);
        // clean up temp file after tests
        afterEach(cleanTempInitFile);
        it("exits with code 0 if `--init` flag is used in folder without tslint.json", function (done) {
            execCli(["--init"], { cwd: EXECUTABLE_DIR }, function (err) {
                chai_1.assert.isNull(err, "process should exit without an error");
                chai_1.assert.strictEqual(fs.existsSync(TEMP_JSON_PATH), true, "file should be created");
                done();
            });
        });
        it("exits with code 1 if `--init` flag is used in folder with tslint.json", function (done) {
            // make sure that file exists before test
            fs.writeFileSync(TEMP_JSON_PATH, "{}");
            execCli(["--init"], { cwd: EXECUTABLE_DIR }, function (err) {
                chai_1.assert.isNotNull(err, "process should exit with error");
                chai_1.assert.strictEqual(err.code, 1, "error code should be 1");
                done();
            });
        });
    });
    describe("globs and quotes", function () {
        // when glob pattern is passed without quotes in npm script `process.env` will contain:
        // on Windows - pattern string without any quotes
        // on Linux - list of files that matches glob (may differ from `glob` module results)
        it("exits with code 2 if correctly finds file containing lint errors when glob is in double quotes", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/config/tslint-custom-rules.json",
                            files: ["src/**/test.ts"],
                            rulesDirectory: "./test/files/custom-rules",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 2 /* LintError */, "error code should be 2");
                        return [2 /*return*/];
                }
            });
        }); });
        it("exits with code 2 if correctly finds file containing lint errors when glob is in single quotes", function () { return __awaiter(_this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRunner({
                            config: "./test/config/tslint-custom-rules.json",
                            files: ["'src/**/test.ts'"],
                            rulesDirectory: "./test/files/custom-rules",
                        })];
                    case 1:
                        status = _a.sent();
                        chai_1.assert.equal(status, 2 /* LintError */, "error code should be 2");
                        return [2 /*return*/];
                }
            });
        }); });
        it("can handle multiple '--exclude' globs", function (done) {
            execCli([
                "-c",
                "test/files/multiple-excludes/tslint.json",
                "--exclude",
                "'test/files/multiple-excludes/invalid.test.ts'",
                "--exclude",
                "'test/files/multiple-excludes/invalid2*'",
                "'test/files/multiple-excludes/**.ts'",
            ], function (err) {
                chai_1.assert.isNull(err, "process should exit without an error");
                done();
            });
        });
    });
});
function execCli(args, options, cb) {
    var filePath = EXECUTABLE_PATH;
    // Specify extension for Windows executable to avoid ENOENT errors
    if (os.platform() === "win32") {
        filePath += ".cmd";
    }
    if (isFunction(options)) {
        cb = options;
        options = {};
    }
    return cp.execFile(filePath, args, options, function (error, stdout, stderr) {
        if (cb === undefined) {
            throw new Error("cb not defined");
        }
        cb(error, stdout.trim(), stderr.trim());
    });
}
// tslint:disable-next-line:promise-function-async
function execRunnerWithOutput(options) {
    var stdout = "";
    var stderr = "";
    return execRunner(options, {
        log: function (text) {
            stdout += text;
        },
        error: function (text) {
            stderr += text;
        },
    }).then(function (status) { return ({ status: status, stderr: stderr, stdout: stdout }); });
}
// tslint:disable-next-line:promise-function-async
function execRunner(options, logger) {
    if (logger === void 0) { logger = dummyLogger; }
    return runner_1.run(__assign({ exclude: [], files: [] }, options), logger);
}
// tslint:disable-next-line:ban-types
function isFunction(fn) {
    return {}.toString.call(fn) === "[object Function]";
}
function cleanTempInitFile() {
    if (fs.existsSync(TEMP_JSON_PATH)) {
        fs.unlinkSync(TEMP_JSON_PATH);
    }
}
//# sourceMappingURL=executableTests.js.map