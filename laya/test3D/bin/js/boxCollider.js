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
var boxCollider = /** @class */ (function (_super) {
    __extends(boxCollider, _super);
    function boxCollider() {
        return _super.call(this) || this;
    }
    boxCollider.prototype.onTriggerEnter = function (other) {
        _super.prototype.onTriggerEnter.call(this, other);
        var sp = other.owner;
        sp.transform.scale.x += 1;
        this.owner.destroy();
    };
    return boxCollider;
}(Laya.Script));
//# sourceMappingURL=boxCollider.js.map