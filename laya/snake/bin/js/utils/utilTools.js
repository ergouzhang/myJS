//class utilTools {
function handler(obj, method) {
    return function (data) {
        return method.call(obj, data);
    };
}
var syncData = [];
var userInfo = {};
// }
//# sourceMappingURL=utilTools.js.map