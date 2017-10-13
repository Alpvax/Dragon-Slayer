const Output = require("../../Output.js");
const CreatureDb = require("../../db/Creatures.json");
// const Input_Text = document.getElementById("input-text");

var GS_EndGame = {};
var Player;

GS_EndGame.setPlayer = function (player) {
  Player = player;
}

GS_EndGame.runState = function (GameStateManager) {
  Output.addElement({
    "entity": "",
    "content": "\n\n"
  });
  endGameReport();
}

module.exports = GS_EndGame;


function endGameReport() {
  
      //Check for dragons slain
      if (Player.creaturesSlain.byType.dragon !== 0) {
        if (Player.creaturesSlain.byType.dragon === 1) {
          Output.addElement({
            "entity": "",
            "content": "You slayed a dragon."
          });
        } else if (Player.creaturesSlain.byType.dragon < 5) {
          Output.addElement({
            "entity": "",
            "content": "You are a mighty warrior, you slayed " + Player.creaturesSlain.byType.dragon + " dragons!"
          });
        } else { // dragonsSlain > 5
          Output.addElement({
            "entity": "",
            "content": "Congratulations, you are a champion. You slayed " + Player.creaturesSlain.byType.dragon + " dragons!"
          });
        }
      }
      // Check for other creatures slain
      if (Player.creaturesSlain.slainNonDragon) {
        var creaturesSlainOutput = [];
        for (let key in Player.creaturesSlain.byType) {
          if (Player.creaturesSlain.byType[key]) {
            creaturesSlainOutput.push(Player.creaturesSlain.byType[key] + " " + 
              (Player.creaturesSlain.byType[key] === 1 ? CreatureDb[key].name : CreatureDb[key].namePlural));
          }
        }
        var goldAmount = Player.inventory.getItem("gold") !== undefined ? Player.inventory.getItem("gold").quantity : "absolutely no";
        Output.addElement({
          "entity": "",
          "content": "You slayed " + creaturesSlainOutput.join(", ") + " and earned " + goldAmount + " gold."
        });
      } else {
        Output.addElement({
          "entity": "",
          "content": "You failed to slay a single creature."
        });
      }
  }
  