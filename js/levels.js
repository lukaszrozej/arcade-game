const levels = [{
    terrain: [
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
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
        minSpeed: 100
      },
    },
    waterBugs: {
      number: 0,
    },
    items: [
      { name: 'gem-orange', col: 2, row: 0 },
      { name: 'gem-green', col: 3, row: 1 },
      { name: 'gem-blue', col: 0, row: 3 },
      { name: 'key', col: 4, row: 5 },
    ],
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
        maxSpeed: 300,
        minSpeed: 100,
      },
    },
    items: [
      { name: 'gem-orange', col: 2, row: 0 },
    ],
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
    landBugs: {
      number: 6,
      options: {
        rows: [
          { row: 1, direction: -1 },
          { row: 2, direction: 1 },
          { row: 3, direction: -1 },
        ],
        maxSpeed: 300,
        minSpeed: 100
      },
    },
    waterBugs: {
      number: 0,
    },
    items: [
      { name: 'gem-orange', col: 2, row: 0 },
    ],
    message: `Bugs again`
  },
]