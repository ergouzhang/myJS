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
        _this.length = 0;
        _this.tiles = [];
        _this.tilesDirection = [];
        return _this;
    }
    newSnake.prototype._load = function (owner) {
        //获取被绑定对象
        this.snakeHead = this.owner;
        this.tiles[0] = this.snakeHead;
        this.tilesDirection[0] = this.nowDirection;
        //    this.snakeHead.on("eat",this,this.addLength)
    };
    newSnake.prototype.addLength = function (lengthToAdd) {
        console.log('add Length>>>' + lengthToAdd);
        for (var index = 0; index < lengthToAdd; index++) {
            this.length += 1;
            var tile = this.snakeHead.clone();
            tile.transform.localScale = new Laya.Vector3(1, 1, 1);
            tile.name = "body_" + this.snakeId;
            tile.removeComponentByType(newSnake);
            this.tiles[this.length] = tile;
            this.tilesDirection[this.length] = this.tilesDirection[this.length - 1];
            this.snakeHead.addChild(tile);
            //this.snakeHead.parent.addChild(tile)
            var preTile = this.tiles[this.length - 1];
            // tile.transform.position = this.tiles[this.length - 1].transform.position.clone()
            var newDirection = new Laya.Vector3(-this.tilesDirection[this.length].x, -this.tilesDirection[this.length].y, -this.tilesDirection[this.length].z);
            tile.transform.translate(newDirection);
            var material = tile.meshRender.material;
            material.albedo = new Laya.Vector4(1, 0, 1, 1);
        }
    };
    //public onTriggerEnter(other: Laya.Collider): void {
    // if(! other || ! other.owner || this.destroyed || (other.owner.getComponentByType(newSnake)&& other.owner.getComponentByType(newSnake).destroyed )){return }
    // if (other.owner.name.match("box")) {
    //     other.owner.destroy()
    //     this.addLength(1);
    // }else if (other.owner.name.match("body")){
    //     let snakeId = other.owner.name.charAt(5)
    //     let snake = other.owner.parent.getChildByName("snake_"+snakeId) as Laya.MeshSprite3D
    //     let snakeScirpt = snake.getComponentByType(newSnake) as newSnake
    //     if (snakeScirpt.destroyed) {
    //         return 
    //     }
    //     if (snakeScirpt.length < this.length) {
    //             this.addLength(snakeScirpt.length+1)
    //             Laya.timer.frameOnce(1,this,function () {
    //             snakeScirpt.destroyed = true
    //             if(snake ){snake.destroy()}
    //         })
    //     }
    // }
    // else if (other.owner.name.match("snake")){
    //     let snakeScirpt = other.owner.getComponentByType(newSnake) as newSnake
    //     if (this.snakeHead && snakeScirpt.length > this.length) {
    //         //this.snakeHead.destroy()
    //         this.destroyed = true
    //         //当前帧destroy会报错
    //         snakeScirpt.addLength(this.length+1)
    //         Laya.timer.frameOnce(1, this,function(){  
    //             this.snakeHead.destroy() 
    //         });
    //     }else {
    //         this.addLength(snakeScirpt.length+1)
    //         Laya.timer.frameOnce(1,this,function () {
    //             //other.owner.destroy()
    //             snakeScirpt.destroyed = true
    //             if(other && other.owner){other.owner.destroy()}
    //         })
    //     }
    // }
    // }
    /**
     * turn
     */
    newSnake.prototype.turn = function (direction) {
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
    };
    return newSnake;
}(Laya.Script));
//# sourceMappingURL=newSnake.js.map