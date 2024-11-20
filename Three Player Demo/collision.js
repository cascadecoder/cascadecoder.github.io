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
