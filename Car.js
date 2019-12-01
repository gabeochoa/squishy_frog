
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

  separate(){
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

  stayInLane(road){
    const STRAY_DIST = this.w
    const predict = this.velocity.copy();
    predict.normalize(); predict.mult(25);
    const predicted_loc = p5.Vector.add(this.position, predict)

    const left_start = createVector(road.x + this.w, road.y)
    const left_end = createVector(road.x + this.w, height)
    const right_start = createVector(road.x + road.w, road.y)
    const right_end = createVector(road.x + road.w, height)
    const left_dist = p5.Vector.dist(this.position, left_start)
    const right_dist = p5.Vector.dist(this.position, right_start)
    let a = left_start
    let b = left_end
    if(left_dist > right_dist)
    {
      a = right_start
      b = right_end
    }
    const normal = this.getNormal(predicted_loc, a, b);
    const dir = p5.Vector.sub(b, a);
    dir.normalize();
    dir.mult(10)
    const target = p5.Vector.add(normal, dir);
    const dist = p5.Vector.dist(normal, predicted_loc)
    if(dist > STRAY_DIST){
      return this.seek(target)
    }
    return null
  }

  getNormal(p, a, b){
    const a_to_p = p5.Vector.sub(p, a)
    const a_to_b = p5.Vector.sub(b, a)
    a_to_b.normalize()
    a_to_b.mult(a_to_p.dot(a_to_b))
    return p5.Vector.add(a, a_to_b)
  }

  seek(target){
    const desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    return p5.Vector.sub(desired, this.velocity)
  }

  stayOnRoad(road){
    if(!road){ return null; }
    for(const r of roads){
      if(road.type == 'road'){ continue}
      const s = this.stayInLane(r)
      if(s){ return s }
    }
  }

  ai_move(road){
    const sep = this.separate()
    const stay = this.stayOnRoad(road)
    const steer = this.seek(
      createVector(
        this.position.x,
        this.position.y + ( 1 * road.direction )
      )
    );

    // make avoiding frogs less important
    sep.mult(0.25)
    steer.mult(0.50)

    steer.add(stay)
    steer.add(sep)
    this.applyForce(steer)
  }

  getColor(){
    return [255, 255, 255]
  }

  draw() {
    push()
    translate(this.position.x, this.position.y)
    if(this.ai){
      rotate(this.velocity.heading() + PI/2)
    }else{
      rotate(this.angle)
    }
    fill(...this.getColor())
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

  move(dirx, diry, road){
    if(this.ai){
     this.ai_move(road);
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
    this.angle += (dirx * this.maxspeed * PI/180);
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

  impact(otherc, hits) {
    // LT: 0 RT: 1 LB: 2 RB: 3
    const lt = hits[0],
          rt = hits[1],
          lb = hits[2],
          rb = hits[3];
    if (lt && rt && lb && rb) {
      console.log("Hit every part of this car");
    }
    let vec = createVector(0, 0);
    if (lt) {

      this.acceleration.y += otherc.velocity.y;
      this.acceleration.x += otherc.velocity.x;
    }
    if (rt) {
      this.acceleration.y += otherc.velocity.y;
      this.acceleration.x -= otherc.velocity.x;
    }
    if (lb) {
      this.acceleration.y -= otherc.velocity.y;
      this.acceleration.x += otherc.velocity.x;
    }
    if (rb) {
      this.acceleration.y -= otherc.velocity.y;
      this.acceleration.x -= otherc.velocity.x;
    }
  }
}
