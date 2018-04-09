class Player {
    constructor(sprite = 'images/char-horn-girl.png') {
    this.sprite = sprite;

    this.body = new Sprite({
      url: this.sprite,
      spriteOffset: 0,
      center: { x: 50,  y: 90 },
      bottom: 102,
    });


    this.reset();

    this.defineAnimations();
  }

  // Resets the player's position to bottom center
  reset() {
    this.score = 0;
    this.lives = 3
    this.state = 'alive';
    this.talking = false;
    this.frozen = false;
    this.finishedLevel = false;
    this.goToStartingPosition();
  }

  update(dt) {
    const FINAL_X = 101 * 2;
    const FINAL_Y = 83 * 5 - 40;
    switch (this.state) {
      case 'killed':
        this.animation.update(dt);

        if (this.animation.done) {
          this.revive();
        }
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
      case 'killed':
        this.animation.render();
        break;
      case 'alive':
        // ctx.drawImage(Resources.get(this.sprite), 0, 0, 101, 171, x, y, 101, 171);
        this.body.render();

        if (this.talking) {
          this.renderSpeech(this.currentText);
        }
        break;
    }
  }

  handleInput(input) {
    if (this.dead || this.frozen) return;
    if (this.state !== 'alive') return;

    // Don't talk when you walk :)
    this.talking = false;

    switch (input) {
      case 'left':
        if (this.col > 0) {
          this.col -= 1;
          this.body.position.x -= 101;
        }
        break;
      case 'right':
        if (this.col < 4) {
          this.col += 1;
          this.body.position.x += 101;
        }
        break;
      case 'up':
        if (this.row > 0) {
          this.row -= 1;
          this.body.position.y -= 83;
        }
        break;
      case 'down':
        if (this.row < 5) {
          this.row += 1;
          this.body.position.y += 83;
        }
        break;
    }
    if (this.row === 0 && this.col === 2) {
      this.finishedLevel = true;
      this.score++;
    }
  }

  revive() {
    this.state = 'alive';
    this.goToStartingPosition()
    this.say(this.message);
  }

  currentPosition() {
    return {
      x: this.col * 101,
      y: this.row * 83,
      z: 0,
      a: 0,
    }
  }

  handleCollisions(bugs) {
    if (this.state !== 'alive') return;

    const collision = bug =>
      bug.row === this.row && Math.abs(bug.x - this.body.position.x) < 60;
    const bug = bugs.find(collision);

    if (bug) {
      this.lives--;
      this.state = 'killed';

      this.head.position = this.currentPosition();
      this.trunk.position = this.currentPosition();

      this.trunkThrow.to.x = bug.v > 0 ? 404 : 0;
      this.trunkThrow.to.a = bug.v > 0 ? 4 * Math.PI : -4 * Math.PI;
      this.headThrow.to.a = -this.trunkThrow.to.a;

      this.animation = this.hitAnimation;
      this.animation.initialize();

      this.message = hitMessages[Math.floor(Math.random() * hitMessages.length)];
    }
  }

  handleTerrain(terrain) {
    if (this.state !== 'alive') return;
    if (terrain[this.row][this.col] === 'water') {
      this.lives--;
      this.state = 'killed';

      Object.assign(this.splash.position, this.body.position);

      // Find lowest water row:
      while (this.terrain[this.row + 1][this.col] === 'water') {
        this.row++;
      }
      // Find leftmost water cell:
      while (this.col > 0 && this.terrain[this.row][this.col - 1] === 'water') {
        this.col--;
      }
      this.headEmerge.from = Object.assign({}, this.currentPosition(), { z: -70, a: -Math.PI, });

      // Find leftmost water cell:
      while (this.col < 4 && this.terrain[this.row][this.col + 1] === 'water') {
        this.col++;
      }
      this.trunkEmerge.from = Object.assign({}, this.currentPosition(), { z: -20, });

      this.headThrow.to.a = 4 * Math.PI;

      this.animation = this.drownAnimation;
      this.animation.initialize();

      this.message = hitMessages[Math.floor(Math.random() * hitMessages.length)];
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

  freeze() {
    this.frozen = true;
  }

  unfreeze() {
    this.frozen = false;
  }

  goToStartingPosition() {
    this.row = 5;
    this.col = 2;
    this.body.position = { x: 2 * 101, y: 5 * 83, z: 0, a: 0 };
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

    this.headThrow = new Animation({
      sprite: this.head,
      to: {
        x: 2 * 101,
        y: 5 * 83,
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
