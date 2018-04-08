// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(sprite = 'images/char-horn-girl.png') {
  this.sprite = sprite;
  this.reset();

  this.trunk = {
    sprite: {
      url:  this.sprite,
      offset: { x: 202, y: 0 },
      center: { x: 50,  y: 125 },
    },
    position: {},
  }

  this.head = {
    sprite: {
      url:  this.sprite,
      offset: { x: 101, y: 0 },
      center: { x: 50,  y: 95 },
    },
    position: {},
  }

  this.defineAnimations();
}

// Resets the player's position to bottom center
Player.prototype.reset = function() {
  this.score = 0;
  this.lives = 3
  this.state = 'alive';
  this.talking = false;
  this.frozen = false;
  this.finishedLevel = false;
  this.row = 5;
  this.col = 2;
}

Player.prototype.update = function(dt) {
  const FINAL_X = 101 * 2;
  const FINAL_Y = 83 * 5 - 40;
  switch (this.state) {
    case 'killed':
      this.animation.update(dt);

console.log('splash:   ', this.splashAnimation.to)

      if (this.animation.done) {
        this.revive();
      }
      break;
  }
}

Player.prototype.render = function() {
  const x = 101 * this.col;
//******!!!!!!!!!!
  // const y = 83 * this.row - 40;
  const y = 83 * this.row;
  switch (this.state) {
    case 'killed':
      this.animation.render();
      break;
    case 'alive':
      ctx.drawImage(Resources.get(this.sprite), 0, 0, 101, 171, x, y, 101, 171);

      if (this.talking) {
        this.renderSpeech(this.currentText);
      }
      break;
  }
}

Player.prototype.handleInput = function(input) {
  if (this.dead || this.frozen) return;
  if (this.state !== 'alive') return;

  // Don't talk when you walk :)
  this.talking = false;

  switch (input) {
    case 'left':
      if (this.col > 0) this.col -= 1;
      break;
    case 'right':
      if (this.col < 4) this.col += 1;
      break;
    case 'up':
      if (this.row > 0) this.row -= 1;
      break;
    case 'down':
      if (this.row < 5) this.row += 1;
      break;
  }
  if (this.row === 0 && this.col === 2) {
    this.finishedLevel = true;
    this.score++;
    // this.reset();
  }
}

Player.prototype.revive = function() {
  this.state = 'alive';
  this.row = 5;
  this.col = 2;
  this.say(this.message);
}

Player.prototype.currentPosition = function() {
  return {
    x: this.col * 101,
    y: this.row * 83,
  }
}

Player.prototype.handleCollisions = function(bugs) {
  if (this.state !== 'alive') return;

  const collision = bug =>
    bug.row === this.row && Math.abs(bug.x - 101 * this.col) < 60;
  const bug = bugs.find(collision);

  if (bug) {
    this.lives--;
    this.state = 'killed';

    this.head.position = this.currentPosition();
    this.trunk.position = this.currentPosition();

    this.trunkThrow.to.x = bug.v > 0 ? 404 : 0;
    this.trunkThrow.to.angle = bug.v > 0 ? 4 * Math.PI : -4 * Math.PI;
    this.headThrow.to.angle = -this.trunkThrow.to.angle;

    this.animation = this.hitAnimation;
    this.animation.initialize();

    this.message = hitMessages[Math.floor(Math.random() * hitMessages.length)];
  }
}

Player.prototype.handleTerrain = function(terrain) {
  if (this.state !== 'alive') return;
  if (terrain[this.row][this.col] === 'water') {
    this.lives--;
    this.state = 'killed';

    Object.assign(this.body.position, this.currentPosition());
    Object.assign(this.splash.position, this.currentPosition());

    this.body.position.z = 0;

    // Find lowest water row:
    while (this.terrain[this.row + 1][this.col] === 'water') {
      this.row++;
    }
    // Find leftmost water cell:
    while (this.col > 0 && this.terrain[this.row][this.col - 1] === 'water') {
      this.col--;
    }
    Object.assign(this.headEmerge.from, this.currentPosition());

    // Find leftmost water cell:
    while (this.col < 4 && this.terrain[this.row][this.col + 1] === 'water') {
      this.col++;
    }
    Object.assign(this.trunkEmerge.from, this.currentPosition());

    this.headThrow.to.angle = 4 * Math.PI;

//******!!!!!!!!!!
    // this.animation = this.drownedAnimation;
    this.animation = this.drownAnimation;
    this.animation.initialize();

console.log(this.splash.position)

    this.message = hitMessages[Math.floor(Math.random() * hitMessages.length)];
  }
}

