class newSnake extends Laya.MeshSprite3D {
    public length = 0;
    public sp3d:Laya.MeshSprite3D;
    public tiles = [];
    public tilesDirection = [];
    public nowDirection = new Laya.Vector3(-speed,0,0) ;
    constructor(mesh) {
        super(mesh)
    }
}