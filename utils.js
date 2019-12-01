function intersection(car, road, hitpoint) {
  const rect1 = {
    x: car.x,
    y: car.y,
    w: car.w,
    h: car.h
  };


  if (hitpoint) {
    //divide car into four boxes
    
  }

  var rect2 = {
    x: road.x,
    y: road.y,
    w: road.w,
    h: road.w
  };

  var x1 = rect2.x,
    y1 = rect2.y,
    x2 = x1 + rect2.w,
    y2 = y1 + rect2.h;
  
  if (rect1.x > x1) {
    x1 = rect1.x;
  }
  if (rect1.y > y1) {
    y1 = rect1.y;
  }
  if (rect1.x + rect1.w < x2) {
    x2 = rect1.x + rect1.w;
  }
  if (rect1.y + rect1.h < y2) {
    y2 = rect1.y + rect1.h;
  }
  return (x2 <= x1 || y2 <= y1) ? false : true;
}