Object.defineProperty(Player.prototype, 'dead', {
  get() {
    return this.lives === 0;
  }
});

Player.prototype.renderSpeech = function(text) {

  // Split text into lines, omit unneccessary whitespace:
  const textLines = text.replace(/\n +/g, '\n').split('\n');

  // Get text width:
  ctx.font = '24px sans-serif';
  const textWidth = Math.max(...textLines.map(line => ctx.measureText(line).width));

  // Speech bubble:
  // adapted from: http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html

  // Corner radius
  const radius = 25;

  const tailHeight = 50;

  // Coordinates of lower left corner
  const x = 202;
  const y = 5 * 83;

  // Coordinates of tip
  const tipX = 2 * 101 + 100;
  const tipY = y + tailHeight;

  // Bubble dimensions
  const MIN_WIDTH = tipX - x + tailHeight / 2 + radius;
  const width = textWidth + radius > MIN_WIDTH ? textWidth + radius : MIN_WIDTH;
  const height = textLines.length * 30 + radius;


  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  // tail left edge
  ctx.quadraticCurveTo(tipX + tailHeight / 4, y + tailHeight / 2, tipX, y);
  ctx.lineTo(x + radius, y);
  // bottom left corner
  ctx.quadraticCurveTo(x, y, x, y - radius);
  ctx.lineTo(x, y - height + radius);
  // upper left corner
  ctx.quadraticCurveTo(x, y - height, x + radius, y - height);
  ctx.lineTo(x + width - radius, y - height);
  // upper right corner
  ctx.quadraticCurveTo(x + width, y - height, x + width, y - height + radius);
  ctx.lineTo(x + width, y - radius);
  // bottom right corner
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(tipX + tailHeight / 2, y);
  // tail right edge
  ctx.quadraticCurveTo(tipX + tailHeight * 3 / 4, y + tailHeight / 2, tipX, tipY);
  ctx.closePath();

  ctx.lineWidth = 10;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.fillStyle = 'white';
  ctx.fill();

  // Text:

  ctx.textBaseline = 'top';
  ctx.textAlign = 'start';
  ctx.fillStyle = 'black';

  textLines.forEach((line, index) => {
    ctx.fillText(line, x + radius / 2, y - height + radius / 2 + index * 30);
  });
}

Player.prototype.say = function(text) {
  this.talking = true;
  this.currentText = text;
}

Player.prototype.freeze = function() {
  this.frozen = true;
}

Player.prototype.unfreeze = function() {
  this.frozen = false;
}

