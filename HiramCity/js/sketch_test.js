class HiramCity {
  /**
   * @param {p5.Image} map
   * @param {Array<Icon>} icons
   */
  constructor(map, icons) {
    // timestamps
    this.initTime = +moment();
    this.lastDraw = +moment();
    this.td = 0;
    this.duration = (20 * 60 + 30) * 1000;

    this.map = map;
    /**
     * @type {Array<Icon>}
     */
    this.icons = icons;
    this.icons.forEach(icon => console.log(icon));
  }

  update() {
    // create time variables
    let now = +moment();
    this.td = now - this.lastDraw;
    this.lastDraw = now;

    // update icons
    this.icons.forEach(icon => icon.update(this.td, this.initTime));

    return this;
  }
  
  timeToString(time) {
    time = Math.round(time / 1000);
    return Math.floor(time / 60).toString().padStart(2, '0') + ":" + (time % 60).toString().padStart(2, '0');
  }
  
  draw() {
    // draw map
    push();
    // get corner point of map
    translate(- this.map.width / 2, - this.map.height / 2);
    image(this.map, 0, 0);

    // show time
    textSize(14);
    textAlign(CENTER);
    textFont('monospace');
    let time = this.lastDraw - this.initTime;
    time = Math.max(this.duration - time, 0);
    text(this.timeToString(time), 175, 95);
    pop();

    //TODO: maybe adjust here with offset and scale?
    // draw icons
    push();
    fill(0, 0, 255, 63);
    noStroke();
    this.icons.forEach(icon => icon.draw());
    pop();

    return this;
  }

  mousePressed(x, y) {
    // get index of clicked icon
    this.icons.reverse();
    let icon = this.icons.find(icon => icon.inIcon(x, y) && !icon.hidden);
    this.icons.reverse();

    if (icon) icon.onClick();
  }
}

// Global constants
const cMoveSpeed = 10;
const cZoomSpeed = 5;
const dataOffsetX = - (1072 + 464);
const dataOffsetY = 1254 + 278;
const dataScale = 2 / 3;
/**
 * @type {HiramCity}
 */
let hiramCity;
/**
 * @type {Camera}
 */
let camera;

// load assets
let npcData, imgMap, imgWolf, imgBrazier, imgHammer, imgPriestess, imgSettler, imgWolfLeader;
function preload() {
  // tables
  npcData = loadJSON('./data/npc.json');
  npcData = Object.keys(npcData).map(key => npcData[key]);
  
  // textures
  imgMap        = loadImage('./textures/TheFallOfHiramCity.png');
  imgWolf       = loadImage('./textures/wolf.png');
  imgBrazier    = loadImage('./textures/brazier.png');
  imgHammer     = loadImage('./textures/hammer.png');
  imgPriestess  = loadImage('./textures/priestess.png');
  imgSettler    = loadImage('./textures/settler.png');
  imgWolfLeader = loadImage('./textures/wolfLeader.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // camera and its limits
  camera = new Camera();
  camera.maxOffsetX = imgMap.width / 2;
  camera.maxOffsetY = imgMap.height / 2;

  // hiram city scene
  npcData = npcData.map(data => { // transform data to icons
    // preprocessing
    let [x, y] = [
      data[1] * dataScale + dataOffsetX,
      - data[2] * dataScale + dataOffsetY
    ];
    //TODO: special icons per entry
    switch(data[0]) {
      case 502: // priestess
        return new Icon(x, y, 20, imgPriestess);
      case 18675: // wolf
        return new Icon(x, y, 10, imgWolf);
      case 99999: // Settler, wrong ID
        return new Icon(x, y, 10, imgSettler);
      case 18664: // broken farm cart
        return new Icon(x, y, 10, imgHammer);
      case 18703: // brazier
        return new BrazierIcon(x, y);
      case 18698: // Wolf leader
        return new Icon(x, y, 15, imgWolfLeader);
      case 18674: // hiram treant
      case 18677: // hiram reindeer
      default:
        console.log('unknown id: ' + data[0]);
        return new Icon(x, y, 10);
    }
  });
  hiramCity = new HiramCity(imgMap, npcData);

  windowResized();
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
  hiramCity.update().draw();
  pop();

  //TODO: UI elements

  // camera debug info
  camera.debug();
}

function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);
  // readjust camera
  camera.center.set(width / 2, height / 2);
  camera.minScale = Math.min(windowWidth / imgMap.width, windowHeight / imgMap.height);
  camera.maxScale = camera.minScale * 4;
  camera.zoom()
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