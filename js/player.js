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
      ctx.drawImage(Resources.get(this.sprite), 202, 0, 101, 171, this.trunkX, this.trunkY, 101, 171);
      ctx.drawImage(Resources.get(this.sprite), 101, 0, 101, 171, this.headX, this.headY, 101, 171);
      break;
  }
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

    // Trunk jumping:

    // Velocity
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