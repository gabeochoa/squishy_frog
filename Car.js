
class Car {
  constructor(x, y, ai=false, ai_dir=true) {
    this.w = 10
    this.h = 20
    this.position = createVector(x, y);
    this.velocity = createVector(
      0,
      0
    );
    this.acceleration = createVector(0, 0);
    this.angle = 0
    this.maxspeed = 3;
    this.maxforce = 0.25;
    this.ai = ai;

    this.impacted = 0;
  }

  applyForce(force){
    this.acceleration.add(force)
  }

  getColor(){
    if(!this.ai) return [255, 0, 0];
    return [255, 255, 255]
  }

  draw() {
    push()
    stroke(0)

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
  }

  move(dirx, diry, road){
    throw Error("implement move")
  }

  getRoadSpeed(road){
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
    return r;
  }

  impact(otherc, hits) {
    // LT: 0 RT: 1 LB: 2 RB: 3
    if (this.impacted) {
      return;
    }
    this.impacted = 1;
    const lt = hits[0],
          rt = hits[1],
          lb = hits[2],
          rb = hits[3];
    console.log("Impact: " + lt + rt + lb + rb);
    if (lt && rt && lb && rb) {
      console.log("Hit every part of this car");
    }
    let vec = createVector(0, 0);
    if (lt) {
     vec.x = Math.abs(this.maxspeed);
     vec.y = Math.abs(this.maxspeed);
    }
    if (rt) {
      vec.x = -Math.abs(this.maxspeed);
      vec.y =  Math.abs(this.maxspeed);
    }
    if (lb) {
      vec.x = Math.abs(this.maxspeed);
      vec.y = -Math.abs(this.maxspeed);
    }
    if (rb) {
      vec.x = -Math.abs(this.maxspeed);
      vec.y = -Math.abs(this.maxspeed);
    }
    //vec.mult(4);
    this.applyForce(vec);
    vec.mult(-1);
    otherc.applyForce(vec);
  }
}
