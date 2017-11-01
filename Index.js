/**Set up logging to terminal as well as chrome debug console */
require("./js/src/utils/electron-console-setup.js")({chrome: true, node: true});

const GameStateManager = require("./js/src/GameStates/GameStateManager.js");
var gsm = new GameStateManager();
//Autoload all: gsm.loadGameStates();

gsm.register(require("./js/src/GameStates/GS_StartGame.js"));
gsm.register(require("./js/src/GameStates/GS_GenerateMap.js"));
gsm.register(require("./js/src/GameStates/GS_OffPath.js"));
gsm.register(require("./js/src/GameStates/GS_Fight.js"));
gsm.register(require("./js/src/GameStates/GS_Path.js"));
gsm.register(require("./js/src/GameStates/GS_Shop.js"));
gsm.register(require("./js/src/GameStates/GS_EndGame.js"));

gsm.startGame();
