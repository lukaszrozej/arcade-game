/** Class representing animation of a sprite
 */
class Animation {

  /** Create an animation
   * @param {Object} props - properties of the animation
   * @param {Sprite} props.sprite - the sprite to be animated
   * @param {Object} props.from - starting position (x, y, z, a - angle) of the animation
   * @param {Object} props.to - final position (x, y, z, a - angle) of the animation
   * @param {Object} props.duration - duration of the animation
   * @param {Object} props.numberOfJumps - how many times the sprite should jump
   * @param {Object} props.heightFactor - ratio of the height of the animation to the distance covered
   */
  constructor(props) {
    Object.assign(this, {
        duration: 1,
        numberOfJumps: 1,
        heightFactor: 0,
      },
      props
    );

    this.initialized = false;
    this.done = false;
  }

  /** Initialize animation
   * @description Should be called before each animation run
   */  
  initialize() {
    this.done = false;
    this.initialized = true;

    // Set initial and final position
    Object.assign(this.sprite.position, this.from);
    const to = Object.assign({}, this.sprite.position, this.to);

    const distanceX = to.x - this.sprite.position.x;
    const distanceY = to.y - this.sprite.position.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const height = distance * this.heightFactor;

    // Set velocity and gravity
    this.sprite.v.x = (to.x - this.sprite.position.x) / this.duration;
    this.sprite.v.y = (to.y - this.sprite.position.y) / this.duration;
    this.sprite.v.a = (to.a - this.sprite.position.a) / this.duration;

    if (height === 0) {
      this.sprite.v.z = (to.z - this.sprite.position.z) / this.duration;
      this.sprite.gravity = 0;
    } else {
      const t = this.duration / this.numberOfJumps;
      this.sprite.v.z = 4 * height / t;
      this.sprite.gravity = -2 * this.sprite.v.z / t;
    }

    this.sprite.period = this.duration;
    this.sprite.resetFrames();

    this.time = 0;
  }

  /** Update the animation state
   * @param {number} dt - time since previous update
   */
  update(dt) {
    if (this.done) return;

    if (!this.initialized) {
      this.initialize();
    } else {
      this.sprite.update(dt);
      this.time += dt;

      if (this.time >= this.duration) {
        Object.assign(this.sprite.position, this.to);
        this.done = true;
        this.initialized = false;
      }
    }
  }

  /** Render the current state of the animation
   */
  render() {
    this.sprite.render();
  }
}

/** Representing collection of animations to be played in sequence
 */
class AnimationSequence {

  /** Create animationSequence
   * @param animations[] - an array of animations to played
   */
  constructor(animations) {
    this.animations = animations;
    this.initialized = false;
    this.done = false;
  }

  /** Initialize animation
   * @description Should be called before each animation run
   */  
  initialize() {
    this.done = false;
    this.initialized = true;
    this.i = 0;
    this.currentAnimation = this.animations[0];
    this.currentAnimation.initialize();
  }

  /** Update the animation state
   * @param {number} dt - time since previous update
   */
  update(dt) {
    if (this.done) return;


    if (!this.initialized) {
      this.initialize();
    } else {
      this.currentAnimation.update(dt);
      if (this.currentAnimation.done) {
        this.i++;
        if (this.i === this.animations.length) {
          this.done = true;
          this.initialized = false;
        } else {
          this.currentAnimation = this.animations[this.i];
          this.currentAnimation.initialize();
        }
      }
    }
  }

  /** Render the current state of the animation
   */
  render() {
    this.currentAnimation.render();
  }
}

/** Representing collection of animations to be played in parallel
 */
class AnimationParallel {

  /** Create animationParallel
   * @param animations[] - an array of animations to played
   */
  constructor(animations) {
    this.animations = animations;
    this.initialized = false;
    this.done = false;
  }

  /** Initialize animation
   * @description Should be called before each animation run
   */  
  initialize() {
    this.done = false;
    this.initialized = true;
    this.animations.forEach(animation => animation.initialize());
  }

  /** Update the animation state
   * @param {number} dt - time since previous update
   */
  update(dt) {
    if (this.done) return;

    if (!this.initialized) {
      this.initialize();
    } else {
      this.animations.forEach(animation => animation.update(dt));
      if (this.animations.every(animation => animation.done)) {
        this.done = true;
        this.initialized = false;
      }
    }
  }

  /** Render the current state of the animation
   */
  render(dt) {
    this.animations.forEach(animation => animation.render());
  }
}