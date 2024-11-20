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


var mouseX = 0;
var mouseY = 0;
document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
})
