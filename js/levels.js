const levels = [
  {
    terrain: [
      // ['grass', 'grass', 'grass', 'grass', 'grass', ],
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
    terrain: [
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
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
      { name: 'gem-blue', col: 2, row: 3 },
    ],
    rocks: [
      { col: 0, row: 1},
      { col: 3, row: 1},
    ],
    doppelganger: true,
    message: `My evil doppelganger!!
              I should avoid him`
  },
  {
    terrain: [
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['stone', 'stone', 'stone', 'stone', 'stone', ],
      ['grass', 'grass', 'grass', 'grass', 'grass', ],
      ['grass', 'grass', 'start', 'grass', 'grass', ],
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
      { name: 'gem-blue', col: 2, row: 0 },
    ],
    rocks: [],
    message: `Bugs again`
  },
]