class Animation {
  constructor(props) {
    this.duration = 1;
    this.numberOfJumps = 1;
    this.height = 0;

    Object.assign(this, props);

    this.initialized = false;
    this.done = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;

    if (this.from) {
      Object.assign(this.sprite.position, this.from);
    }

    if (this.sprite.once) {
      this.sprite.period = this.duration;
    }
    this.sprite.resetFrames();

    this.time = 0;

    this.to = Object.assign({}, this.sprite.position, this.to);

    this.sprite.v.x = (this.to.x - this.sprite.position.x) / this.duration;
    this.sprite.v.y = (this.to.y - this.sprite.position.y) / this.duration;
    this.sprite.v.a = (this.to.a - this.sprite.position.a) / this.duration;

    if (this.height === 0) {
      this.sprite.v.z = (this.to.z - this.sprite.position.z) / this.duration;
      this.sprite.gravity = 0;
      return;
    }

    const t = this.duration / this.numberOfJumps;

    this.sprite.v.z = 4 * this.height / t;
    this.sprite.gravity = -2 * this.sprite.v.z / t;
  }

    update(dt) {
    if (this.done) return;

    if (!this.initialized) {
      this.initialize();
    } else {
      this.sprite.update(dt);
      this.time += dt;

      if (this.time >= this.duration) {
        this.done = true;
        this.initialized = false;
      }
    }
  }

  render() {
    this.sprite.render();
  }
}

class Emerge {
  constructor(props) {
    Object.assign(this, props);
    this.initialized = false;
    this.done = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;

    if (this.from) {
      Object.assign(this.object.position, this.from)
    }

    this.v = {
      x: this.change.x / this.duration,
      y: this.change.y / this.duration,
      angle: this.change.angle / this.duration,
    }

    this.clipY = this.clipY ? this.clipY : ctx.canvas.height;

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
    Object.assign(this, props);
    this.initialized = false;
    this.done = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;

    if (this.from) {
      Object.assign(this.object.position, this.from)
    }

    const depth = this.to.y - this.object.position.y;

    this.v = {
      x: (this.to.x - this.object.position.x) / this.duration,
      y: this.height > 0
          ? -2 * this.height * (1 + Math.sqrt(1 + depth / this.height)) / this.duration
          : 0,
      angle: (this.to.angle - this.object.position.angle) / this.duration,
    }
    this.a = this.v.y !== 0
              ? this.v.y * this.v.y / (2 * this.height)
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
    Object.assign(this, props);
    this.initialized = false;
    this.done = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;

    if (this.from) {
      Object.assign(this.object.position, this.from);
    }
    this.startY = this.object.position.y;
    this.v = {
      x: (this.to.x - this.object.position.x) / this.duration,
      y: (this.to.y - this.object.position.y) / this.duration,
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
      this.object.position.y = this.startY
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
    Object.assign(this, props);
    this.done = false;
    this.initialized = false;
  }

  initialize() {
    this.done = false;
    this.initialized = true;
    this.frameRate = this.numberOfFrames / this.duration;
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