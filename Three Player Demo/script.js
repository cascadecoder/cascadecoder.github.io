/*

A three-player game in only
vanilla js and html. No libraries.
Just a lot of sweat and tears.

Also the entire thing is in two scripts so it's a bit messy.

Three player game
v0.5

*/
class Particle {
    constructor(x, y, t, xv, yv,life,c) {
        this.x = x;
        this.y = y;
        this.t = t;
        this.xv = xv;
        this.yv = yv;
        this.w = 10;
        this.h = 10;
        this.life = life;
        this.maxLife = life;
        this.dir = Math.random()*360
        if (c != undefined) {
            this.c = c;
        }
        if (this.t == "bounce") {
            this.w = Math.random()*(32/(Math.abs(this.yv)+1))+5;
            if (this.w > 15) {
                this.w =15;
            }
            this.yv *= 1.5;
        }
    }
    renderer(type) {
        if (this.life <= 0) {return;}

        if (this.t == "ground") {
            ctx.save();
            this.w = 8;
            this.h = 8;
            ctx.fillStyle = "rgba(200,150,50," + this.life/this.maxLife + ")";
            ctx.translate(this.x + this.w / 2, this.y - 4 + this.h / 2);
            ctx.rotate(((this.dir + this.life * 4+this.xv*4) * Math.PI) / 180)
            ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h)
            ctx.restore()
        }
        if (this.t == "player") {
            this.w = 15;
            this.h = 30;
            ctx.fillStyle = "rgba(100,100,100," + this.life/this.maxLife + ")";
            ctx.fillRect(this.x,this.y,this.w,this.h)
        }
        if (this.t == "whoosh") {
            ctx.globalAlpha = this.life/this.maxLife;
            ctx.fillStyle = this.c;
            ctx.fillRect(this.x,this.y,10,4);
            ctx.globalAlpha = 1;
        }
        if (this.t == "bounce") {
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255,255,255," + this.life/this.maxLife + ")";
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(0,0,0," + this.life/this.maxLife + ")";
            ctx.stroke();
            ctx.strokeStyle="black";
0            
        }
        ctx.globalAlpha = 1;
        this.x += this.xv;
        this.y += this.yv;
        this.xv *= 0.8;
        this.yv *= 0.8;
        this.life -= 1;
        if (this.life < 0) {
            this.life = 0;
        }
        
    }
}
class Rect {
    constructor(x, y, w, h, c, t) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;
        this.t = t; // special type for objects
        
    }
    collider(type) {
        for (let i = 0; i < objects.length; i++) {
            let curr = objects[i];
            if (curr.t.includes(type)) {
                if (rangeInRange(this.x, this.y, this.w, this.h, curr.x, curr.y, curr.w, curr.h)) {
                    if (type == "teleporter") {
                        return curr.t[10];
                    } else {
                        return true;
                    }
                    
                }
                if (pointInRange(this.x + this.w / 2, this.y + this.h / 2, curr.x, curr.y, curr.w, curr.h)) {
                    return true;
                }
            }
        }
        return false;
    }
    update(x, y) {
        this.x = x;
        this.y = y;
    }
    renderer() {
        ctx.fillStyle = this.c;
        
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        
    }
}
var colors = ["red", "blue", "green"]
class Player {
    constructor(x, y, id) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.xv = 0;
        this.yv = 0;
        this.dx = 0;
        this.dy = 0;
        this.charge = 0;
        this.grounded = false;
        this.hitbox = new Rect(x, y, 15, 30, colors[id - 1]);
        this.keyCodes = [keys[(id - 1) * 4], keys[(id - 1) * 4 + 1], keys[(id - 1) * 4 + 2], keys[(id - 1) * 4 + 3]];
        // Special identifiers for different game modes
        // Tag
        this.speedBoost = 0;
        this.ghost = false;
        this.ghostX = 0;
        this.ghostY = 0;
        this.fast = false;
        this.powerDuration = 50;
        this.tagged = false;
        this.tagDelay = 0;
        this.portalDelay = 0;
    }
    getInput() {

        if (this.id < 3) { // normal input
            /* if (inputs.includes(this.keyCodes[0])) { // Jump button
                 this.jump();
             }
             if (inputs.includes(this.keyCodes[1]) && !inputs.includes(this.keyCodes[0])) { // Right button
                 this.xv = 10;
             }
             if (inputs.includes(this.keyCodes[2]) && !inputs.includes(this.keyCodes[0])) { // Left button
                 this.xv = -10;
             }
             if (inputs.includes(this.keyCodes[3])) { // Special button
                 this.power();
             }*/
            if (this.id == 1 && (keys2.w)) { if (this.ghost) { this.yv = -10 } else { this.jump() } }
            if (this.id == 1 && (keys2.d && !keys2.a)) { this.xv = 10; }
            if (this.id == 1 && (!keys2.d && keys2.a)) { this.xv = -10; }
            if (this.id == 1 && (keys2.s)) { if (this.ghost) { this.yv = 10 } else { this.power() } }

            if (this.id == 2 && (keys2.ArrowUp)) { if (this.ghost) { this.yv = -10 } else { this.jump() } }
            if (this.id == 2 && (keys2.ArrowRight && !keys2.ArrowLeft)) { this.xv = 10; }
            if (this.id == 2 && (!keys2.ArrowRight && keys2.ArrowLeft)) { this.xv = -10; }
            if (this.id == 2 && (keys2.ArrowDown)) { if (this.ghost) { this.yv = 10 } else { this.power() } }
        } else { // Mouse input
            if (middleClick < 0) { // If scroll wheel is up
                if (this.ghost) {
                    this.yv = -10;
                } else {
                    this.jump();
                }
            }
            if (rightInput && !leftInput) {
                this.xv = 10;
            }
            if (leftInput && !rightInput) {
                this.xv = -10;
            }
            if (middleClick > 0) {
                if (this.ghost) {
                    this.yv = 10;
                } else {
                    this.power();
                }

            }
        }
        if (Math.round(this.xv) % 2 == 0 && !this.fast) {
            this.xv += this.speedBoost*this.xv/10;
        }
        this.xv *= 1 + this.tagged * 0.1 * (!this.ghost); // extra boost (tiny) for the , but not if they are ghost
        if (this.xv % 10 == 0) {
            this.xv *= 1 + this.fast * 0.5;
        }
        
    }
    power() {
        if (this.charge == 200) {
            this.charge = 0;
            this.powerDuration = 100;
            if (this.tagged) {
                this.ghost = true;
                this.ghostX = this.x;
                this.ghostY = this.y;
            } else {
                this.fast = true;
            }
            
        }
    }
    jump() {
        if (this.grounded) { // Sets a y velocity up (-y) if on ground
            this.yv = -17;
            this.grounded = false;
        }
    }
    move() {
        if (this.speedBoost > 0) { this.speedBoost -= 1; }
        if (this.charge < 200) { this.charge++; }
        if (this.portalDelay > 0) {this.portalDelay--;}
        if (this.powerDuration > 0) {this.powerDuration--; if (this.powerDuration == 0) {
            if (this.ghost) {
                this.x = this.ghostX;
                this.y = this.ghostY;
                this.xv = 0;
                this.yv = 0;
                this.ghost = false;
                tag.ghostX = null;
            }
            if (this.fast) {
                this.fast = false;
            }
        }}
        if (this.tagged && this.fast) {
            this.fast = false;
            this.powerDuration = 0;
        }
        if (!this.tagged && this.ghost) {
            this.ghost = false;
            this.x = this.ghostX;
            this.y = this.ghostY;
            this.xv = 0;
            this.yv = 0;
            this.powerDuration = 0;
            tag.ghostX = null;
        }

        if (this.tagDelay <= 0) {
            this.getInput(); // gets keyboard input
        } else {
            this.tagDelay -= 1;
        }

        if (!this.ghost) {
            // Detects x collision
            this.hitbox.update(this.x + this.xv, this.y);
            if (this.hitbox.collider("solid")) {
                let dir = (this.xv > 0) * 2 - 1;
                this.hitbox.update(this.x, this.y);
                this.dx = 0;
                while (!this.hitbox.collider("solid")) {
                    this.dx += dir;
                    this.hitbox.update(this.x + this.dx, this.y);
                }
                this.dx -= dir;
                this.xv = 0;
            } else {
                this.dx = this.xv;
            }

            // Detects y collision
            this.hitbox.update(this.x, this.y + this.yv);
            if (this.hitbox.collider("solid")) {
                let dir = (this.yv > 0) * 2 - 1;
                if (dir > 0) {
                    this.grounded = true;
                    
                } else {
                    this.grounded = false;
                }
                this.dy = 0;
                this.hitbox.update(this.x, this.y);
                while (!this.hitbox.collider("solid")) {
                    this.dy += dir;
                    this.hitbox.update(this.x, this.y + this.dy);
                }
                this.dy -= dir;
                this.yv = 0;
            } else {
                this.dy = this.yv;
                this.grounded = false;
            }
            // Last check for collision that only moving dx and dy can't detect
            this.hitbox.update(this.x + this.dx, this.y + this.dy);
            if (this.hitbox.collider("solid")) {
                let ydir = (this.dy > 0) * 2 - 1;
                let xdir = (this.dx > 0) * 2 - 1;
                this.dx = 0;
                this.dy = 0;
                this.hitbox.update(this.x, this.y);
                while (!this.hitbox.collider("solid")) {
                    this.dx += xdir;
                    this.dy += ydir;
                    this.hitbox.update(this.x + this.dx, this.y + this.dy);
                }
                if (ydir > 0) {
                    this.grounded = true;
                } else {
                    this.grounded = false;
                }
                this.dx -= xdir;
                this.dy -= ydir;
            }

            // Updates new values to hitbox
            this.x += this.dx;
            this.y += this.dy;
            this.hitbox.update(this.x, this.y)
            if (this.grounded && Math.random() < 0.6 && !this.speedBoost) {
                if (Math.round(this.xv) > 0) {
                    newParticle(this.x,this.y+this.hitbox.h,"ground",this.xv/(-10),-1,5)
                } else if (Math.round(this.xv) < 0) {
                    newParticle(this.x+this.hitbox.w,this.y+this.hitbox.h,"ground",this.xv/(-10),-1,5)
                }
            }

            if (this.speedBoost > 0 && Math.round(this.xv) != 0 && !this.fast) {
                newParticle(this.x,this.y,"player",this.xv/(5),0,8);
            }
            // Velocities change over time (due to friction/gravity)
            this.xv *= 0.5;
            this.yv += 2;
            if (this.yv > 30) {
                this.yv = 30;
            }
            // Special objects it can hit
            if (this.hitbox.collider("bounce")) {
                this.yv = -30;
                this.grounded = false;
                for (let i = 0; i < (Math.random()*4+2);i++){
                    newParticle(this.x+Math.random()*this.hitbox.w,this.y+Math.random()*this.hitbox.h,"bounce", this.xv/5,this.yv/(3*Math.random()+1),5+Math.floor(Math.random()*7) )
                }
                
                
                //this.y += this.yv;
                //this.hitbox.update(this.x,this.y)
            }

            if (this.hitbox.collider("speed")) {
                this.speedBoost = 10;
            }

            // Teleporter teleports
            var teleporterCollision = this.hitbox.collider("teleporter")
            if (teleporterCollision > 0 && this.portalDelay <= 0) {
                var teleporters = [];
                for (let i = 0; i < objects.length;i++) {
                    if (objects[i].t.includes("teleporter") && objects[i].t[10] != teleporterCollision) {
                        teleporters.push(objects[i]);
                    }
                }
                var randomTP = teleporters[Math.floor(Math.random()*teleporters.length)];
                this.x = randomTP.x;
                this.y = randomTP.y;
                this.hitbox.update(this.x,this.y);
                this.portalDelay = 100;
            }
        } else {
            this.x += this.xv;
            this.y += this.yv;
            if (this.x < 0) {this.x = 0;}
            if (this.x+this.hitbox.w > canvas.width) {this.x = canvas.width-this.hitbox.w;}
            if (this.y < 0) {this.y = 0;}
            if (this.y+this.hitbox.h > canvas.height) {this.y = canvas.height-this.hitbox.h;}
            this.hitbox.update(this.x,this.y)
            this.yv *= 0.8;
            this.xv *= 0.8;
        }

        // Renders the player
        this.hitbox.renderer();
        ctx.fillStyle = "black";
        ctx.font = "13px monospace";
        if (this.tagged) {
            ctx.fillText("IT", this.x + 1, this.y - 6);
        } else {
            ctx.fillText(this.id, this.x + 4.5, this.y - 6);
        }

        ctx.fillRect(this.x + 1, this.y - 5, 13, 4);
        
        
        ctx.fillStyle = colors[this.id - 1];
        ctx.fillRect(this.x + 1, this.y - 5, 13 * this.charge / 200, 4);
        if (this.ghost) {
            ctx.fillStyle = "rgba(0,0,0,0.5)"
            ctx.fillRect(this.x,this.y,this.hitbox.w,this.hitbox.h);
            ctx.lineWidth = "4px";
            ctx.fillStyle = "rgba(0,0,0," + (100-this.powerDuration)/100 + ")"
            ctx.fillRect(this.ghostX,this.ghostY,this.hitbox.w,this.hitbox.h);
            tag.ghostX = this.x;
            tag.ghostY = this.y;
        }
        if (this.fast) {
            newParticle(this.x+Math.random()*this.hitbox.w, this.y+Math.random()*this.hitbox.h, "whoosh", this.xv, 0, 16, colors[this.id-1])
            newParticle(this.x+Math.random()*this.hitbox.w, this.y+Math.random()*this.hitbox.h, "whoosh", this.xv, 0, 16, colors[this.id-1])
            newParticle(this.x+Math.random()*this.hitbox.w, this.y+Math.random()*this.hitbox.h, "whoosh", this.xv, 0, 16, colors[this.id-1])
        }
        if (this.tagDelay > 0) {
            ctx.fillStyle = "rgba(0,0,0," + this.tagDelay/50+")";
            ctx.fillRect(this.x-4,this.y-4,this.hitbox.w+8,this.hitbox.h+8);
        }
    }
    // After all movement, player on player detections
    playerDetect(p) {
        let phit = p.hitbox;
        if (rangeInRange(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h, phit.x, phit.y, phit.w, phit.h)) {
            return true;
        }
        return false;
    }
}

