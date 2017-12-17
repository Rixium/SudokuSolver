var button;
var input;
var solveButton;
var boardSize;
var boardWidth = 0;
var cellWidth;

var allSolved = false;
var tries = 0;

function setup() {
  var canvas = createCanvas(800, 800);
  background(51);

  textAlign(CENTER);
  textSize(24);
  fill(255);
  text("Input width of sudoku:", width / 2, height / 2 - 30);

  input = createInput();
  input.position(windowWidth / 2 - input.width / 2, windowHeight / 2);

  button = createButton("Create SUDOKU");
  button.position(windowWidth / 2 - button.width / 2, windowHeight / 2 + 10 + button.height);
  button.mousePressed(start);
}

function start() {
  clear();
  background(51);
  var numOfBlocks = parseInt(input.value());
  boardWidth = numOfBlocks;
  var boardHeight = numOfBlocks;
  createSudoku(boardWidth, boardHeight);
  button.hide();
  input.hide();
}

function cellBlock(x, y, xPos, yPos, size, index) {
  this.x = x;
  this.y = y;
  this.xPos = xPos;
  this.yPos = yPos;
  this.size = size;
  this.number = 0;
  this.index = index;
  this.possibleNumbers = [];
  this.wasSet = false;
}

window.onresize = function(event) {
    input.position(window.innerWidth / 2 - input.width / 2, window.innerHeight / 2);
    button.position(window.innerWidth / 2 - button.width / 2, window.innerHeight / 2 + 10 + button.height);
    if(solveButton != null) {
      solveButton.position(window.innerWidth / 2 - solveButton.width / 2, window.innerHeight / 2 + boardSize / 2 + solveButton.height * 3);
    }
};

var cellBlocks = [];
var currIndex = 0;
var ready = false;



function createSudoku(width, height) {
  cellWidth = 3;
  var cellHeight = 3;
  var cellSize = 30;

  var accumulatePadding = 0.0;

  for(var i = 0; i < height; i++) {
    for(var j = 0; j < width; j++) {
      accumulatePadding += i / 3;
    }
  }

  boardSize = width * cellWidth * cellSize + accumulatePadding;

  for(var i = 0; i < height; i++) {
    for(var j = 0; j < width; j++) {
      var newCellBlocks = createBlockSet(i * cellWidth + i / 3, j * cellHeight + j / 3, cellWidth, cellHeight, cellSize, boardSize);
      newCellBlocks.index = currIndex;
      cellBlocks[currIndex] = newCellBlocks;
      currIndex++;
    }
  }
  solveButton = createButton("SOLVE!");
  solveButton.textSize = 30;
  solveButton.position(windowWidth / 2 - solveButton.width / 2, windowHeight / 2 + boardSize / 2 + solveButton.height * 3);
  solveButton.mousePressed(solveSudoku);
  ready = true;
}
function solveSudoku() {

  for(var i = 0; i < cellBlocks.length; i++) {
    for(var j = 0; j < cellBlocks[i].length; j++) {
      if(cellBlocks[i][j].number != 0) {
        cellBlocks[i][j].wasSet = true;
      }
    }
  }

  solve(0, 0);
}

function solve(block, pos) {

  if(block == 8 && pos == 9) {
    return true;
  }
   var nextBlock = block;
   var nextPos = pos;

   if(block == 2 || block == 5 || block == 8) {
     if(pos == 8) {
       nextPos = 0;
       nextBlock++;
     } else if(pos == 2 || pos == 5) {
       nextBlock--;
       nextBlock--;
       if(pos == 2) {
         nextPos = 3;
       } else if (pos == 5) {
         nextPos = 6;
       }
     } else {
       nextPos++;
     }
   } else {
     if(pos == 2) {
       nextBlock++;
       nextPos = 0;
     } else if (pos == 5) {
       nextBlock++;
       nextPos = 3;
     } else if (pos == 8) {
       nextBlock++;
       nextPos = 6;
     } else {
       nextPos++;
     }
   }


  if(!cellBlocks[block][pos].wasSet) {
    for(var i = 1; i <= 9; i++) {
      if(blockAcceptable(block, pos, i)) {
        cellBlocks[block][pos].number = i;
        if(solve(nextBlock, nextPos)) {
          return true;
        }
      }
    }
  } else {
    if(solve(nextBlock, nextPos)) {
      return true;
    }
  }

  if(!cellBlocks[block][pos].wasSet) {
    cellBlocks[block][pos].number = 0;
  }

  return false;
}

function blockAcceptable(block, cell, num) {
  if(!checkNumberPresent(cellBlocks[block], num)) {
    if(checkSolveVertical(block, cell, num)) {
      if(checkSolveHorizontal(block, cell, num)) {
        return true;
      }
    }
  }
  return false;
}

function checkCellBlock(cellBlock, pos, row) {

}

var activeCell = null;

function findIndex(array, num) {
  for(var i = 0; i < array.length; i++) {
    if(array[i] == num) {
      return i;
    }
  }
}

