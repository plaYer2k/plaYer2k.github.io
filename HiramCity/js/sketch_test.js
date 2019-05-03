class HiramCity {
  constructor() {
    // timestamps
    this.initTime = +moment();
    this.lastDraw = +moment();
    this.td = 0;
    this.duration = 20 * 60;

    this.map = loadImage('./textures/TheFallOfHiramCity.png');
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
  if (keyIsDown(LEFT_ARROW)) camera.moveX(+cameraSpeed);
  if (keyIsDown(RIGHT_ARROW)) camera.moveX(-cameraSpeed);
  if (keyIsDown(UP_ARROW)) camera.moveY(+cameraSpeed);
  if (keyIsDown(DOWN_ARROW)) camera.moveY(-cameraSpeed);

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

function mouseWheel(event) {
  // scale camera (event delta is either -3 or +3)
  camera.zoom((100 - event.delta * 2) / 100);

  return false;
}

function mousePressed() {
  // get coordinates for scene
  let [x, y] = camera.canvasToScene(mouseX, mouseY);

  // call mouse event for hiram city
  hiramCity.mousePressed(x, y);
  return false;
}