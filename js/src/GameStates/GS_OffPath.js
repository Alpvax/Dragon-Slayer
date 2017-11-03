const GameState = require("./GameState.js");
const GameData = require("../GameData.js");
const MovePlayer = require("../MovePlayer.js");
const EventEmitter = require("events").EventEmitter;
const Input_Text = document.getElementById("input-text");
const Output = require("../../Output.js");
const DrawMap = require("../DrawMap.js");
const Look = require("../Look.js");
const DisplayInventory = require("../DisplayInventory.js");
const RNG = require("../utils/RNG.js");
const ItemDb = require("../../db/Items.json");

//const CommandMove


var GS_OffPath = new GameState("generated", "exitShop", "win", "run");
GS_OffPath.addCommand(new (require("../command/CommandMove.js"))());
var GameStateManager;

var commands = [
  "attack",
  "fight",
  "move",
  "walk",
  "go",
  "north",
  "south",
  "east",
  "west",
  "look",
  "rest",
  "take",
  "potion",
  "drink potion"
];

var directions = [
  "around",
  "north",
  "south",
  "east",
  "west"
];

// Receive command
function getInputAndParse(e) {
  if (e.keyCode === 13) {
    e.preventDefault();

    let text = Input_Text.value;

    if (text) {
      Output.addElement({
        "entity": GameData.player.name,
        "content": text
      });
      // Parse and process command
      // Parse(text, Player, CurrentMap);

      var command = text.toLowerCase().split(" ");

      commandParse(command, 0)
      // Input_Text.removeEventListener("keydown", getInputAndParse);
    }

    Input_Text.value = "";
    // tabCompletion.enteredText = "";
    // tabCompletion.currentIndex = 0;

  } else if (e.keyCode === 37) { // Left arrow key
    e.preventDefault();
    commandParse(["west"], 0);
  } else if (e.keyCode === 38) { // Up arrow key
    e.preventDefault();
    commandParse(["north"], 0);
  } else if (e.keyCode === 39) { // Right arrow key
    e.preventDefault();
    commandParse(["east"], 0);
  } else if (e.keyCode === 40) { // Down arrow key
    e.preventDefault();
    commandParse(["south"], 0);
  } else if (e.keyCode === 9) {
    let text = Input_Text.value;
    Input_Text.value = tabComplete(text);


    // } else if (e.keyCode === 9) {
    //   let text = Input_Text.value;
    //   if (text === "") {
    //     validCompletions = commands.slice();
    //   } else {
    //     if (validCompletions.length === 0) {
    //       var command = text.toLowerCase().split("");
    //       var validCompletions = [];
    //       for (let option in commands) {
    //         if (option.startsWith(text)) {
    //           validCompletions.push(option);
    //         }
    //       }
    //       Input_Text.value = validCompletions[]
    //     } else {
    //       validCompletions.shift();
    //     }
    //   }
  }
}

GS_OffPath.runState = function (manager) {
  GameStateManager = manager;
  DrawMap(GameData.currentMap);
  console.log(this);
  // Initialise above function
  //Input_Text.addEventListener("keydown", getInputAndParse);
}

module.exports = GS_OffPath;


