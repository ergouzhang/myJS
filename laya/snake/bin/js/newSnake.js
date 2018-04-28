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
    function newSnake() {
        var _this = _super.call(this) || this;
        _this.length = 0;
        _this.tiles = [];
        _this.tilesDirection = [];
        _this.nowDirection = new Laya.Vector3(-5, 0, 0);
        _this.destroyed = false;
        _this.snakeId = 0;
        _this.speed = 5;
        _this.interTime = 100;
        _this.length = 0;
        _this.tiles = [];
        _this.tilesDirection = [];
        return _this;
    }
    newSnake.prototype._load = function (owner) {
        //获取脚本绑定的对象
        this.snakeHead = this.owner;
        this.tiles[0] = this.snakeHead;
        this.tilesDirection[0] = this.nowDirection;
        //    this .snakeHead.on("eat",this,this.addLength)
    };
    //蛇身增加长度
    //TIPS:目前的蛇的身体都是直接加在了scene上
    newSnake.prototype.addLength = function (lengthToAdd) {
        console.log('add Length>>>' + lengthToAdd);
        for (var index = 0; index < lengthToAdd; index++) {
            this.length += 1;
            var tile = this.snakeHead.clone();
            tile.name = "body_" + this.snakeId;
            tile.removeComponentByType(newSnake);
            this.tiles[this.length] = tile;
            this.tilesDirection[this.length] = this.tilesDirection[this.length - 1];
            this.snakeHead.parent.addChild(tile);
            var preTile = this.tiles[this.length - 1];
            tile.transform.position = this.tiles[this.length - 1].transform.position.clone();
            var newDirection = new Laya.Vector3(-this.tilesDirection[this.length].x, -this.tilesDirection[this.length].y, -this.tilesDirection[this.length].z);
            tile.transform.translate(newDirection);
            var material = tile.meshRender.material;
            material.albedo = new Laya.Vector4(1, 0, 1, 1);
        }
    };
    //onTriggerEnter貌似有bug，会被同一物体触发2次
    newSnake.prototype.onTriggerEnter = function (other) {
        if (!other || !other.owner || this.destroyed || (other.owner.getComponentByType(newSnake) && other.owner.getComponentByType(newSnake).destroyed)) {
            return;
        }
        if (other.owner.name.match("box")) {
            other.owner.destroy();
            this.addLength(1);
        }
        else if (other.owner.name.match("body")) {
            var snakeId = other.owner.name.charAt(5);
            var snake_1 = other.owner.parent.getChildByName("snake_" + snakeId);
            var snakeScirpt_1 = snake_1.getComponentByType(newSnake);
            if (snakeScirpt_1.destroyed) {
                return;
            }
            if (snakeScirpt_1.length < this.length) {
                this.addLength(snakeScirpt_1.length + 1);
                //当前帧销毁会报错
                Laya.timer.frameOnce(1, this, function () {
                    snakeScirpt_1.destroyed = true;
                    if (snake_1) {
                        snake_1.destroy();
                    }
                });
            }
        }
        else if (other.owner.name.match("snake")) {
            var snakeScirpt_2 = other.owner.getComponentByType(newSnake);
            if (this.snakeHead && snakeScirpt_2.length > this.length) {
                //this.snakeHead.destroy()
                this.destroyed = true;
                //当前帧destroy会报错
                snakeScirpt_2.addLength(this.length + 1);
                Laya.timer.frameOnce(1, this, function () {
                    this.snakeHead.destroy();
                });
            }
            else {
                this.addLength(snakeScirpt_2.length + 1);
                Laya.timer.frameOnce(1, this, function () {
                    //other.owner.destroy()
                    snakeScirpt_2.destroyed = true;
                    if (other && other.owner) {
                        other.owner.destroy();
                    }
                });
            }
        }
    };
    /**
     * 蛇的移动方法
     */
    newSnake.prototype.turn = function (direction) {
        direction = direction || this.nowDirection;
        this.snakeHead.transform.translate(direction);
        for (var index = 1; index < this.tiles.length; index++) {
            var element = this.tiles[index];
            element.transform.translate(this.tilesDirection[index]);
        }
        this.tilesDirection[0] = direction;
        for (var index = this.tiles.length - 1; index >= 1; index--) {
            var element = this.tiles[index];
            this.tilesDirection[index] = this.tilesDirection[index - 1];
        }
        if (userInfo['userId'] == this.snakeId) {
            var camera = this.snakeHead.parent.getChildByName("Main Camera");
            camera.transform.translate(this.nowDirection, false);
        }
    };
    //帧同步管理方法
    newSnake.prototype.onStateRun = function (runData) {
        console.log("onRun>>>" + runData);
        if (runData == 'up') {
            this.nowDirection = new Laya.Vector3(0, 0, this.speed);
        }
        else if (runData == 'down') {
            this.nowDirection = new Laya.Vector3(0, 0, -this.speed);
        }
        else if (runData == 'left') {
            this.nowDirection = new Laya.Vector3(this.speed, 0, 0);
        }
        else if (runData == 'right') {
            this.nowDirection = new Laya.Vector3(-this.speed, 0, 0);
        }
        Laya.timer.loop(this.interTime, this, this.turn);
    };
    //帧同步管理方法
    newSnake.prototype.onStatePause = function () {
        Laya.timer.clear(this, this.turn);
    };
    //帧同步管理方法
    newSnake.prototype.onStateResume = function () {
        Laya.timer.loop(this.interTime, this, this.turn);
    };
    //帧同步管理方法
    newSnake.prototype.onStateAcc = function (data) {
        for (var index = 0; index < data.length; index++) {
            var frameData = data[index];
            console.log("frameData>>>>>" + frameData);
            if (frameData != "sync") {
                this.onStateRun(frameData);
            }
            else {
                console.log("snake turn >>>>>>>>>>>>");
                this.turn(this.nowDirection);
                var camera = this.snakeHead.parent.getChildByName("Main Camera");
                camera.transform.translate(this.nowDirection, false);
            }
        }
        this.onStatePause();
    };
    return newSnake;
}(Laya.Script));
//# sourceMappingURL=newSnake.js.map