var snakeClass = /** @class */ (function () {
    function snakeClass() {
        this.length = 0;
        this.tiles = [];
        this.tilesDirection = [];
        this.nowDirection = new Laya.Vector3(-speed, 0, 0);
        this.snakeId = "123";
        this.sp3d = Laya.loader.getRes("../models/LayaScene_snakeScene/snakeScene.lh").getChildAt(0);
        this.tiles[0] = this.sp3d;
        this.tilesDirection[0] = this.nowDirection;
        this.sp3d.on("eat", this, this.addLength);
    }
    /**
     * addLength
     */
    snakeClass.prototype.addLength = function (lengthToAdd) {
        console.log('add Length>>>' + lengthToAdd);
        for (var index = 0; index < lengthToAdd; index++) {
            this.length += 1;
            var tile = this.sp3d.clone();
            this.tiles[this.length] = tile;
            this.tilesDirection[this.length] = this.tilesDirection[this.length - 1];
            this.sp3d.parent.addChild(tile);
            var preTile = this.tiles[this.length - 1];
            tile.transform.position = this.tiles[this.length - 1].transform.position.clone();
            var newDirection = new Laya.Vector3(-this.tilesDirection[this.length].x, -this.tilesDirection[this.length].y, -this.tilesDirection[this.length].z);
            tile.transform.translate(newDirection);
            var material = tile.meshRender.material;
            material.albedo = new Laya.Vector4(1, 0, 1, 1);
        }
    };
    /**
     * move
     */
    snakeClass.prototype.move = function (direction) {
        if (!Laya.Vector3.equals(this.nowDirection, direction)) {
            this.turn(direction);
        }
        else {
            for (var index = 0; index < this.tiles.length; index++) {
                var element = this.tiles[index];
                element.transform.translate(direction);
            }
        }
    };
    /**
     * turn
     */
    snakeClass.prototype.turn = function (direction) {
        this.sp3d.transform.translate(direction);
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
    return snakeClass;
}());
//# sourceMappingURL=snake.js.map