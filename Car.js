
class Car {
  constructor(x, y, ai=false, ai_dir=true) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.angle = 0
    this.maxspeed = 5;

    this.w = 10;
    this.h = 20;
    this.vy = 0;
    this.ai = ai;
    this.ai_settings = {
      "direction": ai_dir,
      "speed": random(0.5, 1)
    }
  }

  ai_move(frogs){
    if(frogs){
      let count = 0;
      const sep = this.w * 1.5;
      let sum = createVector(0, 0)
      for(const frog of frogs){
        const d = p5.Vector.dist(this.position, frog.position);
        if(d > 0 && d < sep){
          let diff = p5.Vector.sub(this.position, frog.position)
          diff.normalize()
          diff.div(d)
          sum.add(diff)
          count ++;
        }
      }
      if(count > 0){
        sum.div(count)
        sum.normalize()
        sum.mult(this.maxspeed)
      }
    }
    // targeting
    const target = createVector(this.position.x, this.position.y + 20);
    const desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.ai_settings.speed);
    desired.mult(this.ai_settings.direction? -1: 1)
    const steer = p5.Vector.sub(desired, this.velocity)
    this.acceleration.add(steer)
    this.velocity.add(this.acceleration)

  }

  draw() {
    push()
    translate(this.position.x, this.position.y)
    rotate(this.angle)
    fill(255)
    rect(-this.w/2, -this.h/2, this.w, this.h);
    pop();
  }

  move(dirx, diry, road, frogs){
    if(this.ai){
     this.ai_move(frogs);
    }else{
      this.actual_move(dirx, diry, road)
    }
    if (this.position.y < 0) {
      this.position.y = height;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    }
    if (
      (this.position.x < this.w && x < 0 )
      ||
      ( this.position.x + this.w + this.w > width && x > 0 )
    ) {
      this.velocity.x = 0
    }
    this.position.add(this.velocity)
    // TODO remove and update collision code
    this.x = this.position.x
    this.y = this.position.y
  }

  actual_move(dirx, diry, road) {
    const DEFAULT_HORIZ = 5;
    this.angle += dirx * this.maxspeed;
    const DEFAULT_VERT = 5;
    let r = 0
    switch (road.type) {
      case 'grass':
        r = 0.25
        break
      case 'water':
        r = 0.01
        break
      default:
        r = 0.75;
        break
    }
    const mspeedy = DEFAULT_VERT * r
    this.velocity.y = cos(this.angle) * mspeedy * diry;
    this.velocity.x = sin(this.angle) * mspeedy * abs(diry);
  }
}
