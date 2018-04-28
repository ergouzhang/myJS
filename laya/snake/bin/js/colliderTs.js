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
//此脚本为物体的一个组件
var colliderTs = /** @class */ (function (_super) {
    __extends(colliderTs, _super);
    function colliderTs() {
        return _super.call(this) || this;
    }
    //生命周期方法
    colliderTs.prototype._load = function (owner) {
        //获取被绑定对象
        this.cube = this.owner;
    };
    //碰撞回调方法
    colliderTs.prototype.onTriggerExit = function (other) {
        _super.prototype.onTriggerExit.call(this, other);
        console.log('onTriigerEnter>>>>');
        //获取与当前物体碰撞的蛇
        var sp = other.owner;
        //获取蛇的脚本
        var comp = sp.getComponentByType(newSnake);
        //蛇的长度加1
        comp.addLength(1);
        //销毁自己
        this.owner.destroy();
        // sp.event("eat",[5]) 
        //Laya.timer.frameOnce(1, this,function(){ this.owner.destroy() });
    };
    return colliderTs;
}(Laya.Script));
//# sourceMappingURL=colliderTs.js.map