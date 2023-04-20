// Variables
/// Game
var tilesGrid = [];
var tilesShown = [];

// Functions
/// Private
function _updateScreen(){
  for(var y = 0; y < gridHeight; y++){
    for(var x = 0; x < gridWidth; x++){
      let _curTile = document.getElementById(x + "x" + y);
      if(tilesShown[y*gridHeight+x]){
        _curTile.className = "grid_tile_" + (tilesGrid[y*gridHeight+x] + 1);

        if(tilesGrid[y*gridHeight+x] == 0){
          // Getting surrounding
          let _curNum = _getNumber(x,y);

          _curTile.children[0].innerText = _curNum.toString(); 
        }
      }
      else{
        _curTile.className = "grid_tile_0";
      }

      // TEMP
      if(tilesGrid[y*gridHeight+x] == 1
      && DBG_SHOWMINES){
        _curTile.className = "grid_tile_2";
      }
    }
  }
}
function _startGrid(){
  /*
      This is different from _createGrid

      this will just start up the systems.
      _createGrid will be triggered when you first click
      making the grid spawn
  */

  // Reset grid
  tilesGrid = [];
  tilesShown = [];

  // Loops for Grids
  for(var y = 0; y < gridHeight; y++){
    var _newRow = document.createElement("div");
    _newRow.className = "grid_row";

    for(var x = 0; x < gridWidth; x++){
      // Add to shown
      tilesGrid.push(0);
      tilesShown.push(0);

      // New element to add to GRID
      var _newTile = document.createElement("div");
      _newTile.className = "grid_tile_0";
      _newTile.id = x + "x" + y;
      _newTile.innerHTML = "<p id='text'></p>";

      // Event?
      _newTile.setAttribute("onclick", "_clickTile('" + x + "x" + y + "')");

      // Append it to our row
      _newRow.appendChild(_newTile);
    }

    // Append the row to our grid
    UI_Grid.appendChild(_newRow);
  }
}
function _createGrid(){
  // Random Bombs
  for(var i = 0; i < gridBombs; i++){
    // Placeholder positions
    var _bx = 0;
    var _by = 0;
    
    // Checking for an unused space
    while(true){
      _bx = parseInt(Math.random() * 10);
      _by = parseInt(Math.random() * 10);

      if(tilesGrid[_by*gridHeight+_bx] == 0){
        break;
      }
    }

    // Apply position
    tilesGrid[_by*gridHeight+_bx] = 1;
  }
}

function _chkTile(x,y){
  return tilesGrid[y*gridHeight+x];
}
function _setTile(x,y, val){
  tilesShown[y*gridHeight+x] = val;
}

function _getNumber(x,y){
  // Result number
  var result = 0;

  // Go through all tiles
  for(var _y = y-1; _y < y+2; _y++){
    for(var _x = x-1; _x < x+2; _x++){
      if(_y > 0 && _y < gridHeight - 1
      && _x > 0 && _x < gridWidth - 1){
        if(_chkTile(_x,_y) > 0){
          result++;
        }
      }
    }
  }

  if(result == 0){
    result = "";
  }

  // Return result
  return result;
}

function _revealTiles(x, y) {
  _setTile(x, y, 1);
  var sweepScale = 1;
  while (sweepScale < (gridWidth + gridHeight) / 2) {
    var mineFound = false;

    for (var _y = -sweepScale; _y <= sweepScale; _y++) {
      for (var _x = -sweepScale; _x <= sweepScale; _x++) {
        if (_x == 0 && _y == 0) {
          continue; // Skip the center tile
        }
        if (_chkTile(x + _x, y + _y)) {
          mineFound = true;
          break;
        }
      }
      if (mineFound) {
        break;
      }
    }

    if (mineFound) {
      console.log("MINE");
      break;
    }
    else {
      console.log("SUCCESS");
      for (var _y = -sweepScale; _y <= sweepScale; _y++) {
        for (var _x = -sweepScale; _x <= sweepScale; _x++) {
          if (_x == 0 && _y == 0) {
            continue; // Skip the center tile
          }

          if(x + _x < 0 || x + _x > gridWidth - 1){
            continue; // Out of range
          }
          if(y + _y < 0 || y + _y > gridHeight - 1){
            continue; // Out of range
          }

          _setTile(x + _x, y + _y, 1);
        }
      }
    }

    if (sweepScale >= (gridWidth + gridHeight) / 2) {
      console.log("Eject");
      break;
    }

    sweepScale++;
  }

  if (tilesGrid[y * gridWidth + x]) {
    _endGame();
  }
}
function _clickTile(tilePOS){
  // Split up and get X and Y
  let splitPos = tilePOS.split("x");
  let _x = parseInt(splitPos[0]);
  let _y = parseInt(splitPos[1]);

  // Check if we need to init the grid
  let sum = 0;
  for(var i = 0; i < tilesGrid.length; i++){
    sum += tilesGrid[i];
  }
  if(sum == 0){
    _createGrid();
  }

  // Update
  _revealTiles(_x, _y);
  _updateScreen();
}

/// Public
function _endGame(){
  alert("YOU HIT A MINE!");
}
function _onUpdate(){

}
function _onStart(){
  _startGrid();
}

// Events
window.addEventListener("load", _onStart);