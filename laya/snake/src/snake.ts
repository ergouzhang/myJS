 class snakeClass  {
    public length = 0;
    public sp3d:Laya.MeshSprite3D;
    public tiles = [];
    public tilesDirection = [];
    public blockSize = 10 
    public nowDirection = new Laya.Vector3(-this.blockSize,0,0) ;
    public snakeId = "123"

    constructor(i){
        this.sp3d = Laya.loader.getRes("../models/LayaScene_snakeScene/snakeScene"+i+".lh").getChildAt(0) as Laya.MeshSprite3D;
       this.tiles[0] = this.sp3d
       this.tilesDirection[0] = this.nowDirection
       this.sp3d.on("eat",this,this.addLength)
    }
    /**
     * addLength
     */
    public addLength(lengthToAdd:number) {
        console.log('add Length>>>'+lengthToAdd)
        for (let index = 0; index < lengthToAdd; index++) {
            this.length += 1
            let tile = this.sp3d.clone()
            this.tiles[this.length] = tile
            this.tilesDirection[this.length] = this.tilesDirection[this.length-1]
            this.sp3d.parent.addChild(tile)
            let preTile = this.tiles[this.length - 1]
            tile.transform.position = this.tiles[this.length - 1].transform.position.clone()

            let newDirection = new Laya.Vector3(-this.tilesDirection[this.length].x,-this.tilesDirection[this.length].y,-this.tilesDirection[this.length].z)
            tile.transform.translate(newDirection)
            let material = tile.meshRender.material as Laya.StandardMaterial
            material.albedo = new Laya.Vector4(1,0,1,1)
        }
        
    }

    /**
     * turn
     */
    public turn(direction:Laya.Vector3) {
        this.sp3d.transform.translate(direction);
        for (let index = 1; index < this.tiles.length; index++) {
            let element = this.tiles[index];
             element.transform.translate(this.tilesDirection[index])
        }
         this.tilesDirection[0] = direction
        for (let index =  this.tiles.length -1; index >=1 ; index -- ) {
             let element = this.tiles[index];
             this.tilesDirection[index] = this.tilesDirection[index - 1]
            
        }
        
    }
}

