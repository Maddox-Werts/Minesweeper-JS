// Variables
/// Constants
var gridWidth = 10;
var gridHeight = 10;
var gridBombs = 3;
/// DOM
const UI_Grid = document.getElementById("grid");
const UI_Canvas = document.querySelector("canvas");
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

// Events
window.addEventListener("mousemove", moveMouse);