/** Class representing the player
 */
class Player {

  /** Create a player
   * @param {string} sprite - url of the image of the player sprite
   *  The image should contain 3 sections:
   *    - top section for the whole body
   *    - middle section for the head
   *    - bottom section for the trunk
   * @param {Object} startingPosition - position (x, y, z, a - angle)
   *    where the player starts level
   */
  constructor(sprite = 'images/char-horn-girl.png', startingPosition) {
    this.sprite = sprite;

    this.body = new Sprite({
      url: this.sprite,
      spriteOffset: 0,
      center: { x: 50, y: 90 },
      bottom: 102,
    });

    this.startingPosition = Object.assign({
      x: 2 * 101,
      y: 5 * 83,
      z: 0,
      a: 0,
    }, startingPosition);

    this.reset();

    this.defineAnimations();
  }

  /** Save the player's lives, score, and hasKey properties
   */
  save() {
    this.saved = {
      lives: this.lives,
      score: this.score,
      hasKey: this.hasKey,
    };
  }

  /** Restore the saved lives, score and hasKey properties
   */
  restore() {
    Object.assign(this, this.saved);
  }

  /** Reset the player's properties to their starting values
   */
  reset() {
    this.score = 0;
    this.lives = 3
    this.hasKey = false;
    this.state = 'alive';
    this.talking = false;
    this.finishedLevel = false;
    this.goToStartingPosition();
  }

  /** Update the player's state
   * @param {number} dt - time since previous update
   */
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

  /** Set the character for the player
   * @param {string} url - url of the character's image
   */
  setCharacter(url) {
    this.sprite = url;
    this.body.url = url;
    this.head.url = url;
    this.trunk.url = url;
  }

  /** Render the player
   */
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

  set row(value) {
    this.body.position.y = value * 83;
  }

  get x() {
    return this.body.position.x;
  }

  get y() {
    return this.body.position.y;
  }

  set x(value) {
    this.body.position.x = value;
  }

  set y(value) {
    this.body.position.y = value;
  }

  /** Start a level 
   * @param {number} level - index of the level in the levels array
   */
  startLevel(level) {
    this.state = 'alive';
    const x = levels[level].startingColumn * 101;
    this.startingPosition.x = x;
    this.trunkJump.to.x = x;
    this.headThrow.to.x = x;
    this.headFall.to.x = x - 50;
    this.trunkFall.to.x = x;
    this.goToStartingPosition()
    this.say(levels[level].message);
  }

  /** Move player
   * @description - The player moves if:
   *  - there are no rocks or items or trees ahead in the given direction
   *    and the screen doesn't end
   *  - there is a rock and it can move in the same direction, then the rock is pushed
   *  After the movement collision with doppelganger and finish of level are detected
   * @param {Object} params - parameter of the movement
   * @param {string} params.direction - direction ('up', 'down, 'left' or 'right')
   * @param {string[][]} params.terrain - terrain
   * @param {Rock[]} params.rocks - array of rocks on current level
   * @param {Object[]} params.obstackles - array of all obstackles (items, rocks, bugs) on current level
   * @param {Player} params.doppelganger - doppelganger of the player
   */
  move({ direction, terrain, rocks, obstacles, doppelganger, }) {
    if (this.state !== 'alive') return;

    // Don't talk when you walk :)
    this.talking = false;

    const newPosition = Object.assign({}, this.body.position);
    const rockNewPosition = { col: this.col, row: this.row };

    let explosion = false;
    switch (direction) {
      case 'left':
        if (this.col === 0) return;
        explosion = doppelganger.row === this.row && doppelganger.col === this.col - 1;
        newPosition.x -= 101;
        rockNewPosition.col -= 2;
        break;
      case 'right':
        if (this.col === 4) return;
        explosion = doppelganger.row === this.row && doppelganger.col === this.col + 1;
        newPosition.x += 101;
        rockNewPosition.col += 2;
        break;
      case 'up':
        if (this.row === 0) return;
        explosion = doppelganger.col === this.col && doppelganger.row === this.row - 1;
        newPosition.y -= 83;
        rockNewPosition.row -= 2;
        break;
      case 'down':
        if (this.row === 5) return;
        explosion = doppelganger.col === this.col && doppelganger.row === this.row + 1;
        newPosition.y += 83;
        rockNewPosition.row += 2;
        break;
    }

    if (explosion) {
      this.x = (this.x + doppelganger.x) / 2;
      doppelganger.x = this.x;
      this.y = (this.y + doppelganger.y) / 2;
      doppelganger.y = this.y;
      this.explode();
      doppelganger.explode();
    }

    const col = Math.round(newPosition.x / 101);
    const row = Math.round(newPosition.y / 83);

    if (terrain[row][col] === 'tree' || (terrain[row][col] === 'door' && !this.hasKey)) return;

    const rock = rocks.find(rock => rock.col === col && rock.row === row);

    if (!rock || rock.move(rockNewPosition, terrain, [...obstacles, doppelganger])) {
      this.body.position = newPosition;
      this.body.v.x = 0;
      if ((this.row === 0 && terrain[this.row][this.col] === 'start') || terrain[this.row][this.col] === 'door') {
        this.finishedLevel = true;
        this.score += 10;
      }
    }
  }

  /** Revive the player
    * @description It'c called after an animation of losing life finishes
    */
  revive() {
    this.state = 'alive';
    this.goToStartingPosition()
    this.say(this.message);
  }

  /** Show player's death
    * @description It'c called after an animation of losing life finishes
    *   and the player has no more life
    */
  die() {
    this.state = 'dead';
    this.animation = this.dieAnimation;
    this.animation.initialize();
  }

