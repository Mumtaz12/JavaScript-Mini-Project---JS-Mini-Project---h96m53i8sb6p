var idValue;
var cellArray = [];
var difficulty;
var base;
var numberOfBombs;
var bombCount;

//Object constructor for cell objects
function Cell(bomb, id) {
  this.isBomb = bomb;
  this.adjValue = 0;
  this.cellId = id;
  this.iterator = 0;
}

//Object constructor for difficulty levels
function Level(cells, bombs) {
  this.cellCount = cells;
  this.bombs = bombs;
}

var beginner = new Level(81, 10);
var intermediate = new Level(256, 40);
var expert = new Level(484, 99);

//function to create new Cell objects
var createObjects = function(userNumber) {
  for (q = 0; q < userNumber; q++) {
    var newCell = new Cell(false, q);
    cellArray.push(newCell);
  }
  base = Math.sqrt(cellArray.length);
}

//creates random numbers for bomb objects' cell ids
function getRandomBombs() {
  var randomNumbers = [];
  // numberOfBombs = Math.round(cellArray.length / 6);
  bombCount = numberOfBombs;
  for(m = 0; randomNumbers.length < numberOfBombs; m++) {
    var oneRandomBomb = Math.floor(Math.random() * cellArray.length);
    if(randomNumbers.indexOf(oneRandomBomb) == -1) {
      randomNumbers.push(oneRandomBomb);
    }
  }
  return randomNumbers;
}

//changes isBomb to true for objects with cellId equal to random number
var bombCells = function() {
  var randomBombs = getRandomBombs();
  for (k = 0; k < randomBombs.length; k++) {
    for (n = 0; n < cellArray.length; n++) {
      if(cellArray[n].cellId === randomBombs[k]) {
        cellArray[n].isBomb = true;
      }
    }
  }
  return randomBombs;
}

//Sets adjacency values
var touch = function() {
  var bId = bombCells();
  var allCells = [];
  for (l = 0; l < bId.length; l++) {
    var z = bId[l];
    var nw = z - (base + 1);
    var n = z - base;
    var ne = z - (base - 1);
    var w = z - 1;
    var e = z + 1;
    var sw = z + (base - 1);
    var s = z + base;
    var se = z + (base + 1);
    allCells.push(nw);
    allCells.push(n);
    allCells.push(ne);
    allCells.push(w);
    allCells.push(e);
    allCells.push(sw);
    allCells.push(s);
    allCells.push(se);
    if (z < base) {
      allCells.splice(allCells.indexOf(nw), 1);
      allCells.splice(allCells.indexOf(n), 1);
      allCells.splice(allCells.indexOf(ne), 1);
    }
    if (z >= base * (base - 1)) {
      allCells.splice(allCells.indexOf(sw), 1);
      allCells.splice(allCells.indexOf(s), 1);
      allCells.splice(allCells.indexOf(se), 1);
    }
    if (z % base === base - 1) {
      if (allCells.indexOf(ne) !== -1) {
        allCells.splice(allCells.indexOf(ne), 1);
      }
      allCells.splice(allCells.indexOf(e), 1);
      if (allCells.indexOf(se) !== -1) {
        allCells.splice(allCells.indexOf(se), 1);
      }
    }
    if (z % base === 0) {
      if (allCells.indexOf(nw) !== -1) {
        allCells.splice(allCells.indexOf(nw), 1);
      }
      allCells.splice(allCells.indexOf(w), 1);
      if (allCells.indexOf(sw) !== -1) {
        allCells.splice(allCells.indexOf(sw), 1);
      }
    }
  }
  return allCells;
}

//adds 1 to adjacency value for each bomb a cell is touching
var surroundingCells = function() {
  var touchCells = touch();
  var array = [];
  for (i = 0; i < cellArray.length; i++) {
    for (j = 0; j < touchCells.length; j++) {
      if(cellArray[i].cellId === touchCells[j]) {
        cellArray[i].adjValue +=1;
        array.push(cellArray[i]);
      }
    }
  }
  return array;
}

