// Variables
/// Constants
var gridWidth = 10;
var gridHeight = 10;
var gridBombs = 10;
/// DOM
const UI_Grid = document.getElementById("grid");
const UI_Canvas = document.querySelector("canvas");
const UI_Flags = document.getElementById("flags");
/// Canvas
const ctx = UI_Canvas.getContext("2d");
/// Debug
const DBG_SHOWMINES = true;
/// Thread
var thread = null;
/// UI
var mousePosition = [];

// Functions
function moveMouse(event){
  mousePosition = [
    event.clientX,
    event.clientY
  ];
}
function drawTileMap(tilepath, x,y, w,h, tx,ty, tw,th){
  ctx.imageSmoothingEnabled = false;

  var tileset = new Image();
  tileset.src = tilepath;
  ctx.fillStyle = "#ffffff";
  ctx.drawImage(tileset, tx*tw,ty*th, tw,th, x * w, y * h, w, h);
}

// Events
window.addEventListener("mousemove", moveMouse);