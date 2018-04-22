/** Class representing an item placed on the terrain
 */
class Item {

  /** Create an item
   * @param {Object} props - properties of the item
   * @param {string} name - name of the item
   * @param {number} col - column number of the item
   * @param {number} row - row number of the item
   */
  constructor(props) {
    Object.assign(this,
                 { name: 'gem-orange', col: 2, row: 0 },
                   props
    );
    this.url = `images/${this.name}.png`;
  }

  /** Render the item
   */
  render() {
    ctx.drawImage(Resources.get(this.url),
                  0, 0, 101, 171,
                  this.col * 101, this.row * 83, 101, 171);
  }
}

/** Class representing a rock
 */
class Rock extends Item {

  /** Create a rock
   * @param {Object} props - properties of the rock
   * @param {number} col - column number of the rock
   * @param {number} row - row number of the rock
   */
  constructor(props) {
    props.name = 'rock';
    super(props);

    this.splashAnimation = new Animation({
      sprite: new Sprite({
        url: 'images/big-splash.png',
        spriteOffset: 0,
        center: { x: 50,  y: 90 },
        numberOfFrames: 9,
        period: 1,
        once: true,
      }),
      duration: 1,
    });
  }

  /** Move the rock
   * @description The rock moves to the given position if:
   *  - the positions not offscreen and
   *  - no obstacle is at the position and
   *  - the terrain at the position is not a tree or door
   * If the terrain at the position is water the rock submerges into water:
   *  - the terrain changes to 'rock-in-water'
   *  - the rock moves offscreen
   * @param {Object} position - coordinates of the destination of the movement
   * @param {number} position.col - column of the destination of the movement
   * @param {number} position.row - row of the destination of the movement
   * @param {string[][]} terrain - terrain of the current level
   * @param {Object[]} obstacles - obstacles that might prevent the movement (items, bugs, rocks)
   */
  move(position, terrain, obstacles) {
    if (position.col < 0
      || position.col > 4
      || position.row < 0
      || position.row > 5
      || obstacles.find(obstacle =>
          obstacle.row === position.row && obstacle.col === position.col
        )
      || terrain[position.row][position.col] === 'tree'
      || terrain[position.row][position.col] === 'door'
    ) return false;

    this.row = position.row;
    this.col = position.col;

    if (terrain[this.row][this.col] === 'water') {
      
      terrain[this.row][this.col] = 'rock-in-water';

      this.splashAnimation.from = { x: this.col * 101, y: this.row * 83 };
      this.splashAnimation.initialize();

      this.row = -1;
      this.col = -1;
    }

    return true;
  }

  /** Update the state of the rock
   * @description Used only to show animation of rock falling into water
   * @param {number} dt - time since previous update
   */
  update(dt) {
    if (this.splashAnimation.initialized) {
      this.splashAnimation.update(dt);
    }
  }

  /** Render the rock
   */
  render() {
    if (this.splashAnimation.done) return;

    if (this.splashAnimation.initialized) {
      this.splashAnimation.render();
    } else {
      super.render();
    }
  }
}