//User Interface Logic
$(document).ready(function() {

  $("#beginner").click(function(){
    createGame(beginner);
    $("#screen-overlay").hide();
    $(".container").show();
    $("#final").show();
    $(".minesweeper-game, .bomb-count, #reload-page").addClass("beginner");
  })

  $("#intermediate").click(function(){
    createGame(intermediate);
    $("#screen-overlay").hide();
    $(".container").show();
    $("#final").show();
        $(".minesweeper-game, .bomb-count, #reload-page").addClass("intermediate");
  })

  $("#expert").click(function(){
    createGame(expert);
    $("#screen-overlay").hide();
    $(".container").show();
    $("#final").show();
        $(".minesweeper-game, .bomb-count, #reload-page").addClass("expert");
  })

  var createGame = function(mode) {
    numberOfBombs = mode.bombs;
    difficulty = mode.cellCount;
    createObjects(difficulty);
    surroundingCells();

    $("#reload-page").click(function(){
      location.reload();
    })

    //Shows bomb counter
    $("#show-bomb-count").text(bombCount);

    //these two for loops make the grid
    for(var x = 0; x < base; x++) {
      var row = $("<div class='row'></div>");
      $(".minesweeper-game").append(row);
    }
    for(var y = 0; y < base; y++) {
      var cell = $("<div class='cell'></div>");
      $(".row").append(cell);
    }

    //gives each cell div an id of 0 incremented by 1
    function setIDs() {
      var divs = document.getElementsByClassName('cell');
      for(var p=0; p<divs.length; p++) {
        divs[p].id = p;
      }
    }
    setIDs();

    //Adds "has-bomb" class to cells
    for (i = 0; i < cellArray.length; i++) {
      if (cellArray[i].isBomb) {
        $("#" + cellArray[i].cellId).addClass("has-bomb");
      }
    }

    //Not game over
    var stateOfGame = true;


    //Removes right-click context menu on game
    $(".minesweeper-game").contextmenu(function() {
      return false;
    });

    /////////////////////////////////////////////////////////////////////////////////////
    var south = function(thisPlaceholder) {
      for (i = parseInt(thisPlaceholder); i < cellArray.length; i += base) {
        if (cellArray[i].iterator === 0) {
          cellArray[i].iterator += 1;
          clickExpander(i);
        }
        if ($("#" + i).hasClass("flag")) {
          break;
        } else if (cellArray[i].adjValue === 0)  {
          if (cellArray[i].cellId >= base * (base-1)) {
            $("#" + i).addClass("clicked-on");
            break;
          } else {
            $("#" + i).addClass("clicked-on");
          }
        } else {
          $("#" + i).addClass("clicked-on");
          $("#" + i).text(cellArray[i].adjValue);
          break;
        }
      }
    }

    var north = function(thisPlaceholder) {
      for (i = parseInt(thisPlaceholder); i < cellArray.length; i -= base) {
        if (cellArray[i].iterator === 0) {
          cellArray[i].iterator += 1;
          clickExpander(i);
        }
        if ($("#" + i).hasClass("flag")) {
          break;
        } else if (cellArray[i].adjValue === 0) {
          if (cellArray[i].cellId < base) {
            $("#" + i).addClass("clicked-on");
            break;
          } else {
            $("#" + i).addClass("clicked-on");
          }
        } else {
          $("#" + i).addClass("clicked-on");
          $("#" + i).text(cellArray[i].adjValue);
          break;
        }
      }
    }

    var east = function(thisPlaceholder) {
      for (i = parseInt(thisPlaceholder); i < cellArray.length; i++) {
        if (cellArray[i].iterator === 0) {
          cellArray[i].iterator += 1;
          clickExpander(i);
        }
        if ($("#" + i).hasClass("flag")) {
          break;
        } else if (cellArray[i].adjValue === 0) {
          if (cellArray[i].cellId % base === base - 1 && cellArray[i].cellId < base * base) {
            $("#" + i).addClass("clicked-on");
            break;
          } else {
            $("#" + i).addClass("clicked-on");
          }
        } else {
          $("#" + i).addClass("clicked-on");
          $("#" + i).text(cellArray[i].adjValue);
          break;
        }
      }
    }

    var west = function(thisPlaceholder) {
      for (i = parseInt(thisPlaceholder); i < cellArray.length; i--) {
        if (cellArray[i].iterator === 0) {
          cellArray[i].iterator += 1;
          clickExpander(i);
        }
        if ($("#" + i).hasClass("flag")) {
          break;
        } else if (cellArray[i].adjValue === 0) {
          if (cellArray[i].cellId % base === 0) {
            $("#" + i).addClass("clicked-on");
            break;
          } else {
            $("#" + i).addClass("clicked-on");
          }
        } else {
          $("#" + i).addClass("clicked-on");
          $("#" + i).text(cellArray[i].adjValue);
          break;
        }
      }
    }

    var northeast = function(thisPlaceholder) {
      for (i = parseInt(thisPlaceholder); i < cellArray.length; i -= (base-1)) {
        if (cellArray[i].iterator === 0) {
          cellArray[i].iterator += 1;
          clickExpander(i);
        }
        if ($("#" + i).hasClass("flag")) {
          break;
        } else if (cellArray[i].adjValue === 0) {
          if ((cellArray[i].cellId % base === base - 1)||(cellArray[i].cellId < base)) {
            $("#" + i).addClass("clicked-on");
            break;
          } else{
            $("#" + i).addClass("clicked-on");
          }
        } else {
          $("#" + i).addClass("clicked-on");
          $("#" + i).text(cellArray[i].adjValue);
          break;
        }
      }
    }

    var northwest = function(thisPlaceholder) {
      for (i = parseInt(thisPlaceholder); i < cellArray.length; i -= (base+1)) {
        if (cellArray[i].iterator === 0) {
          cellArray[i].iterator += 1;
          clickExpander(i);
        }
        if ($("#" + i).hasClass("flag")) {
          break;
        } else if (cellArray[i].adjValue === 0) {
          if ((cellArray[i].cellId % base === 0)||(cellArray[i].cellId < base)) {
            $("#" + i).addClass("clicked-on");
            break;
          } else{
            $("#" + i).addClass("clicked-on");
          }
        } else {
          $("#" + i).addClass("clicked-on");
          $("#" + i).text(cellArray[i].adjValue);
          break;
        }
      }
    }

    var southeast = function(thisPlaceholder) {
      for (i = parseInt(thisPlaceholder); i < cellArray.length; i += (base+1)) {
        if (cellArray[i].iterator === 0) {
          cellArray[i].iterator += 1;
          clickExpander(i);
        }
        if ($("#" + i).hasClass("flag")) {
          break;
        } else if (cellArray[i].adjValue === 0) {
          if ((cellArray[i].cellId % base === base - 1)||(cellArray[i].cellId >= base * (base-1))) {
            $("#" + i).addClass("clicked-on");
            break;
          } else{
            $("#" + i).addClass("clicked-on");
          }
        } else {
          $("#" + i).addClass("clicked-on");
          $("#" + i).text(cellArray[i].adjValue);
          break;
        }
      }
    }

    var southwest = function (thisPlaceholder) {
      for (i = parseInt(thisPlaceholder); i < cellArray.length; i += (base-1)) {
        if (cellArray[i].iterator === 0) {
          cellArray[i].iterator += 1;
          clickExpander(i);
        }
        if ($("#" + i).hasClass("flag")) {
          break;
        } else if (cellArray[i].adjValue === 0) {
          if ((cellArray[i].cellId % base >= base * (base-1)) || (cellArray[i].cellId % base === 0)) {
            $("#" + i).addClass("clicked-on");
            break;
          } else{
            $("#" + i).addClass("clicked-on");
          }
        } else {
          $("#" + i).addClass("clicked-on");
          $("#" + i).text(cellArray[i].adjValue);
          break;
        }
      }
    }

    var clickExpander = function(thisPlaceholder) {
      south(thisPlaceholder);
      north(thisPlaceholder);
      east(thisPlaceholder);
      west(thisPlaceholder);
      northeast(thisPlaceholder);
      northwest(thisPlaceholder);
      southeast(thisPlaceholder);
      southwest(thisPlaceholder);
    }

    //click listener
    $(".cell").mousedown(function(event) {
      if (stateOfGame === true) {
        switch (event.which) {

          //On left click
          case 1:
          idValue = $(this).attr("id");
          //If you left-click on a bomb, they all show up and game over
          if ($(this).hasClass("flag")){
            break;
            //If you left-click on a flag, nothing happens
          } else if ($(this).hasClass("has-bomb")) {
            $(".flag").removeClass("flag");
            $(".has-bomb").addClass("bomb-clicked");
            $("#win-lose").show();
            $("#win-lose").text("You lose");
            stateOfGame = false;
            //If you click on an empty space, it gains class "clicked-on"
          } else {
            //Down
            if (cellArray[idValue].adjValue > 0) {
              $(this).addClass("clicked-on");
              //shows the adjacency value when a cell is clicked on
              $(this).text(cellArray[idValue].adjValue);
            } else {
              clickExpander($(this).attr("id"));
            }
          }
          if (cellArray.length - numberOfBombs === $(".clicked-on").length) {
            $("#win-lose").show();
            $("#win-lose").text("You win");
          }

          break;

          //On Right click
          case 3:
          //Flag toggling
          if ($(this).hasClass("flag")) {
            $(this).removeClass("flag")
            bombCount += 1;
            $("#show-bomb-count").text(bombCount);
          } else if ($(this).hasClass("clicked-on")){
            break;
          } else {
            bombCount -= 1;
            $("#show-bomb-count").text(bombCount);
            $(this).addClass("flag");
          }
        }
      }
    })
  }
})
