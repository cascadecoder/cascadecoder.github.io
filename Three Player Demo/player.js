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
            if (this.id == 1 && (keys2.w)) { if (this.ghost) { this.yv = -10 } else { this.jump() } } // Jump button
            if (this.id == 1 && (keys2.d && !keys2.a)) { this.xv = 10; } // Right
            if (this.id == 1 && (!keys2.d && keys2.a)) { this.xv = -10; } // Left
            if (this.id == 1 && (keys2.s)) { if (this.ghost) { this.yv = 10 } else { this.power() } } // Power

            if (this.id == 2 && (keys2.ArrowUp)) { if (this.ghost) { this.yv = -10 } else { this.jump() } } // Jump
            if (this.id == 2 && (keys2.ArrowRight && !keys2.ArrowLeft)) { this.xv = 10; } // Right
            if (this.id == 2 && (!keys2.ArrowRight && keys2.ArrowLeft)) { this.xv = -10; } // Left
            if (this.id == 2 && (keys2.ArrowDown)) { if (this.ghost) { this.yv = 10 } else { this.power() } } // Power
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
        this.xv *= 1 + this.tagged * 0.1 * (!this.ghost); // extra boost (tiny) for the tagger, but not if they are ghost
        if (this.xv % 10 == 0) {
            this.xv *= 1 + this.fast * 0.5;
        }
        if (this.ghost) {
            this.xv *= 1.3; // larger boost for the ghost mode
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
        if (this.powerDuration > 0) {this.powerDuration--; if (this.powerDuration <= 0) {
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
            this.powerDuration-=0.5;
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
