var WaterBug = function(options) {
  this.sprites = 'images/water-bug.png';

  this.options = options;

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
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.v * dt;
  if (this.x > 606 || this.x < -202) {
    this.setToRandom();
  }
};

// Draw the enemy on the screen, required method for game
WaterBug.prototype.render = function() {
  const y = this.row * 83 - 23;
  const sprite = this.v > 0 ? this.spriteRight : this.spriteLeft;
  ctx.drawImage(Resources.get(sprite), this.x, y);
};

WaterBug.prototype.offScreen = function() {
  return this.x < -101 || this.x > 505;
}