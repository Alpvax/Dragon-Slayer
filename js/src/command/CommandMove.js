const Command = require("jscommand").Command;

class CommandMove extends Command {
    constructor () {
        super("move", "go", "walk");
    }
    matches (input) {

    }
}
