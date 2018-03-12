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
var colliderTs = /** @class */ (function (_super) {
    __extends(colliderTs, _super);
    function colliderTs() {
        return _super.call(this) || this;
    }
    colliderTs.prototype._load = function (owner) {
        //获取被绑定对象
        this.cube = this.owner;
    };
    colliderTs.prototype.onTriggerEnter = function (other) {
        _super.prototype.onTriggerEnter.call(this, other);
        console.log('onTriigerEnter>>>>');
        var sp = other.owner;
        sp.event("eat", [1]);
        Laya.timer.frameOnce(1, this, function () { this.owner.destroy(); });
    };
    return colliderTs;
}(Laya.Script));
//# sourceMappingURL=colliderTs.js.map