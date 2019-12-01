let c = null;
let frogs = [];
const DEBUG = false

class Blood {
  constructor(x, y){
    this.x = x; this.y = y;
  }
  draw(){
    fill(255, 0, 0);
    rect(this.x, this.y, 3.5, 3.5);
  }
}
let blood = [];
let cars = [];
let roads = [];
let points = 0
const FROG_POINTS = 10;


function setup() {
  createCanvas(400, 400);
  c = new DrivableCar(200, 200);
  setupRoads();
  setupCars();
  setupFrogs();
}

function setupFrogs(){
  for(var i = 0; i<25; i++){
    // frogs.push(new Frog());
  }
}
function setupCars(){
  for(var i = 0; i<10; i++){
    cars.push(new AICar(random(0, 340), random(height), true));
  }
  cars.push(new Truck(random(50, 300), random(height)));
}
function setupRoads(){
  roads.push(new Road(0, 50, 'grass'));
  roads.push(new Road(50, 50, 'road', 1));
  roads.push(new Road(100, 50, 'road', -1));
  roads.push(new Road(150, 50, 'grass'));
  roads.push(new Road(200, 50, 'road', 1));
  roads.push(new Road(250, 50, 'road', -1));
  roads.push(new Road(300, 50, 'grass'));
  roads.push(new Road(350, 50, 'water'));
}

function keyStuff() {
  let x = 0;
  let y = 0;

  if (keyIsDown(LEFT_ARROW)) {
    x = -1
  } else if (keyIsDown(RIGHT_ARROW)) {
    x = 1;
  }
  if (keyIsDown(UP_ARROW)) {
    y = -1;
  }
  return [x, y];
}

function list_col(c, items, default_val, car) {
  for (const r of items) {
    const b = car ? intersection(c, r, car) : intersection(c, r);
    if (b) {
      return r
    }
  }
  return default_val
}

function hitFrog(frog, is_user=false){
  if(is_user){
    console.log("You hit a frog")
    points += FROG_POINTS;
    if(random(0,1) > 0.5){
      frogs.push(new Frog())
    }
  }
  if(blood.length > 50){
    blood.shift();
  }
  blood.push(new Blood(frog.position.x, frog.position.y))

  frog.reset();
}

function drawUI() {
  fill(0)
  rect(0, 0, width, 10 + 3)
  fill(255)
  textSize(12);
  text('Points: ' + points, 10, 10 + 1.5);
}

function draw() {
  const mvmt = keyStuff();
  background(0);
  // Collision
  const onRoad = list_col(c, roads, {type: 'none'});
  const onFrog = list_col(c, frogs, null);
  let hits = [false, false, false, false];
  const onCar = list_col(c, cars, null, hits);

  if (onCar) {
    console.log("ON Car", onCar)
    onCar.impact(c, hits)
  }

  if(onFrog){
    hitFrog(onFrog, true)
  }

  for(const car of cars){
    const onFrog = list_col(car, frogs, null);
    if(onFrog){
      hitFrog(onFrog)
    }
  }

  // Movement
  c.move(...mvmt, onRoad);

  for (const frog of frogs) {
    frog.move();
  }

  for (const car of cars) {
    const onRoad = list_col(car, roads, {type: 'none'});
    car.move(null, null, onRoad, frogs);
  }

  // Drawing only
  for (const road of roads) {
    road.draw();
  }

  for (const frog of frogs) {
    frog.draw();
  }

  for (const b of blood) {
    b.draw();
  }

  for (const car of cars) {
    car.draw();
  }

  c.draw();
  drawUI();
}
