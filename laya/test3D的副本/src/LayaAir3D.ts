        /// <reference path = "snake.ts"/>
        ///<reference path = "utils/netWork.ts"/>

        

        //初始化引擎
        Laya3D.init(0, 0, true);

        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //开启统计信息
        Laya.Stat.show();
        
        let net = new netWork(null)

        var speed = 20

        Laya.loader.create("../LayaScene_snakeScene/snakeScene.ls",Laya.Handler.create(this,this.completeHandler),null,Laya.Scene);
           
        function completeHandler(){
            Laya.loader.create("../models/LayaScene_snakeScene/snakeScene.lh",Laya.Handler.create(this,this.onCreateComplete)); 
        }          
        function onCreateComplete(){
            var scene = Laya.loader.getRes("../LayaScene_snakeScene/snakeScene.ls");
            Laya.stage.addChild(scene)
            var camera = scene.getChildByName("Main Camera") as Laya.Camera;
            var direction = new Laya.Vector3(-speed,0,0)
            var box = scene.getChildByName("Cubie") as Laya.MeshSprite3D;
            box.active = false
            var box1 = scene.getChildByName("Cubie1") as Laya.MeshSprite3D;
            box1.addComponent(colliderTs)

            var snake = new snakeClass()
            scene.addChild(snake.sp3d)
            snake.addLength(2);

             var snake2 = new snakeClass()
            scene.addChild(snake2.sp3d)
            snake2.addLength(1);
           
            Laya.timer.loop(200,null,function(){
                snake.turn(direction);

                //snake2.turn(new Laya.Vector3(speed,0,0));

                camera.transform.translate(direction,false);
            })

                //添加键盘抬起事件
            var onKeyUp = function (event){
                switch (event.keyCode) {
                    case 87: //w
                    console.log('keyCode>>>>>'+event.keyCode)
                        direction = new Laya.Vector3(0,0,speed)
                        break;
                    case 83 : //s
                        // var revers = new Laya.Vector3()
                        // let newDirection = new Laya.Vector3(0,0,-speed)
                        // Laya.Vector3.scale(newDirection,-1,revers)
                        // console.log(revers)
                        // if( Laya.Vector3.equals(revers, snake.tilesDirection[0])    )
                        // {
                            
                        // }else{
                            direction = new Laya.Vector3(0,0,-speed)
                        // }
                        break;
                    case 65: //a
                            direction = new Laya.Vector3(speed,0,0)
                        break;
                    case 68: //d
                        direction = new Laya.Vector3(-speed,0,0)
                        break;
                    default:
                        break;
                }
            }
            Laya.stage.on("keyup", null, onKeyUp);
        }



