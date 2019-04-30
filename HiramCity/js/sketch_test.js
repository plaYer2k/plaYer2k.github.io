

class HiramCity {
  constructor() {
    // timestamps
    this.initTime = +moment();
    this.lastDraw = +moment();

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
    let time = +moment();
    let td = time- this.lastDraw;
    this.lastDraw = time;

    // draw icons
    let previousIcon = null;
    this.icons.forEach(icon => {
      if (previousIcon) line(previousIcon.pos.x, previousIcon.pos.y, icon.pos.x, icon.pos.y);
      icon.draw(td, this.initTime);
      previousIcon = icon;
    });
  }
}

class Camera {
  constructor() {
    this.scale = 1.0;
    this.offset = createVector(0, 0);
    this.center = createVector(width / 2, height / 2);
  }

  zoom(scale) {
    // get old center position
    let [x, y] = this.canvasToScene(width / 2,  height / 2);
    let c1 = createVector(x, y);

    // scale
    this.scale *= scale;

    // get new center position
    [x, y] = this.canvasToScene(width / 2,  height / 2);
    let c2 = createVector(x, y);

    // difference between old and new center
    this.offset.sub(c1.sub(c2).div(this.scale / 2));
  }

  canvasToScene(x, y) {
    return [(x - this.offset.x - this.center.x) / this.scale, (y - this.offset.y - this.center.y) / this.scale];
  }

  sceneToCanvas(x, y) {
    return [(x + this.offset.x + this.center.x) * this.scale, (y + this.offset.y + this.center.y) * this.scale];
  }

  apply() {
    // move to center
    translate(this.center.x, this.center.y);
    // move to offset
    translate(this.offset.x, this.offset.y);
    // scale scene
    scale(this.scale);
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
