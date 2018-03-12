var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var newSnake = /** @class */ (function (_super) {
    __extends(newSnake, _super);
    function newSnake(mesh) {
        var _this = _super.call(this, mesh) || this;
        _this.length = 0;
        _this.tiles = [];
        _this.tilesDirection = [];
        _this.nowDirection = new Laya.Vector3(-speed, 0, 0);
        return _this;
    }
    return newSnake;
}(Laya.MeshSprite3D));
//# sourceMappingURL=snake2.js.map