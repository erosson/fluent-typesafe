"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var minimist_1 = __importDefault(require("minimist"));
var fs_1 = require("fs");
var glob_1 = __importDefault(require("glob"));
var util_1 = require("util");
var path_1 = __importDefault(require("path"));
var chokidar_1 = __importDefault(require("chokidar"));
var debounce_1 = __importDefault(require("lodash/debounce"));
var Parser = __importStar(require("./parser"));
var elm_1 = __importDefault(require("./codegen/elm"));
var react_1 = __importDefault(require("./codegen/react"));
var react_dom_1 = __importDefault(require("./codegen/react-dom"));
var glob = (0, util_1.promisify)(glob_1["default"]);
var usage = "usage: `fluent-typesafe --format=[elm|react|react-dom] [--dry-run] [--watch] --out=OUTPUT_DIRECTORY FTL_DIRECTORY`";
function parse(args) {
    var inputDir = args._[0];
    var outputDir = args['out'];
    var dryRun = args['dry-run'];
    var watch = args['watch'];
    if (!inputDir || !outputDir) {
        throw new Error(usage);
    }
    return { format: parseFormat(args), inputDir: inputDir, outputDir: outputDir, dryRun: dryRun, watch: watch };
}
function parseFormat(args) {
    switch (args.format) {
        case 'elm': return 'elm';
        case 'react': return 'react';
        case 'react-dom': return 'react-dom';
        default: throw new Error(usage);
    }
}
function runnerFormat(format) {
    switch (format) {
        case 'elm': return elm_1["default"];
        case 'react': return react_1["default"];
        case 'react-dom': return react_dom_1["default"];
    }
}
function write(args) {
    var _this = this;
    return function (path, data) { return __awaiter(_this, void 0, void 0, function () {
        var fullpath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fullpath = path_1["default"].resolve(path_1["default"].join(args.outputDir, path));
                    if (!args.dryRun) return [3 /*break*/, 1];
                    console.log('(fake) write', fullpath, data.length);
                    return [3 /*break*/, 3];
                case 1:
                    console.log('write', fullpath, data.length);
                    return [4 /*yield*/, fs_1.promises.mkdir(path_1["default"].parse(fullpath).dir, { recursive: true })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, fs_1.promises.writeFile(fullpath, data)];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var inputs, resources;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, glob(pattern, { cwd: args.inputDir })];
                        case 1:
                            inputs = _a.sent();
                            if (args.dryRun) {
                                console.log(args, inputs);
                            }
                            resources = inputs.map(function (p) { return [p, Parser.parseResource(path_1["default"].join(args.inputDir, p))]; });
                            return [2 /*return*/, runner(resources, writer)];
                    }
                });
            });
        }
        var args, pattern, runner, writer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = parse((0, minimist_1["default"])(process.argv.slice(2), { string: ['format', 'out'], boolean: ['dry-run'] }));
                    pattern = '**/*.ftl';
                    runner = (0, debounce_1["default"])(runnerFormat(args.format), 800);
                    writer = write(args);
                    if (!args.watch) return [3 /*break*/, 1];
                    return [2 /*return*/, chokidar_1["default"].watch(pattern, { persistent: true, awaitWriteFinish: true })
                            .on('add', run)
                            .on('change', run)
                            .on('unlink', run)];
                case 1: return [4 /*yield*/, run()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
main()["catch"](function (e) {
    console.error(e);
    process.exit(1);
});
