class Sprite {
  constructor(props) {
    // url, spriteOffset, center, bottom, numberOfFrames, period, once
    Object.assign(this, {
        position: { x: 0, y: 0, z: 0, a: 0, },
        v: { x: 0, y: 0, z: 0, a: 0, },
        gravity: 0,
        period: 1,
        numberOfFrames: 1,
        once: true,
        spriteOffset: 0,
        center: { x: 0,  y: 0 },
        filter: '',
      },
      props
    );

    this.resetFrames();
  }

  resetFrames() {
    this.frameTime = this.period / this.numberOfFrames;
    this.frame = 0;
    this.time = 0;
    this.done = false;
  }

  update(dt) {
    // Bounce of the floor
    if (this.position.z < 0 && this.gravity !== 0) {
      this.position.z = 0;
      this.v.z = -this.v.z;
    } else {
      this.v.z += dt * this.gravity;
    }

    this.position.x += dt * this.v.x;
    this.position.y += dt * this.v.y;
    this.position.z += dt * this.v.z;
    this.position.a += dt * this.v.a;

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
