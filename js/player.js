class Player {
    constructor(sprite = 'images/char-horn-girl.png') {
    this.sprite = sprite;

    this.body = new Sprite({
      url: this.sprite,
      spriteOffset: 0,
      center: { x: 50,  y: 90 },
      bottom: 102,
    });

    this.startingPosition = {
      x: 2 * 101,
      y: 5 * 83,
      z: 0,
      a: 0,
    };

    this.reset();

    this.defineAnimations();
  }

  // Resets the player's position to bottom center
  reset() {
    this.score = 0;
    this.lives = 3
    this.state = 'alive';
    this.talking = false;
    this.finishedLevel = false;
    this.goToStartingPosition();
  }

  update(dt) {
    switch (this.state) {
      case 'alive':
        this.body.update(dt);
        if (this.body.position.x < 0) {
          this.body.position.x = 0;
          this.body.v.x = 0;
        }
        if (this.body.position.x > 404) {
          this.body.position.x = 404;
          this.body.v.x = 0;
        }
        break;
      case 'killed':
        this.animation.update(dt);

        if (this.animation.done) {
          if (this.lives > 0) {
            this.revive();
          } else {
            this.die();
          }
        }
        break;
      case 'dead':
        this.animation.update(dt);
        break;
    }
  }

  setCharacter(url) {
    this.sprite = url;
    this.body.url = url;
    this.head.url = url;
    this.trunk.url = url;
  }

  render() {
    switch (this.state) {
      case 'dead':
      case 'killed':
        this.animation.render();
        break;
      case 'alive':
        this.body.render();

        if (this.talking) {
          this.renderSpeech(this.currentText);
        }
        break;
    }
  }

  get row() {
    return Math.round(this.body.position.y / 83); 
  }

  get col() {
    return Math.round(this.body.position.x / 101); 
  }

  move({direction, terrain, rocks, obstacles}) {
    if (this.state !== 'alive') return;

    // Don't talk when you walk :)
    this.talking = false;

    const newPosition = Object.assign({}, this.body.position);
    const rockNewPosition = { col: this.col, row: this.row };

    switch (direction) {
      case 'left':
        if (this.col === 0) return;
        newPosition.x -= 101;
        rockNewPosition.col -= 2;
        break;
      case 'right':
        if (this.col === 4) return;
        newPosition.x += 101;
        rockNewPosition.col += 2;
        break;
      case 'up':
        if (this.row === 0) return;
        newPosition.y -= 83;
        rockNewPosition.row -= 2;
        break;
      case 'down':
        if (this.row === 5) return;
        newPosition.y += 83;
        rockNewPosition.row += 2;
        break;
    }

    const col = Math.round(newPosition.x / 101);
    const row = Math.round(newPosition.y / 83);

    const rock = rocks.find(rock => rock.col === col && rock.row === row);

    if(!rock || rock.move(rockNewPosition, terrain, obstacles)) {
      this.body.position = newPosition;
      this.body.v.x = 0;
      if (this.col === 2 && this.row === 0) {
        this.finishedLevel = true;
      }
    }
  }

  revive() {
    this.state = 'alive';
    this.goToStartingPosition()
    this.say(this.message);
  }

  die() {
    this.state = 'dead';
    this.animation = this.dieAnimation;
    this.animation.initialize();
  }

  currentPosition() {
    return {
      x: this.col * 101,
      y: this.row * 83,
      z: 0,
      a: 0,
    }
  }

  collect(items) {
    const index = items.findIndex(item => item.row === this.row && item.col === this.col);
    if (index >= 0) {
      switch (items[index].name) {
        case 'gem-orange':
            this.score++;
          break;
        case 'gem-green':
            this.lives++;
          break;
        case 'gem-blue':
            this.score++;
            // this.finishedLevel = true;
          break;
        case 'key':
          break;
      }
      items.splice(index, 1);
    }
  }

  handleCollisions(bugs) {
    if (this.state !== 'alive') return;

    const collision = bug =>
      bug.row === this.row && Math.abs(bug.x - this.body.position.x) < 60;
    const bug = bugs.find(collision);

    if (bug === undefined) return;

    if (bug.type === 'land') {
      this.lives--;
      this.state = 'killed';

      Object.assign(this.head.position, this.body.position);
      Object.assign(this.trunk.position, this.body.position);

      this.trunkThrow.to.x = bug.v > 0 ? 404 : 0;
      this.trunkThrow.to.a = bug.v > 0 ? 4 * Math.PI : -4 * Math.PI;
      this.headThrow.to.a = -this.trunkThrow.to.a;

      this.animation = this.hitAnimation;
      this.animation.initialize();

      this.message = hitMessages[Math.floor(Math.random() * hitMessages.length)];
    } else {
      this.body.v.x = bug.v;
    }
  }

  handleTerrain(terrain) {
    if (this.state !== 'alive') return;

    // On a bug
    if (this.body.v.x !== 0) return;

    if (terrain[this.row][this.col] === 'water') {
      this.lives--;
      this.state = 'killed';

      Object.assign(this.splash.position, this.body.position);

      let row = this.row;
      let col = this.col;

      const floatDirection = this.body.position.y < this.startingPosition.y ? 1 : -1;

      // Find lowest water row:
      while (row < 5 && terrain[row + 1][col] === 'water') {
        // row++;
        row += floatDirection;
      }
      // Find leftmost water cell:
      while (col > 0 && terrain[row][col - 1] === 'water') {
        col--;
      }
      this.headEmerge.from = { x: col * 101, y: row * 83, z: -70, a: -Math.PI, };

      // Find rightmost water cell:
      while (col < 4 && terrain[row][col + 1] === 'water') {
        col++;
      }
      this.trunkEmerge.from = { x: col * 101, y: row * 83, z: -20, a: 0, };

      this.headThrow.to.a = 4 * Math.PI;

      this.animation = this.drownAnimation;
      this.animation.initialize();

      this.message = hitMessages[Math.floor(Math.random() * hitMessages.length)];
    } else {
      // Snap to grid
      this.body.position.x = this.col * 101;
    }
  }

  renderSpeech(text) {

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

  say(text) {
    this.talking = true;
    this.currentText = text;
  }

  goToStartingPosition() {
    Object.assign(this.body.position, this.startingPosition);
    this.body.v = { x: 0, y: 0, z: 0, a: 0 }
  }

  defineAnimations() {
    this.head = new Sprite({
      url: this.sprite,
      spriteOffset: 171,
      center: { x: 50,  y: 60 },
      bottom: 102,
    });

    this.trunk = new Sprite({
      url: this.sprite,
      spriteOffset: 2 * 171,
      center: { x: 50,  y: 90 },
      bottom: 102,
    });

    this.splash = new Sprite({
      url: 'images/splash.png',
      spriteOffset: 0,
      center: { x: 50,  y: 90 },
      numberOfFrames: 9,
      period: 1,
      once: true,
    });

    this.explosion = new Sprite({
      url: 'images/explosion.png',
      spriteOffset: 0,
      center: { x: 50,  y: 90 },
      numberOfFrames: 32,
      period: 2,
      once: true,
    });

    this.headThrow = new Animation({
      sprite: this.head,
      to: {
        x: this.startingPosition.x,
        y: this.startingPosition.y,
      },
      duration: 1,
      numberOfJumps: 1,
      heightFactor: 1/2,
    });

    this.trunkThrow = new Animation({
      sprite: this.trunk,
      to: {
        x: 4 * 101,
        y: this.startingPosition.y,
      },
      duration: 1,
      numberOfJumps: 1,
      heightFactor: 1/2,
    });

    this.trunkJump = new Animation({
      sprite: this.trunk,
      to: {
        x: this.startingPosition.x,
        y: this.startingPosition.y,
      },
      duration: 1,
      numberOfJumps: 4,
      heightFactor: 1/15,
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
      to: {
        z: 0,
        a: 0,
      },
      duration: 0.5,
    });

    this.trunkEmerge = new Animation({
      sprite: this.trunk,
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

    this.headFall = new Animation({
      sprite: this.head,
      from: {
        a: 0,
      },
      to: {
        x: this.startingPosition.x - 50,
        y: this.startingPosition.y,
        z: -10,
        a: -Math.PI,
      },
      duration: 0.5,
    });

    this.trunkFall = new Animation({
      sprite: this.trunk,
      from: {
        a: 0,
      },
      to: {
        x: this.startingPosition.x,
        y: this.startingPosition.y,
        z: 0,
        a: -Math.PI / 4,
      },
      duration: 0.5,
    });

    this.dieAnimation = new AnimationParallel([
      this.trunkFall,
      this.headFall,
    ]);

    this.explosionAnimation = new Animation({
      sprite: this.explosion,
      duration: 1,
    });

    this.explodeAnimation = new AnimationParallel([
      new AnimationSequence([
        this.trunkThrow,
        this.trunkJump
      ]),
      this.headThrow,
      this.explosionAnimation,
    ]);
  }

  get dead() {
    return this.lives === 0;
  }

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