  /** Explode the player
   */
  explode() {
    this.lives--;
    this.state = 'killed';

    Object.assign(this.head.position, this.body.position);
    Object.assign(this.trunk.position, this.body.position);
    Object.assign(this.explosion.position, this.body.position);

    this.trunkThrow.to.x = this.col > 2 ? 0 : 404;
    this.trunkThrow.to.a = this.col > 2 ? 4 * Math.PI : -4 * Math.PI;
    this.headThrow.to.a = this.trunkThrow.to.a;

    this.animation = this.explodeAnimation;
    this.animation.initialize();

    this.message = explodeMessages[Math.floor(Math.random() * hitMessages.length)];
  }

  /** Collect an item
   * @param {Item[]} items - array of items on current level
   */
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
          break;
        case 'key':
          this.hasKey = true;
          break;
      }
      items.splice(index, 1);
    }
  }

  /** Handle collisions with bugs
   * @param {Bug[]} bugs - array of bugs on the current level
   */
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

  /** Handle terrain in current player position
   * @description If the terrain for the current player row and column
   *  is water and the player is not on a bug
   *  drowning animation is initialized
   *  Otherwise the player position snaps to grid
   * @param {string[][]} - terrain for the current level
   */
  handleTerrain(terrain) {
    if (this.state !== 'alive') return;

    // On a bug
    if (this.body.v.x !== 0) return;

    if (terrain[this.row][this.col] === 'water') {
      this.lives--;
      this.state = 'killed';

      // Start drowning animation
      Object.assign(this.splash.position, this.body.position);

      let row = this.row;
      let col = this.col;

      const floatDirection = this.body.position.y < this.startingPosition.y ? 1 : -1;

      // Find lowest water row:
      while (row < 5 && terrain[row + floatDirection][col] === 'water') {
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

      this.message = drownMessages[Math.floor(Math.random() * hitMessages.length)];
    } else {
      // Snap to grid
      this.body.position.x = this.col * 101;
    }
  }

  /** Render speach bubble
   * @param {string} text - text to be rendered in the bubble
   */
  renderSpeech(text) {

    // Split text into lines, omit unneccessary whitespace:
    const textLines = text.replace(/\n +/g, '\n').split('\n');

    // Get text width:
    ctx.font = '24px sans-serif';
    const textWidth = Math.max(...textLines.map(line => ctx.measureText(line).width));

     // Corner radius
    const radius = 25;

    const tailHeight = 50;

    // Coordinates of lower left corner
    const x = this.x > 202 ? 202 : this.x;
    const y = 5 * 83;

    // Coordinates of tip
    // const tipX = 2 * 101 + 100;
    const tipX = this.x + 100;
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

  /** Say the given text
   * @param {string} text - text text to be said by the player
   */
  say(text) {
    this.talking = true;
    this.currentText = text;
  }

  /** Go to the starting position
   */
  goToStartingPosition() {
    Object.assign(this.body.position, this.startingPosition);
    this.body.v = { x: 0, y: 0, z: 0, a: 0 }
  }

  /** Define animations
   * @description
   *  Defines sprites: head, trunk, splash, explosion
   *  that are used in animations
   *  and defines the animations themselves
   *  The animations are displayed when the player loses life
   */
  defineAnimations() {
    this.head = new Sprite({
      url: this.sprite,
      spriteOffset: 171,
      center: { x: 50, y: 60 },
      bottom: 102,
    });

    this.trunk = new Sprite({
      url: this.sprite,
      spriteOffset: 2 * 171,
      center: { x: 50, y: 90 },
      bottom: 102,
    });

    this.splash = new Sprite({
      url: 'images/splash.png',
      spriteOffset: 0,
      center: { x: 50, y: 90 },
      numberOfFrames: 9,
      period: 1,
      once: true,
    });

    this.explosion = new Sprite({
      url: 'images/explosion.png',
      spriteOffset: 0,
      center: { x: 50, y: 90 },
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
      heightFactor: 1 / 2,
    });

    this.trunkThrow = new Animation({
      sprite: this.trunk,
      to: {
        x: 4 * 101,
        y: this.startingPosition.y,
      },
      duration: 1,
      numberOfJumps: 1,
      heightFactor: 1 / 2,
    });

    this.trunkJump = new Animation({
      sprite: this.trunk,
      to: {
        x: this.startingPosition.x,
        y: this.startingPosition.y,
      },
      duration: 1,
      numberOfJumps: 4,
      heightFactor: 1 / 15,
    });

    this.hitAnimation = new AnimationParallel([
      new AnimationSequence([
        this.trunkThrow,
        this.trunkJump
      ]),
      this.headThrow,
    ]);

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
      new Animation({
        sprite: this.splash,
        duration: 1,
      }),
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

    this.explodeAnimation = new AnimationParallel([
      new AnimationSequence([
        this.trunkThrow,
        this.trunkJump
      ]),
      this.headThrow,
      new Animation({
        sprite: this.explosion,
        duration: 1,
      }),
    ]);
  }

  get dead() {
    return this.lives === 0;
  }

}

// Arrays of messages for different kinds of life losing
const hitMessages = [
  `Ouch, that hurt!`,
  `No wonder I got hit.
  I'm walking backwards.`,
  `Should I try again?
  I feel dizzy.`,
  `I get knocked down,
  Then I get up again \u266B`,
];

const drownMessages = [
  `Why didn't I learn to swim?`,
  `Something bit me.
  Piranhas?`,
  `Take me to the river \u266B`,
  `Diving for dear life
  When we could be
  diving for pearls \u266B`,
];

const explodeMessages = [
  `Dude!
  Watch were you're going!`,
  `Great balls of fire \u266B`,
  `I was afraid his head
  would land on my body.`,
  `Come on baby,
  light my fire \u266B`,
];