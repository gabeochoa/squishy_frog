
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
    this.maxspeed = 5;
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
        r = 0.5
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
    this.acceleration.x = otherc.velocity.x;
    this.acceleration.y = otherc.velocity.y;
    
  }
}
