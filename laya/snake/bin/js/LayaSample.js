// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        this.speed = 5;
        this.direction = new Laya.Vector3(0, 0, 0);
        Laya3D.init(0, 0, true);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        Laya.loader.create(["../LayaScene_snakeScene/snakeScene.ls", "../models/LayaScene_snakeScene/snakeScene1.lh", "../models/LayaScene_snakeScene/snakeScene2.lh"], Laya.Handler.create(this, this.onCreateComplete));
    }
    GameMain.prototype.onCreateComplete = function () {
        this.net = netWork.getInstance();
        this.net.init(handler(this, this.afterConnect));
    };
    GameMain.prototype.afterConnect = function () {
        var scene = Laya.loader.getRes("../LayaScene_snakeScene/snakeScene.ls");
        Laya.stage.addChild(scene);
        var syncManager = frameSync.getInstance();
        syncManager.registerTarget(this);
        syncManager.startSync();
        this.camera = scene.getChildByName("Main Camera");
        var box = scene.getChildByName("Cubie");
        box.active = false;
        var box1 = scene.getChildByName("Cubie1");
        // box1.addComponent(colliderTs)
        box1.name = "box_1";
        // box1.active =false
        var box2 = scene.getChildByName("Cubie2");
        // box2.addComponent(colliderTs)
        box2.name = "box_2";
        // box2.active = false
        this.snake = Laya.loader.getRes("../models/LayaScene_snakeScene/snakeScene1.lh").getChildAt(0);
        this.snake.name = "snake_1";
        this.snake.addComponent(newSnake);
        scene.addChild(this.snake);
        this.snake.getComponentByType(newSnake).snakeId = 1;
        this.snake.getComponentByType(newSnake).addLength(5);
        this.snake2 = Laya.MeshSprite3D.instantiate(this.snake, scene, false, new Laya.Vector3(-60, 0, 0));
        this.snake2.addComponent(newSnake);
        this.snake2.name = "snake_2";
        var mt2 = this.snake2.meshRender.material;
        mt2.albedo = new Laya.Vector4(1, 0, 0, 1);
        //scene.addChild(this.snake2);
        this.snake2.getComponentByType(newSnake).snakeId = 2;
        //this.snake2.getComponentByType(newSnake).addLength(0);
        //this.snake2.transform.translate(new Laya.Vector3(60,0,0))
        Laya.stage.on("keyup", this, this.onKeyUp);
    };
    //添加键盘抬起事件
    GameMain.prototype.onKeyUp = function (event) {
        switch (event.keyCode) {
            case 87://w
                console.log('keyCode>>>>>' + event.keyCode);
                this.sendMsg("up");
                break;
            case 83:
                this.sendMsg("down");
                break;
            case 65://a
                this.sendMsg("left");
                break;
            case 68://d
                this.sendMsg("right");
                break;
            default:
                break;
        }
    };
    GameMain.prototype.loop = function () {
        this.snake.getComponentByType(newSnake).turn(this.direction);
        this.camera.transform.translate(this.direction, false);
    };
    GameMain.prototype.onRun = function (data) {
        console.log("onRun>>>" + data);
        if (data == 'up') {
            this.direction = new Laya.Vector3(0, 0, this.speed);
        }
        else if (data == 'down') {
            this.direction = new Laya.Vector3(0, 0, -this.speed);
        }
        else if (data == 'left') {
            this.direction = new Laya.Vector3(this.speed, 0, 0);
        }
        else if (data == 'right') {
            this.direction = new Laya.Vector3(-this.speed, 0, 0);
        }
    };
    GameMain.prototype.onPause = function () {
        Laya.timer.clear(this, this.loop);
    };
    GameMain.prototype.onResume = function () {
        Laya.timer.loop(20, this, this.loop);
    };
    GameMain.prototype.onAcc = function (data) {
        for (var index = 0; index < data.length; index++) {
            var frameData = data[index];
            console.log("frameData>>>>>" + frameData);
            if (frameData != "sync") {
                this.onRun(frameData);
            }
            else {
                console.log("snake turn >>>>>>>>>>>>");
                this.snake.getComponentByType(newSnake).turn(this.direction);
                this.camera.transform.translate(this.direction, false);
            }
        }
        this.onPause();
    };
    GameMain.prototype.sendMsg = function (dataToSend) {
        this.net.sendMsg({ route: 'core.coreHandler.gameAction', actionName: 'syncFrame', data: dataToSend });
    };
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map