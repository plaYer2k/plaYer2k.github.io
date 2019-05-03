class HiramCity {
  constructor(map) {
    // timestamps
    this.initTime = +moment();
    this.lastDraw = +moment();
    this.td = 0;
    this.duration = 20 * 60 + 30;

    this.map = map;
    /**
     * @type {Array<Icon>}
     */
    this.icons = new Array();
  }

  mousePressed(x, y) {
    this.icons.push(new Icon(x, y));
  }

  humanizedTime() {
    let time = Math.round((this.lastDraw - this.initTime) / 1000);
    time = Math.max(this.duration - time, 0);
    return Math.floor(time / 60).toString().padStart(2, '0') + ":" + (time % 60).toString().padStart(2, '0');
  }

  draw() {
    // create time variables
    let now = +moment();
    this.td = now - this.lastDraw;
    this.lastDraw = now;

    // draw map
    push();
    translate(-this.map.width / 2, -this.map.height / 2);
    image(this.map, 0, 0);

    // show time
    textSize(14);
    textAlign(CENTER);
    textFont('monospace');
    text(this.humanizedTime(), 175, 95);
    pop();

    // draw icons
    let previousIcon = null;
    this.icons.forEach(icon => {
      if (previousIcon) line(previousIcon.pos.x, previousIcon.pos.y, icon.pos.x, icon.pos.y);
      icon.draw(this.td, this.initTime);
      previousIcon = icon;
    });
  }
}

// Global constants
const cMoveSpeed = 10;
const cZoomSpeed = 5;
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

  // get map image
  let map = loadImage('textures/TheFallOfHiramCity.png');

  hiramCity = new HiramCity(map);
  camera = new Camera();
  camera.maxOffset = 500;
  camera.minScale = 1 / 2;
  camera.maxScale = 1 / 0.2;
}

function draw() {
  background(220, 215, 160);

  // add camera movement
  if (keyIsDown(LEFT_ARROW)) camera.moveX(+cMoveSpeed);
  if (keyIsDown(RIGHT_ARROW)) camera.moveX(-cMoveSpeed);
  if (keyIsDown(UP_ARROW)) camera.moveY(+cMoveSpeed);
  if (keyIsDown(DOWN_ARROW)) camera.moveY(-cMoveSpeed);

  push();
  // apply camera
  camera.apply();
  // draw scene
  hiramCity.draw();
  pop();

  //TODO: UI elements
}

function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);
  // recenter camera
  camera.center.set(width / 2, height / 2);
}

// User interaction
function mouseWheel(event) {
  // scale camera
  camera.zoom((100 - (event.delta / Math.abs(event.delta)) * cZoomSpeed) / 100);
  return false;
}

//TODO: if not on UI element
function mousePressed() {
  // get coordinates for scene
  let [x, y] = camera.canvasToScene(mouseX, mouseY);

  // call mouse event for hiram city
  hiramCity.mousePressed(x, y);
  return false;
}