// Detects if a range is within or contacting another one
function rangeInRange(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (pointInRange(x1, y1, x2, y2, w2, h2)) {
        return true;
    }
    if (pointInRange(x1 + w1, y1, x2, y2, w2, h2)) {
        return true;
    }
    if (pointInRange(x1, y1 + h1, x2, y2, w2, h2)) {
        return true;
    }
    if (pointInRange(x1 + w1, y1 + h1, x2, y2, w2, h2)) {
        return true;
    }

    if (pointInRange(x2, y2, x1, y1, w1, h1)) {
        return true;
    }
    if (pointInRange(x2 + w2, y2, x1, y1, w1, h1)) {
        return true;
    }
    if (pointInRange(x2, y2 + h2, x1, y1, w1, h1)) {
        return true;
    }
    if (pointInRange(x2 + w2, y2 + h2, x1, y1, w1, h1)) {
        return true;
    }
    return false;
}
// Detects if a singular point is in a range
function pointInRange(px, py, rx, ry, rw, rh) {
    return (px >= rx && px <= rx + rw) && (py >= ry && py <= ry + rh);
}

// Initialize canvas to draw one
var canvas = document.getElementById("c");
canvas.width = 1300;
canvas.height = 550;
var ctx = canvas.getContext('2d');

// Create the map with rectangle objects #manual-labor #aaaa
var objects = [];

