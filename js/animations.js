class Emerge {
  constructor(props) {
    this.props = props;
    this.initialized = false;
    this.done = false;
  }

  start() {
    this.done = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;

    this.object = this.props.object;
    if (this.props.from) {
      Object.assign(this.object.position, this.props.from)
    }
    this.duration = this.props.duration;


    this.v = {
      x: (this.props.to.x - this.object.position.x) / this.duration,
      y: (this.props.to.y - this.object.position.y) / this.duration,
      angle: (this.props.to.angle - this.object.position.angle) / this.duration,
    }

    this.clipY = this.props.clipY ? this.props.clipY : ctx.canvas.height;

    this.time = 0;
  }

  update(dt) {
    if (this.done) return;

    if (!this.initialized) {
      this.initialize();
    } else {
      this.object.position.x += dt * this.v.x;
      this.object.position.y += dt * this.v.y;
      this.object.position.angle += dt * this.v.angle;
      this.time += dt;

      if (this.time >= this.duration) {
        this.done = true;
        this.initialized = false;
      }
    }
  }

  render() {
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.clipY);
    ctx.lineTo(ctx.canvas.width, this.clipY);
    ctx.lineTo(ctx.canvas.width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.clip();

    ctx.translate(this.object.position.x + this.object.sprite.center.x, this.object.position.y + this.object.sprite.center.y);
    ctx.rotate(this.object.position.angle);
    ctx.drawImage(Resources.get(this.object.sprite.url),
                  this.object.sprite.offset.x, this.object.sprite.offset.y, 101, 171,
                  -this.object.sprite.center.x, -this.object.sprite.center.y, 101, 171);
    ctx.restore();
  }
}

class Throw {
  constructor(props) {
    this.props = props;
    this.initialized = false;
    this.done = false;
  }

  start() {
    this.done = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;

    this.object = this.props.object;
    if (this.props.from) {
      Object.assign(this.object.position, this.props.from)
    }
    this.duration = this.props.duration;

    const depth = this.props.to.y - this.object.position.y;

    this.v = {
      x: (this.props.to.x - this.object.position.x) / this.duration,
      y: this.props.height > 0
          ? -2 * this.props.height * (1 + Math.sqrt(1 + depth / this.props.height)) / this.duration
          : 0,
      angle: (this.props.to.angle - this.object.position.angle) / this.duration,
    }
    this.a = this.v.y !== 0
              ? this.v.y * this.v.y / (2 * this.props.height)
              : 2 * depth / (this.duration * this.duration);

    this.time = 0;
  }

  update(dt) {
    if (this.done) return;

    if (!this.initialized) {
      this.initialize();
    } else {
      this.object.position.x += dt * this.v.x;
      this.object.position.y += dt * this.v.y;
      this.object.position.angle += dt * this.v.angle;
      this.v.y += dt * this.a;
      this.time += dt;

      if (this.time >= this.duration) {
        this.done = true;
        this.initialized = false;
      }
    }
  }

  render() {
    ctx.save();
    ctx.translate(this.object.position.x + this.object.sprite.center.x, this.object.position.y + this.object.sprite.center.y);
    ctx.rotate(this.object.position.angle);
    ctx.drawImage(Resources.get(this.object.sprite.url),
                  this.object.sprite.offset.x, this.object.sprite.offset.y, 101, 171,
                  -this.object.sprite.center.x, -this.object.sprite.center.y, 101, 171);
    ctx.restore();
  }
}

class Jump {
  constructor(props) {
    this.props = props;
    this.initialized = false;
    this.done = false;
  }

  start() {
    this.done = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;

    this.object = this.props.object;
    if (this.props.from) {
      Object.assign(this.object.position, this.props.from);
    }
    this.startY = this.object.position.y;
    this.duration = this.props.duration;
    this.height = this.props.height;
    this.numberOfJumps = this.props.numberOfJumps;
    this.v = {
      x: (this.props.to.x - this.object.position.x) / this.duration,
      y: (this.props.to.y - this.object.position.y) / this.duration,
    }
    this.time = 0;
  }

  update(dt) {
    if (this.done) return;

    if (!this.initialized) {
      this.initialize();
    } else {
      this.object.position.x += dt * this.v.x;
      this.time += dt;
      this.object.position.y = this. startY
                            + this.time * this.v.y
                            - this.height *  Math.abs(Math.sin(this.numberOfJumps * Math.PI * this.time / this.duration));

      if (this.time >= this.duration) {
        this.done = true;
        this.initialized = false;
      }
    }
  }

  render() {
    ctx.save();
    ctx.translate(this.object.position.x + this.object.sprite.center.x, this.object.position.y + this.object.sprite.center.y);
    ctx.rotate(this.object.position.angle);
    ctx.drawImage(Resources.get(this.object.sprite.url),
                  this.object.sprite.offset.x, this.object.sprite.offset.y, 101, 171,
                  -this.object.sprite.center.x, -this.object.sprite.center.y, 101, 171);
    ctx.restore();
  }
}

class Splash {
  constructor(props) {
    this.url = `images/${props.sprites}.png`;
    this.position = props.position;
    this.duration = props.duration;
    this.frameRate = props.numberOfFrames / props.duration;
    this.done = false;
  }

  start() {
    this.done = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;
    this.time = 0;
  }

  update(dt) {
    if (this.done) return;

    if (!this.initialized) {
      this.initialize();
    } else {
      this.frame = Math.floor(this.time * this.frameRate);
      this.time += dt;

      if (this.time >= this.duration) {
        this.done = true;
        this.initialized = false;
      }
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.url), this.frame * 101, 0, 101, 171, this.position.x, this.position.y, 101, 171);
  }
}

class Sequence {
  constructor(animations) {
    this.animations = animations;
    this.initialized = false;
    this.done = false;
  }

  start() {
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

class Parallel {
  constructor(animations) {
    this.animations = animations;
    this.initialized = false;
    this.done = false;
  }

  start() {
    this.done = false
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