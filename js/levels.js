const levels = [{
    terrain: [
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['water', 'water', 'water', 'water', 'water', ],
      ['water', 'water', 'water', 'water', 'water', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
    ],
    enemyOptions: {
      rows: [
        { row: 1, direction: 1 },
        { row: 2, direction: -1 },
        { row: 3, direction: 1 },
      ],
      maxSpeed: 300,
      minSpeed: 100
    },
    numberOfEnemies: 3,
    message: `I'd better avoid
              these bugs.`
  },
  {
    terrain: [
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['water', 'water', 'water', 'water', 'water', ],
      ['water', 'water', 'water', 'water', 'water', ],
      ['water', 'water', 'water', 'water', 'water', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
    ],
    waterBugOptions: {
      rows: [
        { row: 1, direction: -1 },
        { row: 2, direction: 1 },
        { row: 3, direction: -1 },
      ],
      maxSpeed: 300,
      minSpeed: 100
    },
    numberOfWaterBugs: 3,
    numberOfEnemies: 0,
    message: `I can't swim.
              Maybe I can jump
              on those bugs`
  },
  {
    terrain: [
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
    ],
    enemyOptions: {
      rows: [
        { row: 1, direction: -1 },
        { row: 2, direction: 1 },
        { row: 3, direction: -1 },
      ],
      maxSpeed: 300,
      minSpeed: 100
    },
    numberOfEnemies: 6,
    message: `Bugs again`
  },
]