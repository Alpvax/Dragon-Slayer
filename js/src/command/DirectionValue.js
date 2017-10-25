const {CommandValue} = require("jscommand");

class DirectionValue extends CommandValue {
    constructor () {
        super("direction", {
            "north": ["north", "up"],
            "south": ["south", "down"],
            "east": ["east", "right"],
            "west": ["west", "left"]
        });
    }
}