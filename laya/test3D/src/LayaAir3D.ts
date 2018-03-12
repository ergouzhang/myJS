        /// <reference path = "snake.ts"/>
        ///<reference path = "utils/netWork.ts"/>

        //初始化引擎
        Laya3D.init(0, 0, true);

        console.log(">>>>>>>>"+configs.world.testa)

        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //开启统计信息
        Laya.Stat.show();
        
        window["syncData"] = []
        let net = new netWork(null)
        let frame = new frameSync()
        frame.registerFunc(this)
        frame.start()
        var speed = 2
        var direction = new Laya.Vector3(0,0,0)


        Laya.loader.create("../LayaScene_snakeScene/snakeScene.ls",Laya.Handler.create(this,this.completeHandler),null,Laya.Scene);
           
        function completeHandler(){
            Laya.loader.create(["../models/LayaScene_snakeScene/snakeScene1.lh","../models/LayaScene_snakeScene/snakeScene2.lh"],Laya.Handler.create(this,this.onCreateComplete)); 
        }          
        function onCreateComplete(){
            var scene = Laya.loader.getRes("../LayaScene_snakeScene/snakeScene.ls");
            Laya.stage.addChild(scene)
            this.camera = scene.getChildByName("Main Camera") as Laya.Camera;
            var box = scene.getChildByName("Cubie") as Laya.MeshSprite3D;
            box.active = false
            var box1 = scene.getChildByName("Cubie1") as Laya.MeshSprite3D;
            box1.addComponent(colliderTs)

            var box2 = scene.getChildByName("Cubie2") as Laya.MeshSprite3D;
            box2.addComponent(colliderTs)

            

            this.snake = new snakeClass(1)
            scene.addChild(this.snake.sp3d)
            this.snake.addLength(1);

            this.snake2 = new snakeClass(2)
            scene.addChild(this.snake2.sp3d)
            this.snake2.sp3d.transform.translate(new Laya.Vector3(0,0,20))
            this.snake2.addLength(5);

           
            // Laya.timer.loop(20,this,this.loop)
         Laya.stage.on("keyup", this, this.onKeyUp);
        }
                //添加键盘抬起事件
        function  onKeyUp (event){
                switch (event.keyCode) {
                    case 87: //w
                    console.log('keyCode>>>>>'+event.keyCode)
                        //direction = new Laya.Vector3(0,0,speed) 
                        this.sendMsg("up")

                        break;
                    case 83 : //s
                        // var revers = new Laya.Vector3()
                        // let newDirection = new Laya.Vector3(0,0,-speed)
                        // Laya.Vector3.scale(newDirection,-1,revers)
                        // console.log(revers)
                        // if( Laya.Vector3.equals(revers, snake.tilesDirection[0])    )
                        // {
                            
                        // }else{
                            //direction = new Laya.Vector3(0,0,-speed)
                        // }
                         this.sendMsg("down")
                        break;
                    case 65: //a
                            //direction = new Laya.Vector3(speed,0,0)
                             this.sendMsg("left")
                        break;
                    case 68: //d
                        //direction = new Laya.Vector3(-speed,0,0)
                         this.sendMsg("right")
                        break;
                    default:
                        break;
                }
        }
        
        function loop():void {
            this.snake.turn(direction);
            this.camera.transform.translate(direction,false);
        }

        function sendMsg(data:string){
            let syncData = {}
            syncData["route"] = 'core.coreHandler.gameAction'
            syncData["actionName"] = 'syncFrame'
            syncData["data"] = data
            net.sendMsg(syncData)
        }

        function onRun(data:string):void{
            console.log("onRun>>>" +data)
            if (data == 'up') {
                direction = new Laya.Vector3(0,0,speed)
            }else if (data == 'down'){
                direction = new Laya.Vector3(0,0,-speed)
            }else if (data == 'left'){
                direction = new Laya.Vector3(speed,0,0)
            }else if(data == 'right'){
                direction = new Laya.Vector3(-speed,0,0)
            }
        }
        function onPause () {
            Laya.timer.clear(this,this.loop)
        }
        function onResume(){
             Laya.timer.loop(20,this,this.loop)
        }
        function onAcc(data){
            for (var index = 0; index < data.length; index++) {
                var frameData = data[index];
                console.log("frameData>>>>>"+frameData)
                if(frameData != "sync"){
                    this.onRun(frameData)
                }else {
                    console.log("snake turn >>>>>>>>>>>>")
                    this.snake.turn(direction)
                    this.camera.transform.translate(direction,false);
                }
            }
            this.onPause()
        }


       



