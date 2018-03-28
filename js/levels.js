const levels = [{
    rowImages: [
      'images/stone-block.png',
      'images/stone-block.png',
      'images/stone-block.png',
      'images/grass-block.png',
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
    rowImages: [
      'images/water-block.png',
      'images/water-block.png',
      'images/water-block.png',
      'images/grass-block.png',
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
    numberOfWaterBugs: 6,
    message: `I can't swim.
              Maybe I can jump
              on those bugs`
  },
  {
    rowImages: [
      'images/stone-block.png',
      'images/stone-block.png',
      'images/stone-block.png',
      'images/grass-block.png',
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