// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(sprite = 'images/char-horn-girl.png') {
  this.sprite = sprite;
  this.reset();
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
    case 'hit':
      if (this.headY < FINAL_Y) {
        // Falling phase
        this.trunkX += dt * this.trunkVX;
        this.headX += dt * this.headVX;
        this.headY += dt * this.v;
        this.trunkY = this.headY;
        this.v += dt * this.a;

        this.alpha += dt * this.omega;

      } else if ((FINAL_X - this.trunkX) * this.trunkJumpV > 0) {
        // Trunk jumping phase
        this.trunkX += dt * this.trunkJumpV;
        this.trunkY = -20 * Math.abs(Math.sin((this.trunkX - this.trunkJumpStartX) * 4 * Math.PI / 202)) + FINAL_Y;
      } else {
        // Coming back to life
        this.state = 'alive';
        this.say(hitTexts[Math.floor(Math.random() * hitTexts.length)]);
        this.row = 5;
        this.col = 2;
      }
      break;
    case 'drown':
      this.depth += dt * this.v;
      this.frame += dt * this.frameRate;
      if (this.frame >= 8) {
        this.state = 'emerge trunk';
        this.depth = 30;
        this.v = 20;
        this.trunkY = this.row * 83 - 10 + 30;
        this.trunkX = this.col * 101;
      }
      break;
    case 'emerge trunk':
      this.depth -= dt * this.v;
      this.trunkY -= dt * this.v;
      if (this.depth <= 0) {
        this.state = 'jump trunk';
        const trunkTime = 1;
        this.trunkJumpStartY = this.trunkY;
        this.distanceY = (FINAL_Y - this.trunkY);
        this.trunkVX = (FINAL_X - this.trunkX) / trunkTime;
        this.trunkVY = (FINAL_Y - this.trunkY) / trunkTime;
        this.yOffset = 0;
      }
      break;
    case 'jump trunk':
      this.trunkX += dt * this.trunkVX;
      this.trunkY += dt * this.trunkVY;
      this.yOffset = -20 * Math.abs(Math.sin((this.trunkY - this.trunkJumpStartY) * 4 * Math.PI / this.distanceY))
      if (this.trunkY > FINAL_Y) {
        this.state = 'emerge head';
        this.headX = this.col * 101;
        this.headY = this.row * 83 + 30;
        
        this.alpha = 0;
        this.omega = Math.PI / 2;

        this.rotationXOffset = this.col > 2 ? 17 : 101 - 17; 
        this.rotationYOffset = 105;
        

      }
      break;
    case 'emerge head':
      this.alpha += dt * this.omega;
      if (this.alpha >= Math.PI) {
        this.state = 'roll head';
        this.headX += this.col > 2 ? -45 : 45;
        this.headY -= 23;
        this.alpha = Math.PI / 2;
        this.rotationXOffset = 50;
        this.rotationYOffset = 95;

        this.headVX = (FINAL_X - this.headX) / 1;
        this.headVY = (FINAL_Y - this.headY) / 1;

        this.omega = 3 * Math.PI / 2 / 1;
      }
      break;
    case 'roll head':
      this.headX += dt * this.headVX;
      this.headY += dt * this.headVY;
      this.alpha += dt * this.omega;
      if (this.alpha >= 2 * Math.PI) {
        this.state = 'alive';
        this.row = 5;
        this.col = 2;
      }
      break;
  }
}