addObject(0, -50, canvas.width, 50, "rgb(200,150,50)", "solid")
addObject(0, canvas.height - 25, canvas.width, 25, "rgb(200,150,50)", "solid")
addObject(-50, 0, 50, canvas.height, "black", "solid")
addObject(canvas.width, 0, 50, canvas.height, "black", "solid")


addObject(0, 100, 150, 20, "rgb(200,150,50)", "solid")
addObject(200, 100, 150, 20, "rgb(200,150,50)", "solid")
addObject(400, 100, 150, 20, "rgb(200,150,50)", "solid")
addObject(600, 100, 150, 20, "rgb(200,150,50)", "solid")
addObject(800, 125, 150, 20, "rgb(200,150,50)", "solid")
addObject(1000, 100, 150, 20, "rgb(200,150,50)", "solid")
addObject(1200, 100, 150, 20, "rgb(200,150,50)", "solid")


addObject(25, 175, 100, 20, "rgb(200,150,50)", "solid")
addObject(225, 175, 100, 20, "rgb(200,150,50)", "solid")
addObject(425, 175, 100, 20, "rgb(200,150,50)", "solid")


addObject(100, 250, 150, 20, "rgb(200,150,50)", "solid")
addObject(300, 250, 150, 20, "rgb(200,150,50)", "solid")


