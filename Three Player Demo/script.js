/*

A three-player game in only
vanilla js and html. No libraries.
Just a lot of sweat and tears.


Three player game
v0.5.1

*/

// Initialize canvas to draw one
var canvas = document.getElementById("c");
canvas.width = 1300;
canvas.height = 550;
var ctx = canvas.getContext('2d');

// Create the map with rectangle objects #manual-labor #aaaa
var objects = [];
// Borders of the screen
addObject(0, -50, canvas.width, 50, "rgb(200,150,50)", "solid")
addObject(0, canvas.height - 25, canvas.width, 25, "rgb(200,150,50)", "solid")
addObject(-50, 0, 50, canvas.height, "black", "solid")
addObject(canvas.width, 0, 50, canvas.height, "black", "solid")

map1();

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
    

    // Erase the screen
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    renderUI();
    handleConnectors()
    if (!gameRunning) {return}
    tick++;
    // Render the players
    displayParticles()
    ctx.globalAlpha = 1;
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

function setupGame() {
    switch (map) {
        case 1: map1();break;
        case 2: map2();break;
        case 3: map3();break;
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
