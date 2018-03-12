//创建舞台，默认背景色是黑色的
Laya.init(600, 300); 
var txt = new Laya.Text(); 
//设置文本内容
txt.text = "Hello Layabox";  
//设置文本颜色为白色，默认颜色为黑色
txt.color = "#ffffff";  

txt.fontSize = 66;

txt.stroke = 5;
txt.strokeColor = "#ffffff";
txt.bold = true;
txt.pos(60,100);
Laya.stage.bgColor = "#23238e";

var img:Laya.Sprite = new Laya.Sprite();
img.loadImage("../res/grass.png",100,50)
Laya.stage.addChild(img);

this.img.on(Laya.Event.CLICK,this,function(){
    this.img.graphics.clear();
    
})

//将文本内容添加到舞台 
Laya.stage.addChild(txt);