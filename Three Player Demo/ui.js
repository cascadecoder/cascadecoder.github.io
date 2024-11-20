// User interface for pre-match

var interface = [];
var connectors = [];
var map = 1;
var gameRunning = false;

function handleConnectors() {
    for (let i = 0; i < connectors.length; i++) {
        let connector = connectors[0];
        switch (connector) {
            case "map1":map=1;break;
            case "map2":map=2;break;
            case "map3":map=3;break;
            case "start":gameRunning=true;setupGame();break;
        }
        connectors.splice(0,1);
    }
}

function renderUI() {
    for (let i = 0; i < interface.length; i++) {
        interface[i].renderer();
    }
}

function newUI(x,y,w,h,c,ty,con,te) {
    var uinew = new UIButton(x,y,w,h,c,ty,con,te);
    interface.push(uinew);
}

class UIButton {
    constructor(x,y,w,h,c,id,connector,text) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;
        this.id = id;
        this.connector=connector;
        this.text = text;
    }
    renderer() {
        if (this.id.includes("STARTUI") && gameRunning) {return}

        ctx.globalAlpha = 0.7;
        let touch=false;
        if (pointInRange(mouseX,mouseY,this.x,this.y,this.w,this.h)) {
            ctx.globalAlpha = 1;
            touch=true;
        }
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.fillStyle = "black";
        ctx.font = "15pt Verdana"
        let metric = ctx.measureText(this.text);
        ctx.fillText(this.text,this.x+(this.w-metric.width)/2,this.y+(this.h+metric.fontBoundingBoxAscent/2)/2)
        if (touch && leftInput) {
            connectors.push(this.connector)
        }
        
    }
}

newUI(50,50,150,100,"orange","STARTUI_START","start","Start Game")
newUI(300,50,150,100,"lightblue","STARTUI_MAP1","map1","Map 1")
newUI(550,50,150,100,"pink","STARTUI_MAP2","map2","Map 2")
newUI(800,50,150,100,"lightgreen","STARTUI_MAP3","map3","Map 3")
