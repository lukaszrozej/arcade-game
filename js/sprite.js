/** Class representing a sprite
 *  - a collection of frames that are rendered in a sequence and can move around the screen
 */
class Sprite {

  /** Create a sprite
   * @param {Object} props - properties of the sprite
   * @param {string} props.url - url of the image containing sprite frames
   * @param {number} props.spriteOffset - distance from the top of the image to the top of the frames
   * @param {Object} props.center - coordinates of the point around which rotation occurs
   * @param {number} props.bottom - distance from the top of the frame to the bottom of the entity depicted (used for clipping)
   * @param {number} props.numberOfFrames - number of frames
   * @param {number} props.period - time it takes to go through all the frames
   * @param {boolean} props.once - true if frames should be render once and not cycled through
   * @param {string} props.filter - filter that is applied to when rendering
   * @param {string} props.position - position (x, y, z and a - angle) of the sprite
   * @param {string} props.v - velocity (x, y, z and a - angle) of the sprite
   * @param {string} props.gravity - acceleration in the z direction
  */
  constructor(props) {
    Object.assign(this, {
        position: { x: 0, y: 0, z: 0, a: 0, },
        v: { x: 0, y: 0, z: 0, a: 0, },
        gravity: 0,
        period: 1,
        numberOfFrames: 1,
        once: true,
        spriteOffset: 0,
        center: { x: 0,  y: 0 },
        bottom: 171,
        filter: '',
      },
      props
    );

    this.resetFrames();
  }


  /** Reset the frames state so that they'll start from the begining
   */
  resetFrames() {
    this.frameTime = this.period / this.numberOfFrames;
    this.frame = 0;
    this.time = 0;
    this.done = false;
  }

  /** Update the position, velocity and frame of the sprite
   * @param {number} dt - time since the previous update
   */
  update(dt) {
    // Bounce of the floor
    if (this.position.z < 0 && this.gravity !== 0) {
      this.position.z = 0;
      this.v.z = -this.v.z;
    } else {
      this.v.z += dt * this.gravity;
    }

    // Update position
    this.position.x += dt * this.v.x;
    this.position.y += dt * this.v.y;
    this.position.z += dt * this.v.z;
    this.position.a += dt * this.v.a;

    if (this.done) return;

    // Update frame
    this.time += dt;
    if (this.once && this.time >= this.period) {
      this.done = true;
      this.frame = this.numberOfFrames - 1;
      return;
    }
    this.time %= this.period;
    this.frame = Math.floor(this.time / this.frameTime)
  }

  /** Render the sprite on screen
   */
  render() {
    ctx.save();

    ctx.filter = this.filter;

    if (this.position.z < 0 && this.gravity === 0) {
      const clipY = this.position.y + this.bottom;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, clipY);
      ctx.lineTo(ctx.canvas.width, clipY);
      ctx.lineTo(ctx.canvas.width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.clip();
    }

    ctx.translate(this.position.x + this.center.x, this.position.y - this.position.z + this.center.y);
    ctx.rotate(this.position.a);
    ctx.drawImage(Resources.get(this.url),
                  this.frame * 101, this.spriteOffset, 101, 171,
                  -this.center.x, -this.center.y, 101, 171);
    ctx.restore();
  }
}
