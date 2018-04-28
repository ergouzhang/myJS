//此脚本为物体的一个组件
class colliderTs extends Laya.Script{
    //脚本的所属物体
    public cube: Laya.MeshSprite3D;

    constructor(){
        super();
    }
    //生命周期方法
     public _load(owner: Laya.ComponentNode): void {
        //获取被绑定对象
        this.cube = this.owner as Laya.MeshSprite3D;
    }
    //碰撞回调方法
    public onTriggerExit(other: Laya.Collider): void {
        super.onTriggerExit(other);
        console.log('onTriigerEnter>>>>')
        //获取与当前物体碰撞的蛇
        var sp  = other.owner as Laya.MeshSprite3D;

        //获取蛇的脚本
        let comp = sp.getComponentByType(newSnake) as newSnake

        //蛇的长度加1
        comp.addLength(1)

        //销毁自己
        this.owner.destroy()
        
        // sp.event("eat",[5]) 
        //Laya.timer.frameOnce(1, this,function(){ this.owner.destroy() });
    }

}
