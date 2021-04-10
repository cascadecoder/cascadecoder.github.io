//©rowannerd 2021
//credit to GetCoding! for <canvas> element
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
function drawBackground() {
  ctx.fillStyle = "rgb(255, 255, 200)";
  ctx.fillRect(0, 0, 300, 300);
  ctx.fillStyle = "black"
  ctx.fillRect(20, 20, 30, 30);
}
function tick() {
  drawBackground();
  ctx.clearRect(0, 0, 300, 300);
  tick();
}
tick();