function checkNumberPresent(array, num) {
  for(var i = 0; i < array.length; i++) {
    if(array[i].number == num) {
      return true;
    }
  }
  return false;
}

function checkSolveVertical(blockPos, cellPos, num) {
  var topBracket = blockPos;

  while(topBracket > boardWidth - 1) {
    topBracket -= boardWidth;
  }

  var bottomBracket = blockPos + boardWidth;
  while(bottomBracket < cellBlocks.length - boardWidth) {
    bottomBracket += boardWidth;
  }


  if(topBracket < 0) {
    topBracket = blockPos;
  }
  if(bottomBracket > cellBlocks.length - 1) {
    bottomBracket = blockPos;
  }

  var topCellPos = cellPos;
  var bottomCellPos = cellPos;

  while(topCellPos > cellWidth - 1) {
    topCellPos -= cellWidth;
  }

  while(bottomCellPos < cellBlocks[blockPos].length - cellWidth) {
    bottomCellPos += cellWidth;
  }

  if(topCellPos < 0) {
    topCellPos = cellPos;
  }
  if(bottomCellPos > (cellWidth * cellWidth) - 1) {
    bottomCellPos = cellPos;
  }

  for(var i = topBracket; i <= bottomBracket; i += boardWidth) {
    if(i == blockPos) {
      continue;
    }
    var nextBlock = cellBlocks[i];

    for(var x = topCellPos; x <= bottomCellPos; x += cellWidth) {
      if(nextBlock[x].number == num) {
        return false;
      }
    }
  }

  return true;
}

function keyPressed() {
  if(activeCell != null) {
    if (keyCode == 49) {
       activeCell.number = 1;
     } else if (keyCode == 50) {
       activeCell.number = 2;
     } else if ( keyCode == 51) {
       activeCell.number = 3;
     } else if (keyCode == 52) {
       activeCell.number = 4;
     } else if (keyCode == 53) {
       activeCell.number = 5;
     } else if (keyCode == 54) {
       activeCell.number = 6;
     } else if (keyCode == 55) {
       activeCell.number = 7;
     } else if (keyCode == 56) {
       activeCell.number = 8;
     } else if (keyCode == 57) {
       activeCell.number = 9;
     } else if (keyCode == 48) {
       activeCell.number = 0;
     }
  }
  activeCell = null;
}
function checkSolveHorizontal(blockPos, cellPos, num) {
  var diff = blockPos % boardWidth;
  var leftBracket = blockPos - diff;
  var rightBracket = leftBracket + boardWidth - 1;

  var cellDif = cellPos % cellWidth;
  var leftCellPos = cellPos - cellDif;
  var rightCellPos = leftCellPos + cellWidth - 1;

  for(var i = leftBracket; i <= rightBracket; i++) {
    if(i == blockPos) {
      continue;
    }
    var nextBlock = cellBlocks[i];

    for(var x = leftCellPos; x <= rightCellPos; x++) {
      if(nextBlock[x].number == num) {
        return false;
      }
    }
  }

  return true;
}

function createBlockSet(y, x, cellWidth, cellHeight, cellSize, boardSize) {
  var startX = x, endX = x + cellWidth;
  var startY = y, endY = y + cellHeight;
  var padding = 1;
  var cellBlocks = [];
  var cellBlockIndex = 0;
  for(var i = startY; i < endY; i++) {
    for(var j = startX; j < endX; j++) {
      var xPos = j * cellSize + canvas.width / 2 - boardSize / 2;
      var yPos = i * cellSize + canvas.width / 2 - boardSize / 2;
      var size = cellSize;
      var newCellBlock = new cellBlock(Math.floor(j), Math.floor(i), xPos, yPos, size, cellBlockIndex);
      cellBlocks[cellBlockIndex] = newCellBlock;
      cellBlockIndex++;
    }
  }

  return cellBlocks;
}

var currBlock = null;
var wasUp = true;

function mousePressed() {
  if(currBlock != null && wasUp) {
    activeCell = currBlock;
    if(currBlock.number < 9) {
      currBlock.number++;
    } else {
      currBlock.number = 0;
    }
    wasUp = false;
  }
}

function mouseReleased() {
  wasUp = true;
}

function draw() {
  clear();
  background(51);
  currBlock = null;
  if(ready) {
    for(var i = 0; i < cellBlocks.length; i++) {
      textSize(20);
      for(var j = 0; j < cellBlocks[i].length; j++) {
        var block = cellBlocks[i][j];
        fill(255);
        if(mouseX > block.xPos && mouseY > block.yPos) {
          if(mouseX < block.xPos + block.size && mouseY < block.yPos + block.size) {
            fill(255, 100, 100);
            currBlock = block;
          }
        }
        rect(block.xPos, block.yPos, block.size, block.size);

        if(block.number != 0) {
          fill(0);
          text(block.number, block.xPos + block.size / 2, block.yPos + block.size / 1.2);
        } else {
          fill(255, 0, 0, 40);
          text(block.index, block.xPos + block.size / 2, block.yPos + block.size / 1.2);
        }
      }
    }
  }
}
