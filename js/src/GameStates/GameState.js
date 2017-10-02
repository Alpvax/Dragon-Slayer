const CommandParser = require("jscommand").Parser;

class GameState {
  constructor(...handledEvents) {
    this.handledEvents = handledEvents != undefined ? handledEvents : [];
    this.player = null;
    this.name = this.constructor.name + (this.constructor == GameState ? handledEvents : "");
    this.commandParser = null;
  }
  addCommand(command) {
    if (this.commandParser == null) {
      this.commandParser = new CommandParser(document.getElementById("input-text"));
    }
    this.commandParser.addCommand(command);
  }
  __runGameState(gameStateManager, ...args) {
    if (this.commandParser != null) {
      this.commandParser.activate();
    }
    this.runState(gameStateManager, ...args);
    if (this.commandParser != null) {
      this.commandParser.deactivate();
    }
  }
}

module.exports = GameState;