addObject(25, 325, 100, 20, "rgb(200,150,50)", "solid")
addObject(425, 325, 100, 20, "rgb(200,150,50)", "solid")

addObject(100, 385, 100, 15, "rgb(200,150,50)", "solid")
addObject(350, 385, 100, 15, "rgb(200,150,50)", "solid")
addObject(650, 200, 100, 15, "rgb(200,150,50)", "solid")
addObject(850, 200, 100, 15, "rgb(200,150,50)", "solid")
addObject(500, 250, 150, 20, "rgb(200,150,50)", "solid")
addObject(750, 250, 100, 15, "rgb(200,150,50)", "solid")
addObject(950, 250, 100, 15, "rgb(200,150,50)", "solid")


addObject(25, 450, 100, 20, "rgb(200,150,50)", "solid")
addObject(425, 450, 100, 20, "rgb(200,150,50)", "solid")
addObject(775, 450, 100, 20, "rgb(200,150,50)", "solid")
addObject(1225, 450, 100, 20, "rgb(200,150,50)", "solid")
addObject(1110, 200, 100, 20, "rgb(200,150,50)", "solid")
addObject(1155, 190, 20, 10, "yellow", "bounce");
addObject(1225, 440, 30, 10, "purple", "speed");
addObject(880, 190, 30, 10, "purple", "speed");
addObject(670, 320, 30, 10, "purple", "speed");


