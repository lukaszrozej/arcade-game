// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.spriteRight = 'images/bug-right.png';
  this.spriteLeft = 'images/bug-left.png';

  this.setToRandom();
};

// Default options for enemies
//  rows - array of object each with 2 properties:
//    row - unmber of a row where enemy can be
//    direction - drection of movement on that row
// The enemy's speed will be  random value
// taken uniformly from the interval: [minSpeed, maxSpeed)
Enemy.prototype.options = {
  rows: [
    { row: 1, direction: 1 },
    { row: 2, direction: 1 },
    { row: 3, direction: 1 },
  ],
  maxSpeed: 300,
  minSpeed: 100
};

// Set the enmies position and velocity to random values
// according to options
Enemy.prototype.setToRandom = function() {
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
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.v * dt;
  if (this.x > 606 || this.x < -202) {
    this.setToRandom();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  const y = this.row * 83 - 23;
  const sprite = this.v > 0 ? this.spriteRight : this.spriteLeft;
  ctx.drawImage(Resources.get(sprite), this.x, y);
};

Enemy.prototype.offScreen = function() {
  return this.x < -101 || this.x > 505;
}