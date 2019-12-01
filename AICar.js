
class AICar extends Car {
  constructor(x, y) {
    super(x, y, true, true)
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

  seek(target, d=1){
    const desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(d)
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
    if (false && this.impacted) {
      //maybe decrease acceleration till velcoity is zero
      if (this.impacted == 2) {
        if (this.velocity.x != 0.0) {
          if (Math.abs(this.velocity.x) < 0.1) {
            this.velocity.x = 0.0;
            this.acceleration.x = 0.0;
          } else {
            //decrease by 0.1
            this.acceleration.x = this.velocity.x > 0 ? -0.1 : 0.1;
          }
        }
        if (this.velocity.y != 0.0) {
          if (Math.abs(this.velocity.y) < 0.1) {
            this.velocity.y = 0.0;
            this.acceleration.y = 0.0;
          } else {
            //decrease by 0.1
            this.acceleration.y = this.velocity.y > 0 ? -0.1 : 0.1;
          }
        }
      }
      this.impacted = 2;
      return;
    }
    const sep = this.separate()
    const stay = this.stayOnRoad(road)
    const steer = this.seek(
      createVector(
        this.position.x,
        this.position.y + 10
      ),
      road.direction
    );
    // make avoiding frogs less important
    // sep.mult(0.25)
    // steer.mult(0.50)
    // steer.add(stay)
    steer.add(sep)
    this.applyForce(steer)
  }

  getColor(){
    return [255, 255, 255]
  }

  move(dirx, diry, road){
    this.ai_move(road);

    if(this.position.x < this.w){
      this.position.x += this.w/4
    }
    if(this.position.x + this.w > width){
      this.position.x -= this.w/4
    }
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed * this.getRoadSpeed(road));
    if (this.position.y < -this.h) {
      this.position.y = height;
    }
    if (this.position.y > height + this.h) {
      this.position.y = 0;
    }
    this.position.add(this.velocity)
    this.acceleration.mult(0.5);
  }
}
