"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var lodash_1 = require("lodash");
var childProcess = __importStar(require("child_process"));
var Tree = __importStar(require("../tree"));
var parser_1 = require("../parser");
function main(resources, write) {
    return __awaiter(this, void 0, void 0, function () {
        var modules, _a, _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.all(resources.map(function (_a) {
                        var shortPath = _a[0], pending = _a[1];
                        return __awaiter(_this, void 0, void 0, function () {
                            var resource, parsed, namespace, _b, namespacedMsgs, nonNamespacedMsgs, isNamespaced, segments, moduleName, outputPath, output;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, pending];
                                    case 1:
                                        resource = _c.sent();
                                        parsed = path_1["default"].parse(shortPath);
                                        namespace = (0, lodash_1.kebabCase)(path_1["default"].join(parsed.dir, parsed.name)) + "-";
                                        _b = (0, lodash_1.partition)(resource.messages.map(function (m) { return m.id; }), function (m) { return m.startsWith(namespace); }), namespacedMsgs = _b[0], nonNamespacedMsgs = _b[1];
                                        if (namespacedMsgs.length > 0 && nonNamespacedMsgs.length > 0) {
                                            throw new Error("Cannot mix namespaced and non-namespaced keys in an ftl file. Namespaces are based on filename; \"" + shortPath + "\"'s namespace is \"" + namespace + "\".");
                                        }
                                        isNamespaced = namespacedMsgs.length > 0;
                                        segments = parsed.dir.split('/').filter(function (i) { return !!i; });
                                        segments.push(parsed.name);
                                        moduleName = "Localization." + segments.map(function (s) { return (0, lodash_1.upperFirst)((0, lodash_1.camelCase)(s)); }).join('.');
                                        outputPath = moduleName.replace('.', '/') + ".elm";
                                        return [4 /*yield*/, elmFormat(genResource({ messages: resource.messages, shortPath: shortPath, moduleName: moduleName, namespace: isNamespaced ? namespace : null }))];
                                    case 2:
                                        output = _c.sent();
                                        return [4 /*yield*/, write(outputPath, output)];
                                    case 3:
                                        _c.sent();
                                        return [2 /*return*/, { name: moduleName, messages: resource.messages.map(function (message) { return message.id; }), namespace: isNamespaced ? namespace : null }];
                                }
                            });
                        });
                    }))
                    // console.log(genIndex(modules))
                ];
                case 1:
                    modules = _c.sent();
                    _a = write;
                    _b = ['Localization.elm'];
                    return [4 /*yield*/, elmFormat(genIndex(modules))];
                case 2: 
                // console.log(genIndex(modules))
                return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                case 3:
                    // console.log(genIndex(modules))
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function genIndex(modules) {
    // TODO rebuild this without namespaces? we can't document them, and they don't really add much
    var root = Tree.build(modules.map(function (module) {
        var prefix = module.name.split('.').filter(function (i) { return i; });
        return module.messages.map(function (msg) { return prefix.concat([(0, lodash_1.camelCase)(msg.slice((module.namespace || '').length))]); });
    }).flat());
    var tree = root.nodes.Localization;
    return ("module Localization exposing (" + __spreadArray(__spreadArray([], tree.leaves, true), Object.keys(tree.nodes), true).map(lodash_1.lowerFirst).join(', ') + ")\n\n" + genHeader + "\n\n" + modules.map(function (m) { return "import " + m.name; }).join("\n") + "\n\n" + genModuleTree(tree, "\n") + "\n");
}
function genModuleTree(tree, sep) {
    if (sep === void 0) { sep = ', '; }
    var leaves = tree.leaves.map(function (l) { return [l, tree.path.concat([l]).join('.')]; });
    var nodes = Object.entries(tree.nodes).map(function (_a) {
        var name = _a[0], n = _a[1];
        return [name, "\n    { " + genModuleTree(n) + "\n    }"];
    });
    return __spreadArray(__spreadArray([], leaves, true), nodes, true).map(function (_a) {
        var lval = _a[0], rval = _a[1];
        return (0, lodash_1.lowerFirst)(lval) + " = " + rval;
    }).join("\n" + Array((tree.path.length - 1) * 4).fill(' ').join('') + sep);
}
function elmFormat(input) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // run the generated file through elm-format
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var proc = childProcess.exec("elm-format --stdin", {}, function (error, stdout, stderr) {
                        if (error) {
                            // console.error(stderr)
                            return reject(error);
                        }
                        return resolve(stdout);
                    });
                    if (!(proc === null || proc === void 0 ? void 0 : proc.stdin)) {
                        return reject('failed to spawn elm-format');
                    }
                    // console.error(input)
                    var stdin = proc.stdin; // make typescript happy
                    stdin.write(input, function () {
                        stdin.end();
                    });
                })];
        });
    });
}
var genHeader = '{-| File auto-generated by `@erosson/fluent-typesafe`. Do not edit! -}';
function genResource(p) {
    var messages = p.messages, shortPath = p.shortPath, moduleName = p.moduleName, namespace = p.namespace;
    var needsEncode = Math.max.apply(Math, messages.map(function (m) { return m.placeholders.length; })) > 0;
    var needsPosix = messages.map(function (m) { return m.placeholders; }).flat().filter(function (v) { return v.type === parser_1.VarType.DATETIME; }).length > 0;
    return ("module " + moduleName + " exposing(" + ['name_'].concat(messages.map(function (m) { return (0, lodash_1.camelCase)(m.id); })).join(', ') + ")\n\n" + genHeader + "\n\nimport Html as H\nimport Html.Attributes as A\n" + (needsEncode ? 'import Json.Encode as E' : '') + "\n" + (needsPosix ? 'import Time exposing (Posix)' : '') + "\n\nname_ : String -> H.Attribute msg\nname_ = A.attribute \"data-l10n-name\"\n\n" + messages.map(function (m) { return genMessage(__assign({ message: m }, p)); }).join("\n\n") + "\n");
}
function genMessage(p) {
    var message = p.message, namespace = p.namespace;
    var name = (0, lodash_1.camelCase)(message.id.slice((namespace || '').length));
    if (message.placeholders.length) {
        return (genDocstring(p) + "\n" + name + ": { " + message.placeholders.map(genArgType).join(', ') + " } -> List (H.Attribute msg)\n" + name + " " + (message.placeholders.length ? 'args ' : '') + "=\n    [ A.attribute \"data-l10n-id\" " + JSON.stringify(message.id) + "\n    , A.attribute \"data-l10n-args\" <| E.encode 0 <| E.object\n        [ " + message.placeholders.map(genArgEncoder).join("\n        , ") + "\n        ]\n    ]\n");
    }
    else {
        return (genDocstring(p) + "\n" + name + ": H.Attribute msg\n" + name + " =\n    A.attribute \"data-l10n-id\" " + JSON.stringify(message.id) + "\n");
    }
}
function genDocstring(p) {
    var message = p.message, shortPath = p.shortPath;
    return ("{-| Fluent message id `" + message.id + "`, in file `" + shortPath + "`\n\n```\n" + message.raw.replace('-}', '-\}').replace('\`', '\\\`') + "\n```\n\n-}\n");
}
function genArgType(v) {
    switch (v.type) {
        case parser_1.VarType.STRING: return v.name + " : String";
        case parser_1.VarType.NUMBER: return v.name + " : Float";
        case parser_1.VarType.DATETIME: return v.name + " : Posix";
    }
}
function genArgEncoder(v) {
    switch (v.type) {
        case parser_1.VarType.STRING: return "(" + JSON.stringify(v.name) + ", E.string args." + v.name + ")";
        case parser_1.VarType.NUMBER: return "(" + JSON.stringify(v.name) + ", E.float args." + v.name + ")";
        case parser_1.VarType.DATETIME: return "(" + JSON.stringify(v.name) + ", E.integer <| Time.posixToMillis args." + v.name + ")";
    }
}
exports["default"] = main;
