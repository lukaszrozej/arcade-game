/* Array of levels
 * each level is an object with tje following properties:
 *  - startintColumn - column in which the player and doppelganger start the level
 *  - terrain - array of rows,
 *    each row is an array of strings,
 *    each string can be one of the following:
 *    'stone', 'grass', 'water', tree', 'door', 'rock-in'water'
 *  - landBugs - object with the following properties:
 *    - number - number of land bugs in this level
 *    - options - options for landbugs in this level:
 *      - maxSpeed - maximal speed of the bug
 *      - minSpeed - minimal speed of the bug
 *      - rows - descriptions of rows where bug can appear
 *      - rows[].row - index of a row where bug can appear
 *      - rows[].direction - direction in which the byg can move in this row (+1 or -1)
 *  - waterBugs - same as landBugs but for waterBugs
 *  - items - array of objects with the following properties:
 *    - name - name of the items
 *    - col - column of the item
 *    - row - row of the item
 *  - rocks - array of objects with the following properties:
 *    - col - column of the rock
 *    - row - row of the rock
 *  - message - message displayed at the beginning of the level
 */
const levels = [
  {
    startingColumn: 2,
    terrain: [
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'start', 'grass', 'grass', ],
    ],
    landBugs: {
      number: 3,
      options: {
        rows: [
          { row: 1, direction: 1 },
          { row: 2, direction: -1 },
          { row: 3, direction: 1 },
        ],
        maxSpeed: 300,
        minSpeed: 100,
      },
    },
    waterBugs: {
      number: 0,
    },
    items: [
      { name: 'gem-blue', col: 2, row: 3 },
    ],
    rocks: [
    ],
    message: `I'd better avoid
              these bugs.`
  },
  {
    startingColumn: 2,
    terrain: [
      ['water', 'water', 'water', 'water', 'water', ],
      ['water', 'water', 'water', 'water', 'water', ],
      ['water', 'water', 'water', 'water', 'water', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'start', 'grass', 'grass', ],
    ],
    landBugs: {
      number: 0,
    },
    waterBugs: {
      number: 6,
      options: {
        rows: [
          { row: 1, direction: -1 },
          { row: 2, direction: 1 },
          { row: 3, direction: -1 },
        ],
        maxSpeed: 200,
        minSpeed: 100,
      },
    },
    items: [
      { name: 'gem-blue', col: 2, row: 0 },
    ],
    rocks: [
    ],
    message: `I can't swim.
              Maybe I can jump
              on those bugs`
  },
  {
    startingColumn: 2,
    terrain: [
      ['water', 'water', 'water', 'water', 'water', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['water', 'water', 'water', 'water', 'water', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'start', 'grass', 'grass', ],
    ],
    landBugs: {
      number: 0,
    },
    waterBugs: {
      number: 0,
    },
    items: [
      { name: 'gem-blue', col: 2, row: 0 },
    ],
    rocks: [
      { col: 3, row: 2},
      { col: 1, row: 4},
    ],
    message: `No bugs? Maybe
              I can push the rocks
              into the water`
  },
  {
    startingColumn: 2,
    terrain: [
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'tree', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'start', 'grass', 'grass', ],
    ],
    landBugs: {
      number: 0,
    },
    waterBugs: {
      number: 0,
    },
    items: [
    ],
    rocks: [
    ],
    doppelganger: true,
    message: `My evil doppelganger!!
              If we meet we explode!`
  },
  {
    startingColumn: 2,
    terrain: [
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'water', 'grass', ],
      ['grass', 'grass', 'grass', 'water', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'start', 'grass', 'grass', ],
    ],
    landBugs: {
      number: 0,
    },
    waterBugs: {
      number: 0,
    },
    items: [
      { name: 'gem-orange', col: 0, row: 2 },
      { name: 'gem-orange', col: 1, row: 4 },
      { name: 'gem-orange', col: 4, row: 4 },
    ],
    rocks: [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 1, col: 4 },
      { row: 2, col: 4 },
      { row: 3, col: 0 },
      { row: 3, col: 1 },
      { row: 4, col: 2 },
      { row: 4, col: 3 },
    ],
    doppelganger: true,
    message: `How do I get through this
              collecting all the gems
              and not exploding?`
  },
  {
    startingColumn: 2,
    terrain: [
      ['grass', 'grass', 'tree', 'grass', 'grass', ],
      ['stone', 'stone', 'tree', 'stone', 'stone', ],
      ['grass', 'grass', 'tree', 'water', 'water', ],
      ['grass', 'grass', 'water', 'water', 'water', ],
      ['grass', 'grass', 'start', 'grass', 'grass', ],
    ],
    landBugs: {
      number: 2,
      options: {
        rows: [
          { row: 2, direction: -1 },
          { row: 2, direction: 1 },
        ],
        maxSpeed: 200,
        minSpeed: 100,
      },
    },
    waterBugs: {
      number: 1,
      options: {
        rows: [
          { row: 3, direction: -1 },
        ],
        maxSpeed: 200,
        minSpeed: 100,
      },
    },
    items: [
    ],
    rocks: [
      { col: 1, row: 1},
      { col: 1, row: 3},
    ],
    message: `???`
  },
  {
    startingColumn: 3,
    terrain: [
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['tree', 'grass', 'tree', 'tree', 'tree', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['water', 'water', 'water', 'water', 'water', ],
      ['grass', 'grass', 'tree', 'start', 'grass', ],
    ],
    landBugs: {
      number: 2,
      options: {
        rows: [
          { row: 1, direction: 1 },
        ],
        maxSpeed: 300,
        minSpeed: 100
      },
    },
    waterBugs: {
      number: 2,
      options: {
        rows: [
          { row: 4, direction: 1 },
          { row: 4, direction: -1 },
        ],
        maxSpeed: 200,
        minSpeed: 100
      },
    },
    items: [
      { name: 'gem-orange', col: 0, row: 3 },
      { name: 'gem-orange', col: 2, row: 3 },
      { name: 'gem-orange', col: 4, row: 3 },
    ],
    rocks: [
      { row: 3, col: 1 },
      { row: 3, col: 3 },
    ],
    message: `???`
  },
  {
    startingColumn: 4,
    terrain: [
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['tree', 'tree', 'tree', 'tree', 'start'],
    ],
    landBugs: {
      number: 0,
    },
    waterBugs: {
      number: 0,
    },
    doppelganger: true,
    items: [
      { name: 'gem-orange', col: 3, row: 1 },
      { name: 'gem-orange', col: 3, row: 4 },
      { name: 'gem-orange', col: 1, row: 2 },
      { name: 'gem-orange', col: 1, row: 3 },
    ],
    rocks: [
    ],
    message: `How to collect the gems
              before the doppelganger?`
  },
  {
    startingColumn: 0,
    terrain: [
      ['water', 'water', 'water', 'water', 'water', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['start', 'tree', 'tree', 'tree', 'grass', ],
    ],
    landBugs: {
      number: 3,
      options: {
        rows: [
          { row: 2, direction: 1 },
          { row: 2, direction: -1 },
          { row: 3, direction: 1 },
          { row: 3, direction: -1 },
          { row: 4, direction: 1 },
          { row: 4, direction: -1 },
        ],
        maxSpeed: 200,
        minSpeed: 100
      },
    },
    waterBugs: {
      number: 0,
    },
    items: [
    ],
    rocks: [
      { col: 3, row: 3 }
    ],
    message: `Why is this rock
              so far from here?`
  },
  {
    startingColumn: 2,
    terrain: [
      ['water', 'water', 'water', 'water', 'water', ],
      ['water', 'water', 'water', 'water', 'grass', ],
      ['grass', 'water', 'water', 'water', 'water', ],
      ['water', 'water', 'water', 'water', 'water', ],
      ['water', 'water', 'start', 'water', 'grass', ],
    ],
    landBugs: {
      number: 0,
      options: {
        rows: [
          { row: 2, direction: 1 },
          { row: 2, direction: -1 },
          { row: 3, direction: 1 },
          { row: 3, direction: -1 },
          { row: 4, direction: 1 },
          { row: 4, direction: -1 },
        ],
        maxSpeed: 200,
        minSpeed: 100
      },
    },
    waterBugs: {
      number: 4,
      options: {
        rows: [
          { row: 4, direction: -1 },
          { row: 1, direction: 1 },
        ],
        maxSpeed: 200,
        minSpeed: 100
      },
    },
    items: [
      { name: 'gem-orange', col: 4, row: 5 },
    ],
    rocks: [
      { col: 0, row: 3 },
      { col: 4, row: 2 },
      { col: 2, row: 0 },
    ],
    message: `How do I get to the gem?`
  },
 {
    startingColumn: 1,
    terrain: [
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'tree', 'water', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'tree', 'grass', ],
      ['tree', 'grass', 'grass', 'tree', 'grass', ],
      ['tree', 'start', 'grass', 'grass', 'tree', ],
    ],
    landBugs: {
      number: 0,
    },
    waterBugs: {
      number: 0,
    },
    items: [
      { name: 'gem-orange', col: 4, row: 4 },
    ],
    rocks: [
      { col: 2, row: 5 },
      { col: 1, row: 4 },
      { col: 0, row: 2 },
      { col: 1, row: 1 },
      { col: 3, row: 0 },
      { col: 3, row: 1 },
    ],
    message: `What a labiryth!`
  },
  {
    startingColumn: 4,
    terrain: [
      ['water', 'water', 'water', 'water', 'stone', ],
      ['water', 'water', 'water', 'stone', 'stone', ],
      ['stone', 'stone', 'water', 'water', 'water', ],
      ['stone', 'stone', 'water', 'water', 'water', ],
      ['grass', 'grass', 'grass', 'grass', 'start', ],
    ],
    landBugs: {
      number: 2,
      options: {
        rows: [
          { row: 4, direction: 1 },
          { row: 3, direction: 1 },
          { row: 2, direction: -1 },
        ],
        maxSpeed: 200,
        minSpeed: 100
      },
    },
    waterBugs: {
      number: 3,
      options: {
        rows: [
          { row: 4, direction: -1 },
          { row: 2, direction: 1 },
        ],
        maxSpeed: 200,
        minSpeed: 100
      },
    },
    items: [
      { name: 'gem-orange', col: 0, row: 0 },
    ],
    rocks: [
      { col: 0, row: 5 },
      { col: 3, row: 5 },
      { col: 3, row: 0 },
    ],
    message: `And bugs one more time`
  },
  {
    startingColumn: 2,
    terrain: [
      ['tree', 'door', 'grass', 'grass', 'grass', ],
      ['tree', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'tree', 'grass', 'grass', 'grass', ],
      ['water', 'tree', 'grass', 'tree', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'start', 'grass', 'grass', ],
    ],
    landBugs: {
      number: 0,
    },
    waterBugs: {
      number: 0,
    },
    items: [
       { name: 'gem-orange', col: 0, row: 5 },
       { name: 'key', col: 0, row: 2 },
    ],
    rocks: [
      { col: 1, row: 5 },
      { col: 4, row: 3 },
      { col: 3, row: 1 },
      { col: 3, row: 0 },
      { col: 4, row: 1 },
    ],
    message: `I need that key
              to open the door.`
  },
]