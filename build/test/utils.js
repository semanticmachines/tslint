"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var os = require("os");
var path = require("path");
var Lint = require("./lint");
function getSourceFile(fileName) {
    var relativePath = path.join("test", "files", fileName);
    var source = fs.readFileSync(relativePath, "utf8");
    return Lint.getSourceFile(fileName, source);
}
exports.getSourceFile = getSourceFile;
function getFormatter(formatterName) {
    var formattersDirectory = path.join(__dirname, "../src/formatters");
    return Lint.findFormatter(formatterName, formattersDirectory);
}
exports.getFormatter = getFormatter;
function createTempFile(extension) {
    for (var i = 0; i < 5; i++) {
        var attempt = path.join(os.tmpdir(), "tslint.test" + Math.round(Date.now() * Math.random()) + "." + extension);
        if (!fs.existsSync(attempt)) {
            return attempt;
        }
    }
    throw new Error("Couldn't create temp file");
}
exports.createTempFile = createTempFile;
//# sourceMappingURL=utils.js.map