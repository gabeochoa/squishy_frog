
class Car {
  constructor(x, y, ai=false, ai_dir=true) {
    this.position = createVector(x, y);
    this.velocity = createVector(
      0,
      0
    );
    this.acceleration = createVector(0, 0);
    this.angle = 0
    this.maxspeed = 5;
    this.maxforce = 0.25;
    this.ai = ai;

    this.w = 10;
    this.h = 20;
    this.sep = this.h * 2;
  }

  applyForce(force){
    this.acceleration.add(force)
  }

  separate(frogs){
    let count = 0;
    let sum = createVector(0, 0)
    for(const frog of frogs){
      const d = p5.Vector.dist(this.position, frog.position);
      if(d > 0 && d < this.sep){
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
      const steer = p5.Vector.sub(sum, this.velocity)
      steer.limit(this.maxforce)
      return steer
    }
    return createVector(0, 0)
  }

  ai_move(frogs){
    const sep = this.separate(frogs)
    // targeting
    const target = createVector(this.position.x, this.position.y + 20);
    const desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.ai? -1: 1)
    const steer = p5.Vector.sub(desired, this.velocity)
    steer.add(sep)
    this.applyForce(steer)
  }

  draw() {
    push()
    translate(this.position.x, this.position.y)
    rotate(this.angle)
    fill(255)
    rect(-this.w/2, -this.h/2, this.w, this.h);
    pop();
    if(this.ai){
      for(const frog of frogs){
        const d = p5.Vector.dist(this.position, frog.position);
        if(d > 0 && d < this.sep){
          line(this.position.x, this.position.y, frog.position.x, frog.position.y)
        }
      }
    }
  }

  move(dirx, diry, road, frogs){
    if(this.ai){
     this.ai_move(frogs);
    }else{
      this.actual_move(dirx, diry, road)
    }
    this.velocity.add(this.acceleration)

    if (this.position.y < 0) {
      this.position.y = height;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    }
    if (
      (this.position.x < this.w && this.position.x < 0 )
      ||
      ( this.position.x + this.w + this.w > width && this.position.x > 0 )
    ) {
      this.velocity.x = 0
    }
    this.position.add(this.velocity)
    // TODO remove and update collision code
    this.x = this.position.x
    this.y = this.position.y
    this.acceleration.mult(0.5);
  }

  actual_move(dirx, diry, road) {
    this.angle += dirx * this.maxspeed;
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
    const mspeedy = this.maxspeed * r
    this.velocity.y = cos(this.angle) * mspeedy * diry;
    this.velocity.x = sin(this.angle) * mspeedy * abs(diry);
  }
}
