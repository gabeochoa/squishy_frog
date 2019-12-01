function intersection(a, b, hitpoint) {
  const rect1 = {
    x: a.position.x,
    y: a.position.y,
    w: a.w,
    h: a.h
  };
  var rect2 = {
    x: b.position.x,
    y: b.position.y,
    w: b.w,
    h: b.h
  };

  if (hitpoint) {
    //divide car into four boxes
    rect2.w /= 2
    rect2.h /= 2
    hitpoint = [false, false, false, false]
    for (i = 0; i < 4; i++) {
      // LT: 0
      // RT: 1
      // LB: 2
      // RB: 3
      rect2.x = i % 2 ? b.x + b.w: b.x;
      rect2.y = Math.floor(i / 2)  ? b.y + b.h : b.y;
      hitpoint[i] = miniInsec(rect1, rect2);
    }
    for (i = 0; i < 4; i++) {
      if (hitpoint[i]) {
        return true;
      }
    }
    return false;
  } else {
    return miniInsec(rect1, rect2);
  }
}

function miniInsec(rect1, rect2){
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