function commandParse(input, index) {
  let playerTile = GameData.getPlayerTile();
  switch (input[index]) {
    case "attack":
    case "fight":
      if (playerTile.creature) {
        Input_Text.removeEventListener("keydown", getInputAndParse);
        let messagePicker = Math.round(RNG(playerTile.creature.messages.onSpawn.length - 1));
        Output.addElement({
          "entity": "",
          "content": playerTile.creature.messages.onSpawn[messagePicker]
        });
        GameStateManager.emit("fight", {
          creature: playerTile.creature,
          aggressor: "player"
        });

      } else {
        Output.addElement({
          "entity": "Error:",
          "content": "There's nothing here to attack!"
        });
      }
      break;
    case "walk":
    case "move":
    case "go":
      if (directions.includes(input[1])) {
        commandParse(input, 1);
      } else {
        Output.addElement({
          "entity": "",
          "content": input[0] + " where?"
        });
      }
      break;
    case "north":
      // Player position before move: check if at North edge
      if (GameData.player.position - GameData.currentMap.sideLength < 0) {
        Output.addElement({
          "entity": "",
          "content": "Walking North, you think you see the edge of the trees but emerge instead in more dense forest."
        });
        GameStateManager.emit("atMapEdge", {edge: "south"});
      } else {
        MovePlayer(GameData.currentMap, "north", GameData.player);
        playerTile = GameData.getPlayerTile();//Update player tile
        DrawMap(GameData.currentMap);
        if (playerTile.creature) {
          Output.addElement({
            "entity": "",
            "content": "There is a " + playerTile.creature.name + " here."
          });

        }
        if (playerTile.creature && playerTile.creature.attributes.aggressive) {
          enterAttackState();
        }
      }
      break;
    case "south":
      //Player position before move: check if at South edge
      if (GameData.player.position + GameData.currentMap.sideLength >= GameData.currentMap.length) {
        Output.addElement({
          "entity": "",
          "content": "Walking South, you think you see the edge of the trees but emerge instead in more dense forest."
        });
        GameStateManager.emit("atMapEdge", {edge: "north"});
      } else {
        MovePlayer(GameData.currentMap, "south", GameData.player);
        playerTile = GameData.getPlayerTile();//Update player tile
        DrawMap(GameData.currentMap);
        if (playerTile.creature) {
          Output.addElement({
            "entity": "",
            "content": "There is a " + playerTile.creature.name + " here."
          });

        }
        if (playerTile.creature && playerTile.creature.attributes.aggressive) {
          enterAttackState();
        }
      }
      break;
    case "east":
      //Player position before move: check if at East edge
      if ((GameData.player.position + 1) % GameData.currentMap.sideLength === 0) {
        Output.addElement({
          "entity": "",
          "content": "Walking East, you think you see the edge of the trees but emerge instead in more dense forest."
        });
        GameStateManager.emit("atMapEdge", {edge: "west"});
      } else {
        MovePlayer(GameData.currentMap, "east", GameData.player);
        playerTile = GameData.getPlayerTile();//Update player tile
        DrawMap(GameData.currentMap);
        if (playerTile.creature) {
          Output.addElement({
            "entity": "",
            "content": "There is a " + playerTile.creature.name + " here."
          });

        }
        if (playerTile.creature && playerTile.creature.attributes.aggressive) {
          enterAttackState();
        }
      }
      break;
    case "west":
      //Player position before move: check if at West edge
      if (GameData.player.position % GameData.currentMap.sideLength === 0) {
        Output.addElement({
          "entity": "",
          "content": "Walking West, you think you see the edge of the trees but emerge instead in more dense forest."
        });
        GameStateManager.emit("atMapEdge", {edge: "east"});
      } else {
        MovePlayer(GameData.currentMap, "west", GameData.player);
        playerTile = GameData.getPlayerTile();//Update player tile
        DrawMap(GameData.currentMap);
        if (playerTile.creature) {
          Output.addElement({
            "entity": "",
            "content": "There is a " + playerTile.creature.name + " here."
          });

        }
        if (playerTile.creature && playerTile.creature.attributes.aggressive) {
          enterAttackState();
        }
      }
      break;
    case "look":
      if (directions.includes(input[1])) {
        Look(GameData.currentMap, input[1], GameData.player);
        DrawMap(GameData.currentMap);
      } else if (input[1] === "at") {
        commandParse(["look", input[2]], 0);
      } else {
        Output.addElement({
          "entity": "",
          "content": "Look at what? Try a direction, or \"look around\" for the surroundings."
        });

      }
      break;
    case "potion":
      drinkPotion();
      break;
    case "drink":
      if (input[1] === "potion") {
        drinkPotion();
      } else if (input.length > 1) {
        Output.addElement({
          "entity": "",
          "content": "You can't drink the " + input[1].toLowerCase() + "!"
        });
      } else {
        Output.addElement({
          "entity": "Error:",
          "content": "Drink what?"
        });
      }
      break;
    case "rest":
      if (GameData.player.hasRested) {
        Output.addElement({
          "entity": "",
          "content": "You already feel well rested, resting more will not help you."
        });
      } else {
        rest();
      }
      break;
    case "take":
    case "get":
    case "pickup":
    case "grab":
      if (playerTile.items) {
        var itemNames = [];
        for (let item in playerTile.items) {
          itemNames.push(ItemDb[playerTile.items[item].key].name);
          itemNames.push(ItemDb[playerTile.items[item].key].namePlural);
        }
        if (itemNames.includes(input[1])) {
          var index = itemNames.indexOf(input[1]) % 2 === 0 ? itemNames.indexOf(input[1]) : itemNames.indexOf(input[1]) - 1;
          var key = playerTile.items[index].key;
          GameData.player.inventory.addItem(playerTile.items[index]);
          Output.addElement({
            "entity": "",
            "content": "You pick up " + playerTile.items[index].quantity + " " + (playerTile.items[index].quantity > 1 ? ItemDb[playerTile.items[index].key].namePlural : ItemDb[playerTile.items[index].key].name) + "."
          });
          playerTile.items.splice(index, 1);
          DrawMap(GameData.currentMap);
        } else if (input[1] === "all" || input[1] === undefined) {
          if (playerTile.items) {
            for (let i = playerTile.items.length - 1; i >= 0; i--) {
              GameData.player.inventory.addItem(playerTile.items[i]);
              Output.addElement({
                "entity": "",
                "content": "You pick up " + playerTile.items[i].quantity + " " + (playerTile.items[i].quantity > 1 ? ItemDb[playerTile.items[i].key].namePlural : ItemDb[playerTile.items[i].key].name) + "."
              });
              playerTile.items.splice(i, 1);
              DrawMap(GameData.currentMap);
            }
          } else {
            Output.addElement({
              "entity": "",
              "content": "There isn't anything here to take."
            });
          }
        } else {
          Output.addElement({
            "entity": "",
            "content": "There isn't a " + input[1] + " here to take."
          });
        }
      } else {
        Output.addElement({
          "entity": "",
          "content": "There isn't anything here to take."
        });
      }
      DisplayInventory(GameData.player);
      break;
    case "restart":
      Input_Text.removeEventListener("keydown", getInputAndParse);
      GameStateManager.emit("start");
      break;
    case "?":
    case "help":
      Output.addElement({
        "entity": "Help:",
        "content": "To move, enter compass directions or use the arrow keys. Enter [ attack ] to fight a creature, [ look ] to see what's around you and [ NEW MAP ] to spawn in a new map."
      });
      break;
    // case "NEW":
    //   if (input[1] === "MAP") {
    //     GameStateManager.emit("playerCreated", {
    //       player: Player
    //     });
    //   } else {
    //     Output.addElement({
    //       "entity": "Error:",
    //       "content": "I don't know what a new " + input[1].toLowerCase() + " is!"
    //     });
    //   }
    //   break;
    default:
      Output.addElement({
        "entity": "Error:",
        "content": "Unknown command, type \"help\" or \"?\" for help."
      });
  }
}

