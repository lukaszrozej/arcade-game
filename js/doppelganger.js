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

  activate() {
    this.state = 'alive';
    this.goToStartingPosition();
  }

  deactivate() {
    this.state = 'inactive';
    this.body.position = { x: -1000, y: -1000, z: 0, a: 0 };
  }

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

  say(text) {}

}
