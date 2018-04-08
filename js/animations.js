class Animation {
  constructor(props) {
    Object.assign(this, {
        duration: 1,
        numberOfJumps: 1,
        height: 0,
      },
      props
    );

    this.initialized = false;
    this.done = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;

    // Set initial and final position
    Object.assign(this.sprite.position, this.from);
    const to = Object.assign({}, this.sprite.position, this.to);

    // Set velocity and gravity
    this.sprite.v.x = (to.x - this.sprite.position.x) / this.duration;
    this.sprite.v.y = (to.y - this.sprite.position.y) / this.duration;
    this.sprite.v.a = (to.a - this.sprite.position.a) / this.duration;

    if (this.height === 0) {
      this.sprite.v.z = (to.z - this.sprite.position.z) / this.duration;
      this.sprite.gravity = 0;
    } else {
      const t = this.duration / this.numberOfJumps;
      this.sprite.v.z = 4 * this.height / t;
      this.sprite.gravity = -2 * this.sprite.v.z / t;
    }

    this.sprite.resetFrames();

    this.time = 0;

console.log('Initializing animation', this.sprite.url)

  }

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

  render() {
    this.sprite.render();
  }
}

class AnimationSequence {
  constructor(animations) {
    this.animations = animations;
    this.initialized = false;
    this.done = false;
  }


  initialize() {
    this.done = false;
    this.initialized = true;
    this.i = 0;
    this.currentAnimation = this.animations[0];
    this.currentAnimation.initialize();
  }

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

  render() {
    this.currentAnimation.render();
  }
}

class AnimationParallel {
  constructor(animations) {
    this.animations = animations;
    this.initialized = false;
    this.done = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;
    this.animations.forEach(animation => animation.initialize());
  }

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

  render(dt) {
    this.animations.forEach(animation => animation.render());
  }
}