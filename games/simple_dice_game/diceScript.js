// Player name
var player1 = "Player 1";
var player2 = "Player 2";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
} //delay function

// Function to change the player name
function editNames() {
    player1 = prompt("Change Player1 name");
 // player2 = prompt("Change player2 name");

    document.querySelector("p.Player1").innerHTML = player1;
 // document.querySelector("p.Player2").innerHTML = player2;
}

// alans grid:
// var Grid = document.getElementById("Grid");
//for(let i = 0; i < 3; i++){
 //   for(let j = 0; j < 3; j++){
 //       var Cell = document.createElement("div");
 //       Cell.className = "cell";
 //       Cell.onclick = function cellonclick(){
 //            /* printing check on click */
 //            Cell.innerHTML = "HIIIIII";
  //          };
  //      Grid.appendChild(Cell);
 //   }
//}

let playerDiceValue = null; // store dice value
let isPlayerTurn = true;    // controls whose turn it is


// Function to roll the dice
function rollTheDice() {
    if (!isPlayerTurn || playerDiceValue !== null) return; // prevent rolling if not player's turn or dice already rolled

    setTimeout(function () {
      //  var playerDiceValue = Math.floor(Math.random() * 6) + 1;
//        var randomNumber2 = Math.floor(Math.random() * 6) + 1;

    playerDiceValue = Math.floor(Math.random() * 6) + 1;

        document.querySelector(".dice-image").setAttribute("src",
            "dice" + playerDiceValue + ".png");

 //       document.querySelector(".img2").setAttribute("src",
  //          "dice" + randomNumber2 + ".png");

    //    if (randomNumber1 === randomNumber2) {
     //       document.querySelector("h1").innerHTML = "Draw!";
     //   }

    //    else if (randomNumber1 < randomNumber2) {
     //       document.querySelector("h1").innerHTML
     //                       = (player2 + " WINS!");
    //    }

     //   else {
     //       document.querySelector("h1").innerHTML
      //                      = (player1 + " WINS!");
       // }
    }, 250);
  //  return playerDiceValue;
}

var playerScore = 0;
var cpuScore = 0;

const playerColumns = [[], [], []]; // each column stores dice values
const cpuColumns = [[], [], []];



//player grid setup
function buildGrid(gridId, clickable = false) {
    const Grid = document.getElementById(gridId);
    if (!Grid) return;

    Grid.innerHTML = "";

    for (let i = 0; i < 9; i++) {
      const Cell = document.createElement("div");

      Cell.className = "cell";
      Cell.dataset.column = i % 3; //lablling dataset column 0,1,2

      if (clickable) {
        Cell.addEventListener("click", function () {
            PlayerTurn(Cell);
          });
      }
      Grid.appendChild(Cell);
    }
}


// Build grids
buildGrid("PlayerGrid", true); // player grid clickable
buildGrid("CPUGrid", false);   // CPU grid not clickable



function removeMatchingDice(gridId, columnsArray, column, value) {
    const grid = document.getElementById(gridId);

    // remove from data
    columnsArray[column] = columnsArray[column].filter(v => v !== value); //In this column’s array, remove every die whose value equals value.
    // remove from UI
    const cells = Array.from(grid.querySelectorAll(".cell"))
        .filter(c => Number(c.dataset.column) === column);

    cells.forEach(cell => {
        const img = cell.querySelector("img");
        if (img && Number(img.dataset.value) === value) {
            cell.innerHTML = "";
        }
    });

    if (gridId === "CPUGrid") {
        cpuScore = cpuColumns.flat().reduce((s, v) => s + v, 0);
        document.getElementById("CPUScore").textContent = cpuScore;
    } else if (gridId === "PlayerGrid") {
        playerScore = playerColumns.flat().reduce((s, v) => s + v, 0);
        document.getElementById("PlayerScore").textContent = playerScore;
    }
}


function PlayerTurn(Cell){

    const column = Number(Cell.dataset.column);

    if (playerDiceValue === null) {
        alert("Roll the dice first!");
        return;
      }

    if (Cell.innerHTML === "") {
        const diceImg = document.createElement("img");
        diceImg.src = "dice" + playerDiceValue + ".png";
        diceImg.style.width = "100%";
        diceImg.style.height = "100%";
        diceImg.style.objectFit = "contain";

        Cell.appendChild(diceImg);

        playerScore += playerDiceValue;
        document.getElementById("PlayerScore").textContent = playerScore;
        diceImg.dataset.value = playerDiceValue;

        document.querySelector(".dice-image").setAttribute("src",
            "dice" + playerDiceValue + ".png");

         // store die in column
        playerColumns[column].push(playerDiceValue);

        //checking if same dice exists in cpu col
        if (cpuColumns[column].includes(playerDiceValue)) {
            //removing dice from cpu if exists in both cols
            removeMatchingDice("CPUGrid", cpuColumns, column, playerDiceValue);
        }
        //resetting dice value for next turn
        playerDiceValue = null;
        isPlayerTurn = false; // lock player turn


        // CPU's turn after a short delay
        setTimeout(function () {
            CPUturn("CPUGrid");
        }, 550); // Delay of 500 milliseconds (0.5 seconds)
      }
}

async function CPUturn(cpuGridId) {

    const cpuGrid = document.getElementById(cpuGridId);


    if (!cpuGrid) return;

    const emptyCells = Array.from(cpuGrid.querySelectorAll(".cell"))
                            .filter(c => c.innerHTML === "");

    if (emptyCells.length === 0) return;

     //rolling dice for cpu


    const cpuDiceValue = Math.floor(Math.random() * 6) + 1;

        // updating dice image to show cpu roll
    document.querySelector("#cpuDiceImage").setAttribute("src", "dice" + cpuDiceValue + ".png");

    await delay(500); //delay for effect

    //choosing random empty cell
    const chosenCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const diceImg = document.createElement("img");
    diceImg.src = "dice" + cpuDiceValue + ".png";
    diceImg.dataset.value = cpuDiceValue;

    diceImg.style.width = "100%";
    diceImg.style.height = "100%";
    diceImg.style.objectFit = "contain";


    const column = Number(chosenCell.dataset.column);
    chosenCell.appendChild(diceImg);



// updating cpu score
    cpuScore += cpuDiceValue;
    document.getElementById("CPUScore").textContent = cpuScore;
    //checking if same dice exists in player col
    if (playerColumns[column].includes(cpuDiceValue)) {
        //removing dice from player if exists in both cols
        removeMatchingDice("PlayerGrid", playerColumns, column, cpuDiceValue);
    }

    cpuColumns[column].push(cpuDiceValue);

    // Unlock player's turn
    isPlayerTurn = true;
  }