addObject(600, 330, 175, 15, "rgb(200,150,50)", "solid")
addObject(850, 315, 100, 20, "rgb(200,150,50)", "solid")

addObject(1050, 375, 30, 500, "rgb(200,150,50)", "solid")
addObject(950, 425, 30, 500, "rgb(200,150,50)", "solid")



addObject(165, 240, 20, 10, "yellow", "bounce");
addObject(365, 240, 20, 10, "yellow", "bounce");
addObject(240, 515, 30, 10, "yellow", "bounce");
addObject(565, 240, 30, 10, "yellow", "bounce");
addObject(825, 440, 30, 10, "yellow", "bounce");
addObject(987.5, 515, 55, 10, "yellow", "bounce");
addObject(1100, 515, 30, 10, "yellow", "bounce");


addObject(255, 165, 30, 10, "purple", "speed");
addObject(50, 515, 30, 10, "purple", "speed");
addObject(450, 515, 30, 10, "purple", "speed");

addObject(1250,483,15,15,"green","teleporter1");
addObject(480,30,15,15,"green","teleporter2");
addObject(620,430,15,15,"green","teleporter3");

function addObject(x, y, w, h, c, t) {
    let adder = new Rect(x, y, w, h, c, t);
    objects.push(adder);
}

function displayObjects() {
    for (let i = 0; i < objects.length; i++) {
        objects[i].renderer();
    }
}

