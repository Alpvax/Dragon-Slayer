const EventEmitter = require("events");
const fs = require("fs"); //For walking the GameStates dir
const path = require("path");
const GameState = require("./GameState.js");

const ENABLE_LOAD_STATE_DEBUG = false;

class GameStateManager extends EventEmitter {
  constructor() {
    super();
    this.loading = [];
  }
  loadGameStates(walkDir, recurse) {
    if (!walkDir) {
      walkDir = path.relative(process.cwd(), __dirname);
    }
    var manager = this;
    if (ENABLE_LOAD_STATE_DEBUG) console.debug("Loading GameStates from %s", walkDir);
    var p = new Promise(function (resolve, reject) {
      fs.readdir(walkDir, function (err, files) {
        Promise.all(files.map((file) => loadFile(manager, walkDir, file, recurse))).then(resolve);
      });
    });
    p.then(() => this.loading = this.loading.filter(e => e !== p));
    this.loading.push(p);
    return p;
  }
  register(gamestate) {
    var activateGameState = (data) => gamestate.__runGameState(this, data);

    var gsName = gamestate.name || gamestate;
    for (let handler of gamestate.handledEvents) {
      let runArgs = [this];
      if (typeof (handler) == "string") {
        if (ENABLE_LOAD_STATE_DEBUG) console.debug("Registering game state \"%s\" as a handler for \"%s\".", gsName, handler);
        this.on(handler, activateGameState);
      } else {
        let key = handler.event;
        let val = handler.callback || handler.args;
        if (ENABLE_LOAD_STATE_DEBUG) console.debug("Registering game state \"%s\" as a handler for \"%s\" with arguments %O.", gsName, key, val);
        if (typeof (val) == "function") {
          this.on(key, val);
        } else {
          this.on(key, (data) => gamestate.__runGameState.apply(this, runArgs.concat(val, data)));
        }
      }
    }
  }
  startGame() {
    Promise.all(this.loading).then(() => {
      if (ENABLE_LOAD_STATE_DEBUG) console.debug("Starting game");
      this.emit("start");
    });
  }
}

function loadFile(manager, directory, name, recurse) {
  return new Promise(function (resolve) {
    var filePath = path.join(directory, name);
    fs.stat(filePath, function (error, stat) {
      if (error) {
        console.error("Error stating file.", error);
        resolve();
      } else if (recurse && stat.isDirectory()) {
        manager.loadGameStates(filePath, recurse);
      } else if (stat.isFile() && /^GS_.+\.js$/.test(name)) {
        let reqPath = "./" + path.relative(__dirname, filePath);
        let gamestate = require(path.join(process.cwd(), filePath));
        if (!(gamestate instanceof GameState)) {
          console.warn("Skipping loading %s due to it not being an instance of GameState.", filePath);
        } else {
          if (!gamestate.name) {
            gamestate.name = path.basename(filePath, ".js"); //.replace(/^(?:.+\/)?GS_(.+)\.js$/, "$1");
          }
          if (ENABLE_LOAD_STATE_DEBUG) console.debug("Loading game state from file \"%s\" as \"%s\".", filePath, gamestate.name);
          manager.register(gamestate);
        }
      }
      resolve();
    });
  });
}

module.exports = GameStateManager;
