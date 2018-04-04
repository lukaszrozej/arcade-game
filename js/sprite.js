class Sprite {
  constructor(props) {
    // url, spriteOffset, center, bottom, numberOfFrames, period, once
    Object.assign(this, props);

    this.position = {
      x: 0,
      y: 0,
      z: 0,
      a: 0,
    };
    this.v = {
      x: 0,
      y: 0,
      z: 0,
      a: 0,
    }
    this.gravity = 0;

    this.frameTime = this.numberOfFrames / this.period;
    this.frame = 0;

    this.done = false;
  }

  update(dt) {
    this.position.x += dt * this.v.x
    this.position.y += dt * this.v.y
    this.position.z += dt * this.v.z
    this.position.a += dt * this.v.a
    this.v.z += dt * this.gravity;

    // Bounce of the floor
    if (this.position.z < 0 && this.getTerrain() !== 'water') {
      this.position.z = 0;
      this.v.z = -this.v.z;
    }

    if (this.done) return;

    this.time += dt;
    if (this.once && this.time >= this.period) {
      this.done = true;
      this.frame = this.numberOfFrames - 1;
      return;
    }
    this.time %= this.period;
    this.frame = Math.floor(this.time / this.frameTime)
  }

  render(ctx) {
    ctx.save();

    if (this.position.z < 0 && this.getTerrain() === 'water') {
      const clipY = this.position.y + bottom;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, clipY);
      ctx.lineTo(ctx.canvas.width, clipY);
      ctx.lineTo(ctx.canvas.width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.clip();
    }

    ctx.translate(this.position.x + this.center.x, this.position.y + this.center.y);
    ctx.rotate(this.position.a);
    ctx.drawImage(Resources.get(this.url),
                  this.frame * 101, this.spriteOffset, 101, 171,
                  -this.center.x, -this.center.y, 101, 171);
    ctx.restore();
  }
}
