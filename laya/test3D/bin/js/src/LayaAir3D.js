// 程序入口
var LayaAir3D = /** @class */ (function () {
    function LayaAir3D() {
        //初始化引擎
        Laya3D.init(0, 0, true);
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //开启统计信息
        Laya.Stat.show();
        //添加3D场景
        var scene = Laya.stage.addChild(new Laya.Scene());
        //添加照相机
        var camera = (scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.translate(new Laya.Vector3(0, 500, 0));
        camera.transform.rotate(new Laya.Vector3(-75, 0, 0), true, false);
        camera.clearColor = null;
        //添加方向光
        var directionLight = scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.direction = new Laya.Vector3(1, -1, 0);
        //添加自定义模型
        var box = scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(10, 10, 10)));
        box.transform.position.y = 10;
        var material = new Laya.StandardMaterial();
        material.diffuseTexture = Laya.Texture2D.load("res/carvedlimestoneground1_Base_Color.png");
        material.normalTexture = Laya.Texture2D.load("res/carvedlimestoneground1_Normal.png");
        box.meshRender.material = material;
        //添加盒型碰撞器
        var boxCollider = box.addComponent(Laya.BoxCollider);
        boxCollider.setFromBoundBox(box.meshFilter.sharedMesh.boundingBox);
        //添加刚体组件
        box.addComponent(Laya.Rigidbody);
        var direction = new Laya.Vector3(1, 0, 0);
        //box
        var box1 = Laya.Sprite3D.instantiate(box, scene, false, new Laya.Vector3(50, 10, 0));
        //添加盒型碰撞器
        var boxCollider1 = box1.addComponent(Laya.BoxCollider);
        boxCollider1.setFromBoundBox(box1.meshFilter.sharedMesh.boundingBox);
        box1.addComponent(boxCollider);
        //添加刚体组件
        box1.addComponent(Laya.Rigidbody);
        var ground = scene.addChild(new Laya.MeshSprite3D(new Laya.PlaneMesh(1000, 1000)));
        var groundMaterial = new Laya.StandardMaterial();
        groundMaterial.diffuseColor = new Laya.Vector3(1, 0.5, 1);
        ground.meshRender.material = groundMaterial;
        //键盘监听
        Laya.stage.on("keydown", null, function (event) {
            console.log('pressed>>>>>>' + event.keyCode);
            switch (event.keyCode) {
                case 65://a 
                    direction = new Laya.Vector3(-1, 0, 0);
                    break;
                case 68://d
                    direction = new Laya.Vector3(1, 0, 0);
                    break;
                case 87://w
                    direction = new Laya.Vector3(0, 0, -1);
                    break;
                case 83://s
                    direction = new Laya.Vector3(0, 0, 1);
                    break;
                default:
                    break;
            }
        });
        Laya.timer.loop(100, null, function () {
            box.transform.translate(direction);
            camera.transform.translate(direction, false);
        });
    }
    return LayaAir3D;
}());
new LayaAir3D();
//# sourceMappingURL=LayaAir3D.js.map