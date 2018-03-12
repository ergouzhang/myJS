class colliderTs extends Laya.Script{
    public cube: Laya.MeshSprite3D;

    constructor(){
        super();
    }
     public _load(owner: Laya.ComponentNode): void {
        //获取被绑定对象
        this.cube = this.owner as Laya.MeshSprite3D;
    }
    public onTriggerEnter(other: Laya.Collider): void {
        super.onTriggerEnter(other);
        console.log('onTriigerEnter>>>>')
        var sp  = other.owner as Laya.MeshSprite3D;
        
        sp.event("eat",[5]) 
        Laya.timer.frameOnce(1, this,function(){ this.owner.destroy() });
    }

}
