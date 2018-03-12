class colliderTs extends Laya.Script{
    public cube: Laya.MeshSprite3D;

    constructor(){
        super();
    }
     public _load(owner: Laya.ComponentNode): void {
        //获取被绑定对象
        this.cube = this.owner as Laya.MeshSprite3D;
    }
    public onTriggerExit(other: Laya.Collider): void {
        super.onTriggerExit(other);
        console.log('onTriigerEnter>>>>')
        var sp  = other.owner as Laya.MeshSprite3D;
        let comp = sp.getComponentByType(newSnake) as newSnake
        comp.addLength(1)
        this.owner.destroy()
        // sp.event("eat",[5]) 
        //Laya.timer.frameOnce(1, this,function(){ this.owner.destroy() });
    }

}
