const ANIMATION_TIME = 0.5;
const NUM_SPRITES = 4;

var WaterBug = function(options) {
  this.sprites = 'images/water-bug.png';

  this.options = options;

  // Used to decide which animation frame to display
  this.time = 0;

  this.setToRandom();
};

// Set the enmies position and velocity to random values
// according to options
WaterBug.prototype.setToRandom = function() {
  // Row number from 1 to 3 - one of the 3 stone tracks
  const rowNumber = Math.floor(Math.random() * this.options.rows.length);
  this.row = this.options.rows[rowNumber].row;
  //velocity:
  this.v = Math.random() * (this.options.maxSpeed - this.options.minSpeed) + this.options.minSpeed;
  this.v *= this.options.rows[rowNumber].direction;
  this.x = this.v > 0 ? -202 : 606;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
WaterBug.prototype.update = function(dt) {
  this.x += this.v * dt;
  if (this.x > 606 || this.x < -202) {
    this.setToRandom();
  }

  this.time += dt;
  this.time %= ANIMATION_TIME;
};

// Draw the enemy on the screen, required method for game
WaterBug.prototype.render = function() {
  const y = this.row * 83 - 23;
  const spriteY = this.v > 0 ? 101 : 0;
  const frameNumber = Math.floor(NUM_SPRITES * this.time / ANIMATION_TIME);
  const spriteX = frameNumber * 101;
  ctx.drawImage(Resources.get(this.sprite), spriteX, spriteY, 101, 171, x, y, 101, 171);
};

WaterBug.prototype.offScreen = function() {
  return this.x < -101 || this.x > 505;
}