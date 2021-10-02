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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.parseResource = exports.VarType = void 0;
var Syntax = __importStar(require("@fluent/syntax"));
var fs_1 = require("fs");
var lodash_1 = require("lodash");
var VarType;
(function (VarType) {
    VarType["STRING"] = "string";
    VarType["NUMBER"] = "number";
    VarType["DATETIME"] = "datetime";
})(VarType = exports.VarType || (exports.VarType = {}));
function parseInlineExpression(expr) {
    switch (expr.type) {
        case 'VariableReference':
            return { name: expr.id.name, type: VarType.STRING };
        case 'FunctionReference':
            var first = expr.arguments.positional[0];
            switch (first === null || first === void 0 ? void 0 : first.type) {
                case 'VariableReference':
                    var name_1 = first.id.name;
                    switch (expr.id.name) {
                        case 'NUMBER':
                            return { name: name_1, type: VarType.NUMBER };
                        case 'DATETIME':
                            return { name: name_1, type: VarType.DATETIME };
                        default: return null;
                    }
                default: return null;
            }
        default: return null;
    }
}
function parseExpression(expr) {
    switch (expr.type) {
        case 'SelectExpression':
            return __spreadArray([parseInlineExpression(expr.selector)], expr.variants.map(function (variant) { return parsePattern(variant.value); }).flat(), true).filter(function (v) { return !!v; });
        default: return [parseInlineExpression(expr)].filter(function (v) { return !!v; });
    }
}
function parsePattern(pattern) {
    var placeables = pattern.elements.filter(function (el) { return el.type === 'Placeable'; });
    return placeables.map(function (el) { return parseExpression(el.expression); }).flat().filter(function (exp) { return !!exp; });
}
function parseResource_(path, raw) {
    var resource = Syntax.parse(raw, {});
    var msgs = resource.body.filter(function (entry) { return entry.type === 'Message'; });
    var messages = msgs.map(function (message) {
        var id = message.id.name;
        var attributes = new Set(message.attributes.map(function (attr) { return attr.id.name; }));
        var patterns = __spreadArray([message.value], message.attributes.map(function (a) { return a.value; }), true).filter(function (p) { return !!p; });
        // TODO prefer numbers and datetimes over strings
        var placeholders = (0, lodash_1.uniqBy)(patterns.map(parsePattern).flat(), 'name');
        var rawMsg = raw.slice(message.span.start, message.span.end);
        return { id: id, placeholders: placeholders, attributes: attributes, raw: rawMsg };
    });
    return { path: path, raw: raw, resource: resource, messages: messages };
}
function parseResource(path) {
    return __awaiter(this, void 0, void 0, function () {
        var raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(path, 'utf8')];
                case 1:
                    raw = _a.sent();
                    return [2 /*return*/, parseResource_(path, raw)];
            }
        });
    });
}
exports.parseResource = parseResource;