function polishObjects() {
    for (let i = 0; i < objects.length; i++) {
        var curr = objects[i];
        ctx.lineWidth = 5;
        ctx.strokeRect(curr.x, curr.y, curr.w, curr.h);
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(curr.x + 6, curr.y + 3, curr.w, curr.h);
    }
}

var particles = [];
function newParticle(x, y, t, xv, yv, l, c) {
    var p = new Particle(x, y, t, xv*Math.random(), yv*Math.random(), l, c);
    particles.push(p)
}
function displayParticles() {
    for (let i = particles.length-1; i >=0; i--) {
        var curr = particles[i];
        curr.renderer("outline");
        if (curr.life <= 0) {
            particles.splice(i,1);
        }
    }
}

// Sets up input detection
var keys = ["w", "d", "a", "s", "ArrowUp", "ArrowRight", "ArrowLeft", "ArrowDown"];

var keys2 = {
    w: false,
    d: false,
    a: false,
    s: false,
    ArrowUp: false,
    ArrowRight: false,
    ArrowLeft: false,
    ArrowDown: false
}
var inputs = [];
var tokens = [];
var leftInput = false;
var rightInput = false;
var middleClick = 0;

// make the players
var player1 = new Player(25, 0, 1);
var player2 = new Player(50, 0, 2);
var player3 = new Player(75, 0, 3);


// Game mode selection
var gameModes = ["Tag"];
var gameMode = gameModes[0];

// Special values for tag gamemode
var tag = {
    tagger: 0,
    timer: 0,
    tagging: false,
    ghostX: null,
    ghostY: null
}

// Core game loop
var tick = 0;
function startGame() {
    document.querySelector("button").style.display = "none"
    canvas.style.display = "block"
    var gameLoop = setInterval(gameTick, 50);
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); })
}
// Runs every 50ms
function gameTick() {
    tick++;

    // Erase the screen
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Render the players
    displayParticles()
    player1.move();
    player2.move();
    player3.move();
    // Render the objects
    polishObjects();
    displayObjects()
    // Render ghost outline
    if (tag.ghostX != null) {
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = "3px"
        ctx.strokeRect(tag.ghostX,tag.ghostY,15,30);
        ctx.strokeStyle = "black"
    }
    middleClick = 0;
    // decreases all tokens by 1
    for (let i = inputs.length - 1; i >= 0; i--) {
        tokens[i] -= 1;
        if (tokens[i] <= 0) {
            tokens.splice(i,1);
            inputs.splice(i,1);
        }
    }

    // Main programming for the Tag gamemode
    if (gameMode == "Tag") {
        tag.timer -= 1;
        if (tick < seconds(3)) { // in first 3 seconds, give players time to spread out
            ctx.fillStyle = "red";
            ctx.font = "20px Courier New";
            ctx.fillText("The tagger is... " + Math.ceil(Math.random() * 3), 100, 50);
        } else if (tick == seconds(3)) { //Choose a random person to be it
            tag.tagger = Math.ceil(Math.random() * 3);
            // Give the one who is it a delay before they can move
            tag.timer = 25;
            player1.tagged = (tag.tagger == 1);
            player1.tagDelay = (tag.tagger == 1) * 25;
            player2.tagged = (tag.tagger == 2);
            player2.tagDelay = (tag.tagger == 2) * 25;
            player3.tagged = (tag.tagger == 3);
            player3.tagDelay = (tag.tagger == 3) * 25;
        } else if (tick <= seconds(5)) {
            ctx.fillStyle = "red";
            ctx.font = "20px Courier New";
            ctx.fillText("The tagger is Player " + tag.tagger + "! Run!", 100, 50);
        } else {
            if (tag.timer <= 0) {
                tag.tagging = true;
                let taggedPlayer = 0;
                switch (tag.tagger) { // See if the tagger is touching someone
                    case 1:
                        if (player1.playerDetect(player2)) { taggedPlayer = 2; player1.tagged = false; break; }
                        if (player1.playerDetect(player3)) { taggedPlayer = 3; player1.tagged = false; break; }
                        break;
                    case 2:
                        if (player2.playerDetect(player1)) { taggedPlayer = 1; player2.tagged = false; break; }
                        if (player2.playerDetect(player3)) { taggedPlayer = 3; player2.tagged = false; break; }
                        break;
                    case 3:
                        if (player3.playerDetect(player1)) { taggedPlayer = 1; player3.tagged = false; break; }
                        if (player3.playerDetect(player2)) { taggedPlayer = 2; player3.tagged = false; break; }
                        break;
                }

                if (taggedPlayer > 0) { // sets them to the tagger
                    tag.timer = 50;
                    switch (taggedPlayer) {
                        case 1: player1.tagged = true; player1.tagDelay = tag.timer; break;
                        case 2: player2.tagged = true; player2.tagDelay = tag.timer; break;
                        case 3: player3.tagged = true; player3.tagDelay = tag.timer; break;
                    }
                    tag.tagger = taggedPlayer;
                }
            }
        }
    }
}


