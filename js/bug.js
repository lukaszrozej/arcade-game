/** Class representing a bug
 */
class Bug {

  /** Create a bug
   * @param {string} type - type of the bug ('land-bug' or 'water-bug')
   * @param {Object} options - options for bug position and velocity
   * @param {number} options.maxSpeed - maximal speed of the bug
   * @param {number} options.minSpeed - minimal speed of the bug
   * @param {Object[]} options.rows - descriptions of rows where bug can appear
   * @param {number} options.rows[].row - index of a row where bug can appear
   * @param {number} options.rows[].direction - direction in which the byg can move in this row (+1 or -1)
   */
  constructor(type, options) {
    this.type = type;
    this.options = options;

    this.sprite = new Sprite({
      url: `images/${type}-bug.png`,
      numberOfFrames: type === 'land' ? 1 : 4,
      period: 0.5,
      once: false,
    });

    this.setToRandom();
  };

  /** Set random velocity and offscreen position of the bug
   */
  setToRandom() {
    const rowNumber = Math.floor(Math.random() * this.options.rows.length);
    const direction = this.options.rows[rowNumber].direction;

    this.sprite.position.x = direction > 0 ? -202 : 606;
    this.sprite.position.y = this.options.rows[rowNumber].row * 83;

    this.sprite.v.x = Math.random() * (this.options.maxSpeed - this.options.minSpeed) + this.options.minSpeed;
    this.sprite.v.x *= direction

    this.sprite.spriteOffset = direction > 0 ? 0 : 171;
  }

  /** Update the bug state
   * @param {number} dt - time since previous update
   */
  update(dt) {
    this.sprite.update(dt);

    if (this.sprite.position.x > 606 || this.sprite.position.x < -202) {
      this.setToRandom();
    }
  };

  /** Check terrain collisions
   * @description
   *  Check if the bug doesn't bump into terrain it's not allowed to move on: 
   *    - anything non-water for water-bugs
   *    - trees, door or water for land-bugs
   */
  checkTerrain(terrain) {
    const col = this.sprite.v.x > 0
                ? Math.ceil(this.sprite.position.x / 101)
                : Math.floor(this.sprite.position.x / 101);
    
    if (col < 0 || col > 4) return;

    const spot = terrain[this.row][col];

    if ((this.type === 'water' && spot !== 'water')
        || this.type === 'land' && (spot === 'water' || spot === 'tree')) {
      this.v *= -1;
    }
  }

  render() {
    this.sprite.render();
  };

  offScreen() {
    return this.sprite.position.x < -101 || this.sprite.position.x > 505;
  }

  get row() {
    return Math.floor(this.sprite.position.y / 83);
  }

  get col() {
    return Math.round(this.sprite.position.x / 101);
  }

  get x() {
    return this.sprite.position.x;
  }

  get v() {
    return this.sprite.v.x;
  }

  set v(value) {
    this.sprite.v.x = value;
    this.sprite.spriteOffset = this.sprite.v.x > 0 ? 0 : 171;
  }

}