Player.prototype.render = function() {
  const x = 101 * this.col;
  const y = 83 * this.row - 40;
  switch (this.state) {
    case 'alive':
      ctx.drawImage(Resources.get(this.sprite), 0, 0, 101, 171, x, y, 101, 171);

      if (this.talking) {
        this.renderSpeech(this.currentText);
      }
      break;
    case 'hit':
      ctx.save();
      ctx.translate(this.trunkX + 50, this.trunkY + 130);
      ctx.rotate(this.alpha);
      ctx.drawImage(Resources.get(this.sprite), 202, 0, 101, 171, -50, -130, 101, 171);
      ctx.restore();

      ctx.save();
      ctx.translate(this.headX + 50, this.headY + 100);
      ctx.rotate(-this.alpha);
      ctx.drawImage(Resources.get(this.sprite), 101, 0, 101, 171, -50, -100, 101, 171);
      ctx.restore();
      break;
    case 'drown':
      ctx.drawImage(Resources.get(this.sprite), 0, 0, 101, 171 - this.depth - 34, x, y + this.depth, 101, 171 - this.depth - 34);
    // Splash sprites from here:
    // https://daveriskit.wordpress.com/2015/02/07/animated-gif-maker/
      const xOffset = Math.floor(this.frame) * 101;
      ctx.drawImage(Resources.get('images/splash.png'), xOffset, 0, 101, 171, x, y + 30, 101, 171);
      break;
    case 'emerge trunk':
      ctx.drawImage(Resources.get(this.sprite), 202, 0, 101, 171 - this.depth - 30, this.trunkX, this.trunkY, 101, 171 - this.depth - 30);
      break;
    case 'jump trunk':
      ctx.drawImage(Resources.get(this.sprite), 202, 0, 101, 171, this.trunkX, this.trunkY + this.yOffset, 101, 171);
      break;
    case 'emerge head':

      ctx.drawImage(Resources.get(this.sprite), 202, 0, 101, 171, this.trunkX, this.trunkY, 101, 171);


      ctx.save()

      const clipY = this.row * 83 + 134;
      ctx.beginPath();
      ctx.moveTo(0, clipY);
      ctx.lineTo(5 * 101, clipY);
      ctx.lineTo(5 * 101, clipY - 100);
      ctx.lineTo(0, clipY - 100);
      ctx.lineTo(0, clipY);
      ctx.closePath();
      ctx.clip();

      ctx.save();
      ctx.translate(this.headX + this.rotationXOffset, this.headY + this.rotationYOffset);

      this.beta = this.col > 2 ? Math.PI / 2 - this.alpha : this.alpha - Math.PI / 2;
      ctx.rotate(this.beta);

      ctx.drawImage(Resources.get(this.sprite), 101, 0, 101, 171, -this.rotationXOffset, -this.rotationYOffset, 101, 171);
      ctx.restore();


      ctx.restore();
      break;
    case 'roll head':

      ctx.drawImage(Resources.get(this.sprite), 202, 0, 101, 171, this.trunkX, this.trunkY, 101, 171);

      ctx.save();
      ctx.translate(this.headX + this.rotationXOffset, this.headY + this.rotationYOffset);

      this.beta = this.col > 2 ? - this.alpha : this.alpha;
      ctx.rotate(this.beta);

      ctx.drawImage(Resources.get(this.sprite), 101, 0, 101, 171, -this.rotationXOffset, -this.rotationYOffset, 101, 171);
      ctx.restore();

      ctx.fillStyle = 'green';
      ctx.fillRect(this.headX, this.headY, 3, 3);
      ctx.fillStyle = 'red';
      ctx.fillRect(this.headX + this.rotationXOffset, this.headY + this.rotationYOffset, 3, 3);

      break;
  }
}

Player.prototype.handleInput = function(input) {
  if (this.dead || this.frozen) return;

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

Player.prototype.handleCollisions = function(bugs) {
  if (this.state !== 'alive') return;

  const collision = bug =>
    bug.row === this.row && Math.abs(bug.x - 101 * this.col) < 60;
  const bug = bugs.find(collision);

  if (bug) {
    this.lives--;
    this.state = 'hit';

    // Trunk and head falling:

    // Time it takes the head and trunk to fly to the bottom
    const TIME = 1;

    // Horizontalinetion has constant velocity

    // Initial position
    this.headX = 101 * this.col;
    this.trunkX = 101 * this.col;

    // Final position
    const FINAL_HEAD_X = 101 * 2;
    const FINAL_TRUNK_X = bug.v > 0 ? 101 * 4 : 0;

    // Horizontal velocities
    this.headVX = (FINAL_HEAD_X - this.headX) / TIME;
    this.trunkVX = (FINAL_TRUNK_X - this.trunkX) / TIME;

    // Vertical motion of head and trunk is the same
    // Vertical acceleration and initial velocity formulas
    // derived from conservation of energy and
    // equation of uniformly accelerated motion

    // Initial position
    this.headY = 83 * this.row - 40;
    this.trunkY = this.headY;

    // Final position
    const FINAL_Y = 83 * 5 - 40;

    // How high they will fly above the initial position
    const HEIGHT = 50;

    // How low they will land below the initial position
    const DEPTH = FINAL_Y - this.headY;

    // Vertical initial velocity
    this.v = -2 * HEIGHT * (1 + Math.sqrt(1 + DEPTH / HEIGHT)) / TIME;

    // Vertical acceleration
    this.a = this.v * this.v / (2 * HEIGHT);

    // Head and trunk rotating

    // Rotation of head and trunk is the same, but in oposite directions

    // Initial angle:
    this.alpha = 0;

    const NUMBER_OF_ROTATIONS = 2;
    const DIRECTION = (bug.v > 0 ? 1 : -1);

    // Angular velocity:
    this.omega = DIRECTION * 2 * Math.PI * NUMBER_OF_ROTATIONS / TIME;

    // Trunk jumping:

    // Constant horizontal velocity
    this.trunkJumpV = (FINAL_HEAD_X - FINAL_TRUNK_X) / TIME;

    // Initial horizontal jumping position
    this.trunkJumpStartX = FINAL_TRUNK_X;
  }
}

Player.prototype.handleTerrain = function(terrain) {
  if (this.state !== 'alive') return;
  if (terrain[this.row][this.col] === 'water') {
    this.lives--;
    this.state = 'drown';

    this.frame = 0;
    this.frameRate = 8;

    this.depth = 0;
    this.v = 400;

    // Find lowest water row:
    while (terrain[this.row + 1][this.col] === 'water') {
      this.row++;
    }
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

const hitTexts = [
  `Ouch, that hurt!`,
  `No wonder I got hit.
  I'm walking backwards.`,
  `Should I try again?
  I feel dizzy.`,
  `I get knocked down,
  Then I get up again \u266B`
];