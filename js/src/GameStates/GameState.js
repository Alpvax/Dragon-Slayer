class GameState {
    constructor (...handledEvents) {
        this.handledEvents = handledEvents != undefined ? handledEvents : [];
        this.player = null;
        this.name = this.constructor.name + (this.constructor == GameState ? handledEvents : "");
    }
    setPlayer (player) {
        this.player = player;
    }
    /*runState (gameStateManager, ...args) {
    }*/
}

module.exports = GameState;
