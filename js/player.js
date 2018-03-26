// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(sprite = 'images/char-boy.png') {
  this.sprite = sprite;
  this.lives = 3
  this.score = 0;
  this.state = 'alive';
  this.reset();
}

// Resets the player's position to bottom center
Player.prototype.reset = function() {
  this.row = 5;
  this.col = 2;
}

Player.prototype.update = function(dt) {
  switch (this.state) {
    case 'hit':
      const FINAL_X = 101 * 2;
      const FINAL_Y = 83 * 5 - 40;
      if (this.headY < FINAL_Y) {
        this.trunkX += dt * this.trunkVX;
        this.headX += dt * this.headVX;
        this.headY += dt * this.v;
        this.trunkY = this.headY;
        this.v += dt * this.a;

        this.alpha += dt * this.omega;

      } else if ((FINAL_X - this.trunkX) * this.trunkJumpV > 0){
        this.trunkX += dt * this.trunkJumpV;
        this.trunkY = -20 * Math.abs(Math.sin((this.trunkX - this.trunkJumpStartX) * 4 * Math.PI / 202)) + FINAL_Y;
      } else {
        this.state = 'alive';
        this.reset();
      }
      break;
  }  
}

Player.prototype.render = function() {
  switch (this.state) {
    case 'alive':
      const x = 101 * this.col;
      const y = 83 * this.row - 40;
      ctx.drawImage(Resources.get(this.sprite), 0, 0, 101, 171, x, y, 101, 171);
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
  }
this.say('Hello!');

}

Player.prototype.handleInput = function(input) {
  if (this.dead) return;
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
  if (this.row === 0) {
    this.score++;
    this.reset();
  }
}

Player.prototype.checkCollisions = function(enemies) {
  if (this.state !== 'alive') return;

  const collision = enemy =>
    enemy.row === this.row && Math.abs(enemy.x - 101 * this.col) < 60;
  const enemy = enemies.find(collision);

  if (enemy) {
    this.lives--;
    this.state = 'hit';

    // Trunk and head falling:

    // Time it takes the head and trunk to fly to the bottom
    const TIME = 1;

    // Horizontal motion has constant velocity

    // Initial position
    this.headX = 101 * this.col;
    this.trunkX = 101 * this.col;

    // Final position
    const FINAL_HEAD_X = 101 * 2;
    const FINAL_TRUNK_X = enemy.v > 0 ? 101 * 4 : 0;

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

    // Rotation of head and trunk is the same, but in oposite diractions

    // Initial angle:
    this.alpha = 0;

    const NUMBER_OF_ROTATIONS = 2;
    const DIRECTION = (enemy.v > 0 ? 1 : -1);

    // Angular velocity:
    this.omega = DIRECTION * 2 * Math.PI * NUMBER_OF_ROTATIONS / TIME;

    // Trunk jumping:

    // Constant horizontal velocity
    this.trunkJumpV = (FINAL_HEAD_X - FINAL_TRUNK_X) / TIME;

    // Initial horizontal jumping position
    this.trunkJumpStartX = FINAL_TRUNK_X;
  }
}

Player.prototype.loseLife = function() {
  this.lives--;
  this.reset();
}

Object.defineProperty(Player.prototype, 'dead', {
  get() {
    return this.lives === 0;
  }
});

Player.prototype.say = function(text) {

  // Speach bubble:
  // adapted from: http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html

  // Bubble dimensions
  const width = 290;
  const height = 100;

  // Coordinates of lower left corner
  const x = 202;
  const y = 5 * 83;

  const tailHeight = 50;

  // Coordinates of tip
  const tipX = 2 * 101 + 100;
  const tipY = y + tailHeight;

  // Corner radius
  const radius = 25;

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
  ctx.font = '24px sans-serif';
  ctx.fillStyle = 'black';

  ctx.fillText(text, x + radius / 2, y - height + radius / 2);
}