function seconds(x) {
    return x * (1000 / 50);
}

// Gets placement of element in array, basic stuff
function getPlacement(x, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == x) {
            return i;
        }
    }
    return -1;
}

// Detects if key is down, and if it's in the fixed keys array, add it to current inputs with token 10.
document.addEventListener("keydown", function (e) {
    /*if (keys.includes(e.key)) { ### Metod used to be efficient but caused input delay so might as well just use the switch instead. ###
        if (!inputs.includes(e.key)) {
            inputs.push(e.key);
            tokens.push(5);
        } else {
            tokens[getPlacement(e.key,inputs)] = 5;
        }
    }*/
    switch (e.key) {
        case "w": keys2.w = true; break;
        case "d": keys2.d = true; break;
        case "a": keys2.a = true; break;
        case "s": keys2.s = true; break;
        case "W": keys2.w = true; break;
        case "D": keys2.d = true; break;
        case "A": keys2.a = true; break;
        case "S": keys2.s = true; break;
        case "ArrowUp": keys2.ArrowUp = true; break;
        case "ArrowRight": keys2.ArrowRight = true; break;
        case "ArrowLeft": keys2.ArrowLeft = true; break;
        case "ArrowDown": keys2.ArrowDown = true; break;
    }
})

// If key is up, remove it from the inputs array
document.addEventListener("keyup", function (e) {
    /*if (inputs.includes(e.key)) {
        tokens.splice(getPlacement(e.key,inputs),1);
        inputs.splice(getPlacement(e.key,inputs),1);
    }*/
    switch (e.key) {
        case "w": keys2.w = false; break;
        case "d": keys2.d = false; break;
        case "a": keys2.a = false; break;
        case "s": keys2.s = false; break;
        case "W": keys2.w = false; break;
        case "D": keys2.d = false; break;
        case "A": keys2.a = false; break;
        case "S": keys2.s = false; break;
        case "ArrowUp": keys2.ArrowUp = false; break;
        case "ArrowRight": keys2.ArrowRight = false; break;
        case "ArrowLeft": keys2.ArrowLeft = false; break;
        case "ArrowDown": keys2.ArrowDown = false; break;
    }

})
// Mouse detection for player 3
// If left/right click
document.addEventListener("mousedown", function (e) {
    if (e.button == 2) {
        rightInput = true;

    } else if (e.button == 0) {
        leftInput = true;
    }
});
// If left/right up
document.addEventListener("mouseup", function (e) {
    if (e.button == 2) {
        rightInput = false;
    } else if (e.button == 0) {
        leftInput = false;
    }
});
// Scroll wheel
document.addEventListener("wheel", function (e) {
    middleClick = e.deltaY;
}, { passive: false });
