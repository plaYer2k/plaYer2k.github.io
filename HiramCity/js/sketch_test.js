

class HiramCity {
  constructor() {
    // timestamps
    this.initTime = +moment();
    this.lastDraw = +moment();
    this.td = 0;

    /**
     * @type {Array<Icon>}
     */
    this.icons = new Array();
  }

  mousePressed(x, y) {
    this.icons.push(new Icon(x, y));
  }

  draw() {
    // create time variables
    let now = +moment();
    this.td = now - this.lastDraw;
    this.lastDraw = now;

    // draw icons
    let previousIcon = null;
    this.icons.forEach(icon => {
      if (previousIcon) line(previousIcon.pos.x, previousIcon.pos.y, icon.pos.x, icon.pos.y);
      icon.draw(this.td, this.initTime);
      previousIcon = icon;
    });
  }
}

class Camera {
  constructor() {
    this.scale = 1.0;
    this.offset = createVector(0, 0);
    this.center = createVector(width / 2, height / 2);

    this.minScale = 1 / 2;    // min 200%
    this.maxScale = 1 / 0.2;  // max 20%
  }

  zoom(scale) {
    // scale
    this.scale *= scale;

    // limit scale
    this.scale = Math.min(Math.max(this.scale, this.minScale), this.maxScale);
  }

  canvasToScene(x, y) {
    return [(x - this.center.x) / this.scale - this.offset.x, (y - this.center.y) / this.scale - this.offset.y];
  }

  sceneToCanvas(x, y) {
    return [(x + this.center.x) * this.scale + this.offset.x, (y + this.center.y) * this.scale + this.offset.y];
  }

  apply() {
    // move to offset
    stroke('red');
    line(0, 0, this.center.x, this.center.y);
    translate(this.center.x, this.center.y);

    // scale scene
    scale(this.scale);
    
    // move to offset
    stroke('blue');
    line(0, 0, this.offset.x, this.offset.y);
    translate(this.offset.x, this.offset.y);

    stroke('black');
  }
}

// Global constants
const cameraSpeed = 10;
/**
 * @type {HiramCity}
 */
let hiramCity;
/**
 * @type {Camera}
 */
let camera;

function setup() {
  createCanvas(windowWidth, windowHeight);

  hiramCity = new HiramCity();
  camera = new Camera();
}

function draw() {
  background(220, 215, 160);

  //TODO: make speed scale dependent
  // add camera movement
  if (keyIsDown(LEFT_ARROW))  camera.offset.x += cameraSpeed;
  if (keyIsDown(RIGHT_ARROW)) camera.offset.x -= cameraSpeed;
  if (keyIsDown(UP_ARROW))    camera.offset.y += cameraSpeed;
  if (keyIsDown(DOWN_ARROW))  camera.offset.y -= cameraSpeed;

  // apply camera
  camera.apply();

  // draw scene
  hiramCity.draw();
}

function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);

  // recenter camera
  camera.center.set(width / 2, height / 2);
}

function mouseWheel(event) {
  // scale camera (event delta is either -3 or +3)
  camera.zoom((100 + event.delta * 2) / 100);

  return false;
}

function mousePressed() {
  // get coordinates for scene
  let [x, y] = camera.canvasToScene(mouseX, mouseY);

  // call mouse event for hiram city
  hiramCity.mousePressed(x, y);
  return false;
}
