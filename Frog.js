


class Frog {

  SIZE = 7;
  JUMP = 10;
  RESET_JC = 15;

  constructor(){
    this.reset();
  }

  reset (){
      this.x = random(-20, 0);
      this.y = random(0, height);
      this.w = this.SIZE;
      this.h = this.SIZE;
      this.j_c = random(this.RESET_JC, this.RESET_JC*10);
  }

  move(){
    if(this.j_c < 0){
      let x = this.JUMP

      if (this.x + this.w + this.w > width && x > 0) {
        this.reset();
      }
      else{
        this.x += x
        this.j_c = this.RESET_JC
      }
    }
    this.j_c--;

  }

  draw(){
    fill(0, 255, 0);
    rect(this.x, this.y, this.w, this.h)
  }

}
