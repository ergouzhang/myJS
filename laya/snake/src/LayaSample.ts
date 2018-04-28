
// 程序入口
class GameMain{
    //此类的成员变量
    private camera :Laya.Camera
    private snake
    private snake2
    private net :netWork

    //此类的构造方法
    constructor()
    {
        Laya3D.init(0,0,true);//3d引擎的初始化
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;//屏幕适配策略
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;//屏幕适配策略
        Laya.Stat.show();//debug信息
        
        //3d场景/模型的异步加载
        //ls为unity导出的场景，lh为unity导出 的模型。
        //unity插件在ide的`工具/3d转换工具里下载，下载完成后在unity倒入插件，具体参见https://ldc.layabox.com/doc/?nav=zh-ts-4-0-1
        Laya.loader.create(["../LayaScene_snakeScene/snakeScene.ls","../models/LayaScene_snakeScene/snakeScene1.lh","../models/LayaScene_snakeScene/snakeScene2.lh"],Laya.Handler.create(this,this.onCreateComplete));
    }

    //加载完成后，初始化网络连接
    public onCreateComplete(){
        this.net = netWork.getInstance()
        this.net.init(handler(this,this.afterConnect));
    }

    //socket链接后
    public afterConnect(){
        var params = {player:{},level:1}
        pomelo.request('match.matchHandler.match', params, function (res) {
            if (res.errno != 0) {
                return
            }
            console.log("matching  ==>>")
        })

        //创建scene
        var scene = Laya.loader.getRes("../LayaScene_snakeScene/snakeScene.ls");
        //添加scene到stage
        //laya3D里的其他物体的根结点是scene，但是scene需要添加到stage里
        //切换scene只需要把scene从stage移除，再添加其他scene即可
        Laya.stage.addChild(scene)

        //在unity场景中取出camera，可以通过LayaScene_snakeScne/snakeScene.ls查看这个场景的结构
        this.camera = scene.getChildByName("Main Camera") as Laya.Camera;

        //食物1
        var box = scene.getChildByName("Cubie") as Laya.MeshSprite3D;
        //没让它生效
        box.active = false

        //食物2
        var box1 = scene.getChildByName("Cubie1") as Laya.MeshSprite3D;
        box1.name = "box_1"
        // box1.active =false

        var box2 = scene.getChildByName("Cubie2") as Laya.MeshSprite3D;
        box2.name = "box_2"
        // box2.active = false
        
        //创建蛇头
        this.snake = Laya.loader.getRes("../models/LayaScene_snakeScene/snakeScene1.lh").getChildAt(0) as Laya.MeshSprite3D;
        this.snake.name = "snake_1"

        //为蛇头添加脚本，具体查看newsnake
        this.snake.addComponent(newSnake)

        //由于scene的模型文件没有蛇，所以需要添加
        scene.addChild(this.snake)
        
        this.snake.getComponentByType(newSnake).snakeId = 1
        this.snake.getComponentByType(newSnake).addLength(5);

        //🐍2克隆蛇1
        //同一个unity模型，只要加载过，就会被实例化成一个对象，无法再次使用，只能使用clone()、instantiate()等方法克隆
        this.snake2 = Laya.MeshSprite3D.instantiate(this.snake, scene, false, new Laya.Vector3(-60, 0, 0));
        this.snake2.addComponent(newSnake)
        this.snake2.name = "snake_2"
        //更改2号蛇的颜色
        let mt2 = this.snake2.meshRender.material as Laya.StandardMaterial
         mt2.albedo = new Laya.Vector4(1,0,0,1)

         this.snake2.getComponentByType(newSnake).snakeId = 2

        
        //开始帧同步
        let syncManager = frameSync.getInstance()
        syncManager.registerTarget(this.snake,userInfo['userId'])
        syncManager.registerTarget(this.snake2,"1")
        syncManager.startSync(2);

        //监听键盘输入
        Laya.stage.on("keyup", this, this.onKeyUp);

    }
              //添加键盘抬起事件
        public  onKeyUp (event){
                switch (event.keyCode) {
                    case 87: //w
                    console.log('keyCode>>>>>'+event.keyCode)
                        this.sendMsg("up")
                        break;
                    case 83 : 
                         this.sendMsg("down")
                        break;
                    case 65: //a
                             this.sendMsg("left")
                        break;
                    case 68: //d
                         this.sendMsg("right")
                        break;
                    default:
                        break;
                }
        }
        
        public sendMsg(dataToSend:string){
            this.net.sendMsg({ route:'table.tableHandler.playerMove',actionName:'syncFrame',data:dataToSend})
        }

}


new GameMain();