// Variables
/// Game
var tilesGrid = [];
var tilesShown = [];
var flagsGrid = [];
var playing = true;
/// For loops
var rippling = false;
/// Games
var flags = gridBombs;

// Functions
/// Private
function _checkWin(){
  // Matches
  var matches = 0;

  for(var y = 0; y < gridHeight; y++){
    for(var x = 0; x < gridWidth; x++){
      if(flagsGrid[y*gridHeight+x]
      && tilesGrid[y*gridHeight+x]){
        matches++;
      }
    }
  }

  if(matches >= gridBombs){
    _winGame();
  }
}
function _updateScreen(){
  // Mode of tile?
  var tileMode = 0;

  // Thing
  for(var y = 0; y < gridHeight; y++){
    for(var x = 0; x < gridWidth; x++){
      // Drawing with CANVAS
      let _tileWidth = UI_Canvas.width / gridWidth;
      let _tileHeight = UI_Canvas.height / gridHeight;

      // Drawing
      /// New Object
      ctx.beginPath();

      /// Color?
      ctx.fillStyle = "#ffffff";

      // Game over, show mines
      if(!playing
      && tilesGrid[y*gridHeight+x] == 1){
        tileMode = 0;
      }
      // Numbered tiles
      else if(!tilesGrid[y*gridHeight+x]
      && tilesShown[y*gridHeight+x]){
        tileMode = 1;
      }
      // Flag tiles
      else if(flagsGrid[y*gridHeight+x]){
        tileMode = 2;
      }
      // Standard tiles
      else{
        tileMode = 3;
      }

      // What tile mode do we use?
      switch(tileMode){
      case 0:
        drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 2,0, 16,16);
        break;
      case 1:
        
        // Todo: Add numbered tiles support
        switch(_getNumber(x,y)){
        case "":
          drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 3,0, 16,16);
          break;
        case 1:
          drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 0,1, 16,16);
          break;
        case 2:
          drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 1,1, 16,16);
          break;
        case 3:
          drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 2,1, 16,16);
          break;
        case 4:
          drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 3,1, 16,16);
          break;
        case 5:
          drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 0,2, 16,16);
          break;
        case 6:
          drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 1,2, 16,16);
          break;
        case 7:
          drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 2,2, 16,16);
          break;
        case 8:
          drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 3,2, 16,16);
          break;
        }

        break;
      case 2:
        drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 1,0, 16,16);
        break;
        
      case 3:
        drawTileMap("data/icons.png", x, y, _tileWidth, _tileHeight, 0,0, 16,16);
        break;
      }
    }
  }

  // Win check
  _checkWin();

  // UI
  UI_Flags.textContent = flags;
  console.log(flags);
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
    for(var x = 0; x < gridWidth; x++){
      // Add to shown
      tilesGrid.push(0);
      tilesShown.push(0);
      flagsGrid.push(0);
    }
  }
}
function _createGrid(){
  // Mouse to cursor pos
  // Get mouse position
  var _mx = mousePosition[0];
  var _my = mousePosition[1];

  // Convert it to local grid space
  _mx -= UI_Canvas.offsetLeft;
  _my -= UI_Canvas.offsetTop;

  // Convert _mx and _my to be able to be used to find the tile the user wants
  let _x = Math.floor(_mx / (UI_Canvas.width / gridWidth));
  let _y = Math.floor(_my / (UI_Canvas.height / gridHeight));

  // Random Bombs
  for(var i = 0; i < gridBombs; i++){
    // Placeholder positions
    var _bx = 0;
    var _by = 0;
    
    // Checking for an unused space
    while(true){
      _bx = parseInt(Math.random() * 10);
      _by = parseInt(Math.random() * 10);

      if(tilesGrid[_by*gridHeight+_bx] == 0
      && _bx != _x && _by != _y){
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
      if((_y >= 0 && _y < gridHeight)
      && (_x >= 0 && _x < gridWidth)){
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

function spawnRipple(x, y) {
  // Tile with bombs near?
  if(_getNumber(x,y) != ""){
    rippling = false;
    return;
  }

  // Checking if this is a bad tile..
  for (var _y = -1; _y < 2; _y++) {
    for (var _x = -1; _x < 2; _x++) {
      // Checking for things that will cause it to fail
      if (_x == 0 && _y == 0) {
        continue;
      }
      if (x + _x < 0 || x + _x >= gridWidth || y + _y < 0 || y + _y >= gridHeight) {
        continue;
      }
      
      // No diagonal
      if((_x == -1 && _y == -1)
      || (_x == -1 && _y ==  1)
      || (_x ==  1 && _y == -1)
      || (_x ==  1 && _y ==  1)){
        continue;
      }

      // Bombs near?
      if(_getNumber(x+_x, y+_y) != ""){
        tilesShown[(y + _y) * gridWidth + (x + _x)] = 1;
        continue;
      }

      // The beef and potatoes!
      if (!tilesShown[(y + _y) * gridWidth + (x + _x)] && !_chkTile(x + _x, y + _y)) {
        tilesShown[(y + _y) * gridWidth + (x + _x)] = 1;
        spawnRipple(x + _x, y + _y);
      }
    }
  }

  // Checking for a fail
  for (var _y = -1; _y < 2; _y++) {
    for (var _x = -1; _x < 2; _x++) {
      // Checking for things that will cause it to fail
      if (_x == 0 && _y == 0) {
        continue;
      }
      if (x + _x < 0 || x + _x >= gridWidth || y + _y < 0 || y + _y >= gridHeight) {
        continue;
      }

      // The beef and potatoes!
      if (!tilesShown[(y + _y) * gridWidth + (x + _x)] && !_chkTile(x + _x, y + _y)) {
        return;
      }
    }
  }

  // Failing..
  rippling = false;
}
function _revealTiles(x, y) {
  // Are we clicking on a flag?
  if(flagsGrid[y*gridHeight+x] != 0){return};

  // Set clicked tile
  _setTile(x, y, 1);
  
  // RIPPLE EFFECT METHOD
  rippling = true;
  // Force ripple ending if things carry on forever
  setTimeout(function(){
    rippling = false;
  }, 1500);

  // Ripple!
  while(rippling){
    spawnRipple(x,y);
  }

  // You messed up..
  if (tilesGrid[y * gridWidth + x]) {
    _endGame();
  }
}
function _clickTile(){
  // The whole reason I was going to use Divs is because
  // It would have been easier but.. No.. Of course not
  // Javascript is Never simple or it never works like C/C++ does.
  
  // Get mouse position
  var _mx = mousePosition[0];
  var _my = mousePosition[1];

  // Convert it to local grid space
  _mx -= UI_Canvas.offsetLeft;
  _my -= UI_Canvas.offsetTop;

  // Convert _mx and _my to be able to be used to find the tile the user wants
  let _x = Math.floor(_mx / (UI_Canvas.width / gridWidth));
  let _y = Math.floor(_my / (UI_Canvas.height / gridHeight));

  console.log(_x, _y);

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
}
function _addFlag(event){
  // Prevent default
  event.preventDefault();

  // Too many flags?
  if(flags <= 0){
    return;
  }

  // Get mouse position
  var _mx = mousePosition[0];
  var _my = mousePosition[1];

  // Convert it to local grid space
  _mx -= UI_Canvas.offsetLeft;
  _my -= UI_Canvas.offsetTop;

  // Convert _mx and _my to be able to be used to find the tile the user wants
  let _x = Math.floor(_mx / (UI_Canvas.width / gridWidth));
  let _y = Math.floor(_my / (UI_Canvas.height / gridHeight));

  // Now, let's add the flag!
  flagsGrid[_y*gridHeight+_x] = !flagsGrid[_y*gridHeight+_x];

  console.log("New Flag: " + flagsGrid[_y*gridHeight+_x]);
}
function _getFlags(){
  flags = gridBombs;
  for(var y = 0; y < gridHeight; y++){
    for(var x = 0; x < gridWidth; x++){
      if(flagsGrid[y*gridHeight+x] == 1){
        flags--;
      }
    }
  }
}

/// Public
function _endGame(){
  alert("YOU HIT A MINE!");
  playing = false;
}
function _winGame(){
  alert("You Won!");
}
function _onUpdate(){
  // Drawing:
  _getFlags();
  _updateScreen();
}
function _onStart(){
  // Init
  _startGrid();

  // Start loop
  thread = window.setInterval(_onUpdate, 3);
}

// Events
window.addEventListener("load", _onStart);
UI_Canvas.addEventListener("click", _clickTile);
UI_Canvas.addEventListener("contextmenu", _addFlag);