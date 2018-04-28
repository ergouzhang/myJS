class newSnake extends Laya.Script{
    public snakeHead: Laya.MeshSprite3D;
    public length = 0;
    public tiles = [];
    public tilesDirection = [];
    public nowDirection = new Laya.Vector3(-5,0,0) ;
    public destroyed = false
    public snakeId  = 0 ;
    public speed = 5;
    public interTime = 100;

    constructor(){
        super();
        this.length = 0 ;
       this.tiles = []
       this.tilesDirection = []

    }
     public _load(owner: Laya.ComponentNode): void {
        //获取脚本绑定的对象
        this.snakeHead = this.owner as Laya.MeshSprite3D;
        this.tiles[0] = this.snakeHead
        this.tilesDirection[0] = this.nowDirection
    //    this .snakeHead.on("eat",this,this.addLength)
    }   
    //蛇身增加长度
    //TIPS:目前的蛇的身体都是直接加在了scene上
     public addLength(lengthToAdd:number) {
        console.log('add Length>>>'+lengthToAdd)
        for (let index = 0; index < lengthToAdd; index++) {
            this.length += 1
            let tile = this.snakeHead.clone()
            tile.name = "body_"+this.snakeId
            tile.removeComponentByType(newSnake)
            this.tiles[this.length] = tile
            this.tilesDirection[this.length] = this.tilesDirection[this.length-1]
            this.snakeHead.parent.addChild(tile)
            let preTile = this.tiles[this.length - 1]
            tile.transform.position = this.tiles[this.length - 1].transform.position.clone()

            let newDirection = new Laya.Vector3(-this.tilesDirection[this.length].x,-this.tilesDirection[this.length].y,-this.tilesDirection[this.length].z)
            tile.transform.translate(newDirection)
            let material = tile.meshRender.material as Laya.StandardMaterial
            material.albedo = new Laya.Vector4(1,0,1,1)
        }
        
    }

    //onTriggerEnter貌似有bug，会被同一物体触发2次
     public onTriggerEnter(other: Laya.Collider): void {
        if(! other || ! other.owner || this.destroyed || (other.owner.getComponentByType(newSnake)&& other.owner.getComponentByType(newSnake).destroyed )){return }
        if (other.owner.name.match("box")) {
            other.owner.destroy()
            this.addLength(1);
        }else if (other.owner.name.match("body")){
            let snakeId = other.owner.name.charAt(5)
            let snake = other.owner.parent.getChildByName("snake_"+snakeId) as Laya.MeshSprite3D
            let snakeScirpt = snake.getComponentByType(newSnake) as newSnake
            if (snakeScirpt.destroyed) {
                return 
            }
            if (snakeScirpt.length < this.length) {
                    this.addLength(snakeScirpt.length+1)
                    //当前帧销毁会报错
                    Laya.timer.frameOnce(1,this,function () {
                        snakeScirpt.destroyed = true
                    if(snake ){snake.destroy()}
                        
                })
            }

        }
        else if (other.owner.name.match("snake")){
            let snakeScirpt = other.owner.getComponentByType(newSnake) as newSnake
            if (this.snakeHead && snakeScirpt.length > this.length) {
                //this.snakeHead.destroy()
                this.destroyed = true
                //当前帧destroy会报错
                snakeScirpt.addLength(this.length+1)
                Laya.timer.frameOnce(1, this,function(){  
                    this.snakeHead.destroy() 
                });
               
            }else {
                this.addLength(snakeScirpt.length+1)
                Laya.timer.frameOnce(1,this,function () {
                    //other.owner.destroy()
                    snakeScirpt.destroyed = true
                    if(other && other.owner){other.owner.destroy()}
                        
                })
                
            }
            
        }
    }

    /**
     * 蛇的移动方法
     */
    public turn(direction:Laya.Vector3) {
        direction = direction || this.nowDirection
        this.snakeHead.transform.translate(direction);
        for (let index = 1; index < this.tiles.length; index++) {
            let element = this.tiles[index];
             element.transform.translate(this.tilesDirection[index])
        }
         this.tilesDirection[0] = direction
        for (let index =  this.tiles.length -1; index >=1 ; index -- ) {
             let element = this.tiles[index];
             this.tilesDirection[index] = this.tilesDirection[index - 1]
            
        }
        if ( userInfo['userId'] == this.snakeId ) {
            var camera = this.snakeHead.parent.getChildByName("Main Camera") as Laya.Camera;
            camera.transform.translate(this.nowDirection,false);
        }
        
    }

    //帧同步管理方法
    public onStateRun(runData){
          console.log("onRun>>>" +runData)
        if (runData == 'up') {
            this.nowDirection = new Laya.Vector3(0,0,this.speed)
        }else if (runData == 'down'){
            this.nowDirection = new Laya.Vector3(0,0,-this.speed)
        }else if (runData == 'left'){
            this.nowDirection = new Laya.Vector3(this.speed,0,0)
        }else if(runData == 'right'){
            this.nowDirection = new Laya.Vector3(-this.speed,0,0)
        }
        Laya.timer.loop(this.interTime,this,this.turn)
    }
    //帧同步管理方法
      public onStatePause () {
            Laya.timer.clear(this,this.turn)
        }
    //帧同步管理方法
    public onStateResume(){
            Laya.timer.loop(this.interTime,this,this.turn)
    }
    //帧同步管理方法
    public onStateAcc(data){
        for (var index = 0; index < data.length; index++) {
            var frameData = data[index];
            console.log("frameData>>>>>"+frameData)
            if(frameData != "sync"){
                this.onStateRun(frameData)
            }else {
                console.log("snake turn >>>>>>>>>>>>")
                this.turn(this.nowDirection)
                var camera = this.snakeHead.parent.getChildByName("Main Camera") as Laya.Camera;
                camera.transform.translate(this.nowDirection,false);
            }
        }
        this.onStatePause()
    }

}