Player.prototype.defineAnimations = function() {
  // this.trunkThrow = new Throw({
  //   object: this.trunk,
  //   to: {
  //     x: 0,
  //     y: 5 * 83 - 40,
  //     angle: 2 * Math.PI,
  //   },
  //   height: 50,
  //   duration: 1,
  // });

  // this.trunkJump = new Jump({
  //   object: this.trunk,
  //   to: {
  //     x: 2 * 101,
  //     y: 5 * 83 - 40,
  //   },
  //   height: 30,
  //   numberOfJumps: 4,
  //   duration: 1,
  // });

  // this.headThrow = new Throw({
  //   object: this.head,
  //   to: {
  //     x: 2 * 101,
  //     y: 5 * 83 - 40,
  //     angle: 2 * Math.PI,
  //   },
  //   height: 50,
  //   duration: 1,
  // });

  // this.trunkEmerge = new Emerge({
  //   object: this.trunk,
  //   change: {
  //     x: 0,
  //     y: -20,
  //     angle: 0,
  //   },
  //   duration: 0.5,
  //   clipY: 4 * 83 + 45,
  // });

  // this.headEmerge = new Emerge({
  //   object: this.head,
  //   change: {
  //     x: 40,
  //     y: -60,
  //     angle: Math.PI,
  //   },
  //   duration: 0.5,
  //   clipY: 4 * 83 + 45,
  // });

  // this.splash = new Splash({
  //   url: 'images/splash.png',
  //   position: {
  //     x: 202,
  //     y: 2 * 83,
  //   },
  //   duration: 1,
  //   numberOfFrames: 9,
  // });

  // this.drownedAnimation = new AnimationSequence([
  //   this.splash,
  //   new AnimationParallel([
  //     new AnimationSequence([
  //       this.trunkEmerge,
  //       this.trunkJump,
  //     ]),
  //     new AnimationSequence([
  //       this.headEmerge,
  //       this.headThrow,
  //     ]),
  //   ]),
  // ]);


  // this.hitAnimation = new AnimationParallel([
  //   new AnimationSequence([
  //     this.trunkThrow,
  //     this.trunkJump
  //   ]),
  //   this.headThrow,
  // ]);

//******

this.head = new Sprite({
  url: this.sprite,
  spriteOffset: 171,
  center: { x: 50,  y: 60 },
  bottom: 102,
  numberOfFrames: 1,
  period: 1,
  once: true,
});

this.trunk = new Sprite({
  url: this.sprite,
  spriteOffset: 2 * 171,
  center: { x: 50,  y: 90 },
  bottom: 102,
  numberOfFrames: 1,
  period: 1,
  once: true,
});

this.body = new Sprite({
  url: this.sprite,
  spriteOffset: 0,
  center: { x: 50,  y: 90 },
  bottom: 102,
  numberOfFrames: 1,
  period: 1,
  once: true,
});

this.splash = new Sprite({
  url: 'images/splash.png',
  spriteOffset: 0,
  center: { x: 50,  y: 90 },
  numberOfFrames: 9,
  period: 1,
  once: true,
});

this.headThrow = new Animation({
  sprite: this.head,
  to: {
    x: 2 * 101,
    y: 5 * 83,
    a: 4 * Math.PI,
  },
  duration: 1,
  numberOfJumps: 1,
  height: 100,
});

this.trunkThrow = new Animation({
  sprite: this.trunk,
  to: {
    x: 4 * 101,
    y: 5 * 83,
    a: 0,
  },
  duration: 1,
  numberOfJumps: 1,
  height: 100,
});

this.trunkJump = new Animation({
  sprite: this.trunk,
  to: {
    x: 2 * 101,
    y: 5 * 83,
  },
  duration: 1,
  numberOfJumps: 4,
  height: 15
});

this.hitAnimation = new AnimationParallel([
  new AnimationSequence([
    this.trunkThrow,
    this.trunkJump
  ]),
  this.headThrow,
]);

this.splashAnimation = new Animation({
  sprite: this.splash,
  duration: 1,
});

this.submerge = new Animation({
  sprite: this.body,
  to: {
    z: -70,
  },
  duration: 0.3,
});

this.headEmerge = new Animation({
  sprite: this.head,
  from: {
    x: 0,
    y: 3 * 83,
    z: -70,
    a: -Math.PI,
  },
  to: {
    z: 0,
    a: 0,
  },
  duration: 0.5,
});

this.trunkEmerge = new Animation({
  sprite: this.trunk,
  from: {
    x: 404,
    y: 3 * 83,
    z: -20,
    a: 0,
  },
  to: {
    z: 0,
  },
  duration: 0.5,
});


this.drownAnimation = new AnimationSequence([
  this.submerge,
  this.splashAnimation,
  new AnimationParallel([
    new AnimationSequence([
      this.trunkEmerge,
      this.trunkJump,
    ]),
    new AnimationSequence([
      this.headEmerge,
      this.headThrow,
    ]),
  ]),
]);

}

const hitMessages = [
  `Ouch, that hurt!`,
  `No wonder I got hit.
  I'm walking backwards.`,
  `Should I try again?
  I feel dizzy.`,
  `I get knocked down,
  Then I get up again \u266B`
];
