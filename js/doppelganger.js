/** Class representing player's doppelganger
 */
class Doppelganger extends Player {

  /** Create doppelganger
   * @param {string} sprite - url of the image of the player sprite
   *  The image should contain 3 sections:
   *    - top section for the whole body
   *    - middle section for the head
   *    - bottom section for the trunk
   */
  constructor(sprite = 'images/char-horn-girl.png') {
    super(sprite, { y: 0 });

    this.body.filter = 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)';
    this.head.filter = 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)';
    this.trunk.filter = 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)';

    this.lives = 100000;
    this.deactivate();
  }

  /** Activate doppelganger
   * @description Puts doppelganger onscreen,
   *  in alive state
   */
  activate() {
    this.state = 'alive';
    this.goToStartingPosition();
  }

  /** Dectivate doppelganger
   * @description Puts doppelganger offscreen,
   *  stops it's movement and interactions
   */
  deactivate() {
    this.state = 'inactive';
    this.body.position = { x: -1000, y: -1000, z: 0, a: 0 };
  }

  /** Move doppelganger
   * @description - The player moves if:
   *  - there are no rocks or items or trees ahead in the given direction
   *    and the screen doesn't end
   *  - there is a rock and it can move in the same direction, then the rock is pushed
   *  After the movement collision with doppelganger and finish of level are detected
   * @param {Object} props - parameters of the movement
   * @param {string} props.direction - direction ('up', 'down, 'left' or 'right')
   *  for doppelganger 'up' means 'down' and vice versa
   * @param {string[][]} props.terrain - terrain
   * @param {Rock[]} props.rocks - array of rocks on current level
   * @param {Object[]} props.obstackles - array of all obstackles (items, rocks, bugs) on current level
   * @param {Player} props.doppelganger - doppelganger of the player
   */
  move(props) {
    if (this.state === 'inactive') return;

    const changeDirection = {
      'up': 'down',
      'down': 'up',
      'left': 'left',
      'right': 'right',
    };

    props.direction = changeDirection[props.direction];
    super.move(props);
  }

  /** Doesn't do anyrthinh
   *  I'ts here because other functions might call say on doppelganger object
   *  and we don't want doppelganger to say anything
   */
  say(text) {}
}
