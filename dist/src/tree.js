"use strict";
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
exports.build = void 0;
function build(segmentsList) {
    var res = { nodes: {}, leaves: [], path: [] };
    for (var _i = 0, segmentsList_1 = segmentsList; _i < segmentsList_1.length; _i++) {
        var segments = segmentsList_1[_i];
        var level = res;
        var path = [];
        var tail = segments.pop();
        for (var _a = 0, segments_1 = segments; _a < segments_1.length; _a++) {
            var segment = segments_1[_a];
            path.push(segment);
            if (!level.nodes[segment]) {
                level.nodes[segment] = { nodes: {}, leaves: [], path: __spreadArray([], path, true) };
            }
            level = level.nodes[segment];
        }
        level.leaves.push(tail);
    }
    return res;
}
exports.build = build;
