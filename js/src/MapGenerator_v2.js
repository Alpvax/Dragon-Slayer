const RNG = require("./src/utils/RNG.js");
const NewCreature = require("./NewCreature.js");
const CreatureDb = require("../db/Creatures.json");
const creatures = Object.keys(CreatureDb);


/* How I want it to work:

  Argument: number of starting nodes
        (in future - type of map? Forest / hills / dungeon etc?)

  Place nodes:
    Origin is at 100+10n where n is number of nodes.
    Place node between 5 and 20 tiles away from origin,
      then place nodes between 5 and 20 tiles from all other nodes (checking
      when placing whether there is another node less than 5 tiles away,
      and deleting if so).

    Extend tiles outwards from nodes, reducing chance of extending away from
      each node as it is further away.

    Check for disconnected nodes, link them (randomise link?)

  Spawn rivers: (no more than 1 per 15 tiles but rivers can split)
    Spawn bridge first, then extend upwards and downwards
      Up: if no river tile below the adjacent, have to either place above or
      to the opposite side from the one below:
        e.g.:  | |/ / <- two possible positions based on river tiles below,
               / /        note that the | | could also be \ \.
            / /

  Spawn structures:
    Not sure how to spawn structures yet... haven't designed them.
    Want to increase the spawn chances for certain creatures around structures
      because of the structures, to do this would need to change the spawn
      function.

  Spawn player:
    Find a tile at random from first node
    Check there are no structures on that tile:
      if there are structures, find another tile at random
      else place the player on the empty tile.

  Spawn creatures:
    For every tile, check whether it has:   (ignore order)
      · player
      · structures
      · terrain
    On empty tiles, use a spawn roll function to generate 0 or more creatures
      taking into account structure spawn chance modifiers.


  This will generate a 2d array of objects.
    Will use an "ascii" key in each object to show what the map should display
      on each tile.
    Maybe have blank tiles have a null option?
    
*/

function generateMap (nodes) {

  var map; // This will be a 2d array.


  // Set origin of map
  var origin = 100 + 10 * nodes; // Should allow the map to expand to fit more nodes
                                 // Note origin is both X and Y coords (0 indexed)

  // First node will be at origin                    
  var lastNodeX = origin;
  var lastNodeY = origin;

  // Array of all node coords
  var nodeList = [];

  // Place nodes, starting at origin
  // Loop through until all nodes have been placed
  for (let n = nodes; n > 0; n--) {
    map[lastNodeX][lastNodeY] = addNode();
    nodeList += [lastNodeX, lastNodeY];
  }

}

function addNode () {
  // Adds objects to map indexes to show they are nodes. These will be
  // overwritten later when tiles are populated.
  return {
    "node": true
  };
}