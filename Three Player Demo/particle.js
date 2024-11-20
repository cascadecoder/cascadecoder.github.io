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
