//class utilTools {
function handler(obj, method) {
    return function (data) {
        return method.call(obj, data);
    };
}
var syncData = [];
// }
//# sourceMappingURL=utilTools.js.map