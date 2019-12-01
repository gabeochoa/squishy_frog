
class AICar extends Car {
  constructor(x, y) {
    super(x, y, true, true)
    this.debug_vectors = {};
    this.teleport_reset = 100;
    this.teleported = this.teleport_reset;
  }

  separateCars(){
    return this.separate(cars.concat([c]), this.h);
  }
  separateFrogs(){
    return this.separate(frogs, this.w);
  }
  separate(items, spacing){
    let count = 0;
    let sum = createVector(0, 0)
    for(const item of items){
      const d = p5.Vector.dist(this.position, item.position);
      if(d > 0 && d < spacing){
        let diff = p5.Vector.sub(this.position, item.position)
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
    // distance you can be from the road before having to come back
    const STRAY_DIST = this.w

    // lets predict where this car will be in 25 ticks
    const predict = this.velocity.copy();
    predict.normalize(); predict.mult(25);
    const predicted_loc = p5.Vector.add(this.position, predict)

    // find the closest edge of the road we are on
    const left_start = createVector(road.x + this.w, road.y)
    const left_end = createVector(road.x + this.w, height)
    const right_start = createVector(road.x + road.w, road.y)
    const right_end = createVector(road.x + road.w, height)
    const left_dist = p5.Vector.dist(this.position, left_start)
    const right_dist = p5.Vector.dist(this.position, right_start)
    let a = left_start
    let b = left_end
    let flip = false
    if(left_dist > right_dist)
    {
      a = right_start
      b = right_end
      flip = true
    }

    // get the normal point where we meet the edge
    const normal = this.getNormal(predicted_loc, a, b);
    const dir = flip? p5.Vector.sub(a, b) : p5.Vector.sub(b, a);
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
    if (this.impacted) {
      //maybe decrease acceleration till velcoity is zero
      if (this.impacted > 1) {
        
        if (this.velocity.x != 0.0) {
          if (Math.abs(this.velocity.x) < 0.1) {
            this.velocity.x = 0.0;
            this.acceleration.x = 0.0;
            this.impacted++;
          } else {
            //decrease by 0.1
            this.acceleration.x = this.velocity.x > 0 ? -0.1 : 0.1;
          }
        }
        if (this.velocity.y != 0.0) {
          if (Math.abs(this.velocity.y) < 0.1) {
            this.velocity.y = 0.0;
            this.acceleration.y = 0.0;
            this.impacted++;
          } else {
            //decrease by 0.1
            this.acceleration.y = this.velocity.y > 0 ? -0.1 : 0.1;
          }
        }
      } else {this.impacted++;}
      if (this.impacted > 3) {this.impacted++;}
      if (this.impacted > 100) {this.impacted = 0;}
      return;
    }

    const sep_frogs = this.separateFrogs()
    const sep_cars = this.separateCars()
    const stay = this.stayOnRoad(road)
    const steer = this.seek(
      createVector(
        this.position.x,
        this.position.y + 10
      ),
      road.direction
    );
    this.debug_vectors['sep_cars'] = sep_cars
    // this.debug_vectors['sep_frogs'] = sep_frogs
    // this.debug_vectors['stay'] = stay
    this.debug_vectors['steer'] = steer
    // make avoiding frogs less important
    // sep.mult(0.25)
    steer.mult(2)
    this.applyForce(steer)
    // steer.add(stay)
    // steer.add(sep_frogs)
    this.applyForce(sep_cars)
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
    if(this.teleported < 0){
      if (this.position.y < -this.h) {
        this.position.y = height-this.h;
      }
      if (this.position.y > height + this.h) {
        this.position.y = this.h;
      }
      this.teleported = this.teleport_reset;
    }
    this.teleported --;

    this.position.add(this.velocity)
    this.acceleration.mult(0.5);
  }

  draw_vec(vec, color){
    if(!vec){return}
    vec.mult(100)
    push();
    stroke(...color);
    strokeWeight(3);
    fill(...color);
    translate(this.position.x, this.position.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 5;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }

  draw(){
    super.draw()
    if(DEBUG){
      push()
        stroke(0)
        this.draw_vec(this.debug_vectors['sep_cars'], [255, 255, 0]) // yellow
        this.draw_vec(this.debug_vectors['sep_frogs'], [255, 0, 0]) // red
        this.draw_vec(this.debug_vectors['sep'], [255, 0, 0]) // red
        this.draw_vec(this.debug_vectors['stay'], [0, 255, 0]) // green
        this.draw_vec(this.debug_vectors['steer'], [0, 0, 255]) // blue
      pop()
    }
  }
}