function enterAttackState() {
  // Aggressive creatures attack on sight
  Input_Text.removeEventListener("keydown", getInputAndParse);
  let playerTile = GameData.getPlayerTile();
  let messagePicker = Math.round(RNG(playerTile.creature.messages.onSpawn.length - 1));
  Output.addElement({
    "entity": "",
    "content": playerTile.creature.messages.onSpawn[messagePicker]
  });
  GameStateManager.emit("fight", {
    creature: playerTile.creature,
    aggressor: "creature"
  });
}

function drinkPotion() {
  if (GameData.player.isFullHealth) {
    Output.addElement({
      "entity": "",
      "content": "You already have full health!"
    });
  } else {
    let potions = GameData.player.inventory.getItem("potion");
    if (potions.quantity > 0) {
      let amountHealed = GameData.player.heal(Math.round(50 + GameData.player.attributes.level * GameData.player.attributes.level));
      potions.quantity--;
      Output.addElement({
        "entity": "",
        "content": "You drink a potion, restoring " + amountHealed + "HP. You have " + potions.quantity + " potions remaining."
      });
      DisplayInventory(GameData.player);
    } else {
      Output.addElement({
        "entity": "",
        "content": "You have no potions left to drink!"
      });
    }
  }
}

function rest() {
  if(GameData.player.isFullHealth) {
    Output.addElement({
      "entity": "",
      "content": "You already have full health!"
    });
  } else {
    let amount = Math.round(RNG((0.01 * GameData.player.attributes.totalHP), (0.08 * GameData.player.attributes.totalHP)));
    let amountHealed = GameData.player.heal(amount);
    Output.addElement({
      "entity": "",
      "content": "You sit and rest for a while, regaining " + amountHealed + "HP."
    });
    DisplayInventory(GameData.player);
    GameData.player.hasRested = true;
  }
/*
  if (GameDate.player.attributes.currentHP >= GameDate.player.attributes.totalHP) { // Don't heal at full HP
    Output.addElement({
      "entity": "",
      "content": "You already have full health!"
    });
  } else if (GameDate.player.attributes.currentHP >= GameDate.player.attributes.totalHP - (0.08 * Player.attributes.totalHP)) { // Heal up to full HP but not over it (with limit of 8HP)
    let healing = Math.round(RNG(1, (Player.attributes.totalHP - Player.attributes.currentHP)));
    Player.attributes.currentHP += healing;
    Output.addElement({
      "entity": "",
      "content": "You sit and rest for a while, regaining " + healing + "HP."
    });
    DisplayInventory(Player);
  } else { // Heal up to 8HP
    let healing = Math.round(RNG((0.01 * Player.attributes.totalHP), (0.08 * Player.attributes.totalHP)));
    Player.attributes.currentHP += healing;
    Output.addElement({
      "entity": "",
      "content": "You sit and rest for a while, regaining " + healing + "HP."
    });
    DisplayInventory(Player);
  }*/
}


function tabComplete(text) {
  text = text.toLowerCase();

  matchedCommands = [];

  for (let command of commands) {
    let possible = true;

    let i = 0;
    while (i < command.length && i < text.length) {
      if (text.charAt(i) === command.charAt(i)) {
        i++;
      } else {
        possible = false;
        break;
      }
    }

    if (possible) {
      matchedCommands.push(command);
    }
  }

  return matchedCommands;
}
