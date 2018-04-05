const GRAVITY = -1000;

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

    this.frameTime = this.period / this.numberOfFrames;
    this.frame = 0;
    this.time = 0;
    this.done = false;
  }

  resetFrames() {
    this.frame = 0;
    this.time = 0;
    this.done = false;
  }

  terrainBelow() {
    const row = Math.floor((this.position.y + 40)/ 83);
    const col = Math.floor(this.position.x / 101);
    return this.terrain[col][row];
  }

  update(dt) {
    this.position.x += dt * this.v.x
    this.position.y += dt * this.v.y
    this.position.z += dt * this.v.z
    this.position.a += dt * this.v.a
    this.v.z += dt * GRAVITY;

    // Bounce of the floor
    if (this.position.z < 0 && this.terrainBelow() !== 'water') {
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

    if (this.position.z < 0 && this.terrainBelow() === 'water') {
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

    ctx.translate(this.position.x + this.center.x, this.position.y - this.position.z + this.center.y);
    ctx.rotate(this.position.a);
    ctx.drawImage(Resources.get(this.url),
                  this.frame * 101, this.spriteOffset, 101, 171,
                  -this.center.x, -this.center.y, 101, 171);
    ctx.restore();
  }
}
