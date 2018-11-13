"use strict";
/**
 * @license
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
// tslint:disable strict-boolean-expressions (TODO: Fix up options)
var fs = require("fs");
var glob = require("glob");
var minimatch_1 = require("minimatch");
var path = require("path");
var ts = require("typescript");
var configuration_1 = require("./configuration");
var error_1 = require("./error");
var linter_1 = require("./linter");
var utils_1 = require("./utils");
function run(options, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runWorker(options, logger)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_2 = _a.sent();
                    if (error_2 instanceof error_1.FatalError) {
                        logger.error(error_2.message + "\n");
                        return [2 /*return*/, 1 /* FatalError */];
                    }
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
function runWorker(options, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var test_1, results, _a, output, errorCount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (options.init) {
                        if (fs.existsSync(configuration_1.JSON_CONFIG_FILENAME)) {
                            throw new error_1.FatalError("Cannot generate " + configuration_1.JSON_CONFIG_FILENAME + ": file already exists");
                        }
                        fs.writeFileSync(configuration_1.JSON_CONFIG_FILENAME, JSON.stringify(configuration_1.DEFAULT_CONFIG, undefined, "    "));
                        return [2 /*return*/, 0 /* Ok */];
                    }
                    if (!options.test) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./test"); })];
                case 1:
                    test_1 = _b.sent();
                    results = test_1.runTests((options.files || []).map(trimSingleQuotes), options.rulesDirectory);
                    return [2 /*return*/, test_1.consoleTestResultsHandler(results, logger) ? 0 /* Ok */ : 1 /* FatalError */];
                case 2:
                    if (options.config && !fs.existsSync(options.config)) {
                        throw new error_1.FatalError("Invalid option for configuration: " + options.config);
                    }
                    return [4 /*yield*/, runLinter(options, logger)];
                case 3:
                    _a = _b.sent(), output = _a.output, errorCount = _a.errorCount;
                    if (output && output.trim()) {
                        logger.log(output + "\n");
                    }
                    return [2 /*return*/, options.force || errorCount === 0 ? 0 /* Ok */ : 2 /* LintError */];
            }
        });
    });
}
function runLinter(options, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, files, program, diagnostics, message;
        return __generator(this, function (_b) {
            _a = resolveFilesAndProgram(options, logger), files = _a.files, program = _a.program;
            // if type checking, run the type checker
            if (program && options.typeCheck) {
                diagnostics = ts.getPreEmitDiagnostics(program);
                if (diagnostics.length !== 0) {
                    message = diagnostics
                        .map(function (d) { return showDiagnostic(d, program, options.outputAbsolutePaths); })
                        .join("\n");
                    if (options.force) {
                        logger.error(message + "\n");
                    }
                    else {
                        throw new error_1.FatalError(message);
                    }
                }
            }
            return [2 /*return*/, doLinting(options, files, program, logger)];
        });
    });
}
function resolveFilesAndProgram(_a, logger) {
    var files = _a.files, project = _a.project, exclude = _a.exclude, outputAbsolutePaths = _a.outputAbsolutePaths;
    // remove single quotes which break matching on Windows when glob is passed in single quotes
    exclude = exclude.map(trimSingleQuotes);
    if (project === undefined) {
        return { files: resolveGlobs(files, exclude, outputAbsolutePaths, logger) };
    }
    var projectPath = findTsconfig(project);
    if (projectPath === undefined) {
        throw new error_1.FatalError("Invalid option for project: " + project);
    }
    exclude = exclude.map(function (pattern) { return path.resolve(pattern); });
    var program = linter_1.Linter.createProgram(projectPath);
    var filesFound;
    if (files.length === 0) {
        filesFound = filterFiles(linter_1.Linter.getFileNames(program), exclude, false);
    }
    else {
        files = files.map(function (f) { return path.resolve(f); });
        filesFound = filterFiles(program.getSourceFiles().map(function (f) { return f.fileName; }), files, true);
        filesFound = filterFiles(filesFound, exclude, false);
        // find non-glob files that have no matching file in the project and are not excluded by any exclude pattern
        for (var _i = 0, _b = filterFiles(files, exclude, false); _i < _b.length; _i++) {
            var file = _b[_i];
            if (!glob.hasMagic(file) && !filesFound.some(minimatch_1.filter(file))) {
                if (fs.existsSync(file)) {
                    throw new error_1.FatalError("'" + file + "' is not included in project.");
                }
                logger.error("'" + file + "' does not exist. This will be an error in TSLint 6.\n"); // TODO make this an error in v6.0.0
            }
        }
    }
    return { files: filesFound, program: program };
}
function filterFiles(files, patterns, include) {
    if (patterns.length === 0) {
        return include ? [] : files;
    }
    var matcher = patterns.map(function (pattern) { return new minimatch_1.Minimatch(pattern, { dot: !include }); }); // `glob` always enables `dot` for ignore patterns
    return files.filter(function (file) { return include === matcher.some(function (pattern) { return pattern.match(file); }); });
}
function resolveGlobs(files, ignore, outputAbsolutePaths, logger) {
    var results = utils_1.flatMap(files, function (file) {
        return glob.sync(trimSingleQuotes(file), { ignore: ignore, nodir: true });
    });
    // warn if `files` contains non-existent files, that are not patters and not excluded by any of the exclude patterns
    for (var _i = 0, _a = filterFiles(files, ignore, false); _i < _a.length; _i++) {
        var file = _a[_i];
        if (!glob.hasMagic(file) && !results.some(minimatch_1.filter(file))) {
            logger.error("'" + file + "' does not exist. This will be an error in TSLint 6.\n"); // TODO make this an error in v6.0.0
        }
    }
    var cwd = process.cwd();
    return results.map(function (file) { return (outputAbsolutePaths ? path.resolve(cwd, file) : path.relative(cwd, file)); });
}
function doLinting(options, files, program, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var configFile, formatter, linter, lastFolder, _i, files_1, file, folder, contents, sourceFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    configFile = options.config !== undefined ? configuration_1.findConfiguration(options.config).results : undefined;
                    formatter = options.format;
                    if (formatter === undefined) {
                        formatter =
                            configFile && configFile.linterOptions && configFile.linterOptions.format
                                ? configFile.linterOptions.format
                                : "prose";
                    }
                    linter = new linter_1.Linter({
                        fix: !!options.fix,
                        formatter: formatter,
                        formattersDirectory: options.formattersDirectory,
                        quiet: !!options.quiet,
                        rulesDirectory: options.rulesDirectory,
                    }, program);
                    _i = 0, files_1 = files;
                    _a.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 6];
                    file = files_1[_i];
                    if (options.config === undefined) {
                        folder = path.dirname(file);
                        if (lastFolder !== folder) {
                            configFile = configuration_1.findConfiguration(null, folder).results;
                            lastFolder = folder;
                        }
                    }
                    if (configuration_1.isFileExcluded(file, configFile)) {
                        return [3 /*break*/, 5];
                    }
                    contents = void 0;
                    if (!(program !== undefined)) return [3 /*break*/, 2];
                    sourceFile = program.getSourceFile(file);
                    if (sourceFile !== undefined) {
                        contents = sourceFile.text;
                    }
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, tryReadFile(file, logger)];
                case 3:
                    contents = _a.sent();
                    _a.label = 4;
                case 4:
                    if (contents !== undefined) {
                        linter.lint(file, contents, configFile);
                    }
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, linter.getResult()];
            }
        });
    });
}
/** Read a file, but return undefined if it is an MPEG '.ts' file. */
function tryReadFile(filename, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer, fd;
        return __generator(this, function (_a) {
            if (!fs.existsSync(filename)) {
                throw new error_1.FatalError("Unable to open file: " + filename);
            }
            buffer = Buffer.allocUnsafe(256);
            fd = fs.openSync(filename, "r");
            try {
                fs.readSync(fd, buffer, 0, 256, 0);
                if (buffer.readInt8(0) === 0x47 && buffer.readInt8(188) === 0x47) {
                    // MPEG transport streams use the '.ts' file extension. They use 0x47 as the frame
                    // separator, repeating every 188 bytes. It is unlikely to find that pattern in
                    // TypeScript source, so tslint ignores files with the specific pattern.
                    logger.error(filename + ": ignoring MPEG transport stream\n");
                    return [2 /*return*/, undefined];
                }
            }
            finally {
                fs.closeSync(fd);
            }
            return [2 /*return*/, fs.readFileSync(filename, "utf8")];
        });
    });
}
function showDiagnostic(_a, program, outputAbsolutePaths) {
    var file = _a.file, start = _a.start, category = _a.category, messageText = _a.messageText;
    var message = ts.DiagnosticCategory[category];
    if (file !== undefined && start !== undefined) {
        var _b = file.getLineAndCharacterOfPosition(start), line = _b.line, character = _b.character;
        var currentDirectory = program.getCurrentDirectory();
        var filePath = outputAbsolutePaths
            ? path.resolve(currentDirectory, file.fileName)
            : path.relative(currentDirectory, file.fileName);
        message += " at " + filePath + ":" + (line + 1) + ":" + (character + 1) + ":";
    }
    return message + " " + ts.flattenDiagnosticMessageText(messageText, "\n");
}
function trimSingleQuotes(str) {
    return str.replace(/^'|'$/g, "");
}
function findTsconfig(project) {
    try {
        var stats = fs.statSync(project); // throws if file does not exist
        if (!stats.isDirectory()) {
            return project;
        }
        var projectFile = path.join(project, "tsconfig.json");
        fs.accessSync(projectFile); // throws if file does not exist
        return projectFile;
    }
    catch (e) {
        return undefined;
    }
}
//# sourceMappingURL=runner.js.map