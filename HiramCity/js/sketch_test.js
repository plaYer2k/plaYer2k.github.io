class HiramCity {
  constructor(map, npcs) {
    // timestamps
    this.initTime = +moment();
    this.lastDraw = +moment();
    this.td = 0;
    this.duration = 20 * 60 + 30;

    this.map = map;
    //TODO: make this prettier
    this.npcs = npcs;
    this.npcs.forEach(npc => console.log(npc));
    /**
     * @type {Array<Icon>}
     */
    this.icons = new Array();
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
    // get corner point of map
    translate(- this.map.width / 2, - this.map.height / 2);
    image(this.map, 0, 0);

    // show time
    textSize(14);
    textAlign(CENTER);
    textFont('monospace');
    text(this.humanizedTime(), 175, 95);
    pop();

    // draw npc
    this.npcs.forEach(npc => npc.draw());
  }

  mousePressed(x, y) {
    let index = this.npcs.findIndex(npc => npc.inIcon(x, y));
    console.log('target: ', index);
    if (index >= 0) this.npcs.splice(index, 1);
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
  //npcData = loadJSON('./assets/npc.json');
  npcData = [[502,2757.62,2320.02,420.561,1],
  [18658,2710.99,2381.99,409.576,1],
  [18658,2703.1,2361.65,408.803,1],
  [18658,2712.24,2387.22,409.612,1],
  [18658,2705.78,2366.98,408.808,1],
  [18659,2648.88,2392.59,404.787,3],
  [18659,2648.08,2357.47,406.782,5],
  [18659,2662.03,2410.97,405.334,7],
  [18662,2746.19,2356.05,410.945,1],
  [18663,2714.4,2375.27,408.501,1],
  [18663,2711.19,2367.51,408.901,1],
  [18664,2223.72,2099.61,397.217,1],
  [18664,2400.47,2037.75,395.868,1],
  [18664,2582.79,2445.41,393.583,1],
  [18664,2669.41,2558.12,406.2,1],
  [18664,2597.3,2340.33,392.723,1],
  [18664,2122.48,2316.36,405.908,1],
  [18664,2180.79,2645.53,389.761,1],
  [18664,2683.53,2082.41,369.053,1],
  [18669,2327.6,2222.41,367.461,1],
  [18669,2416.523,2283.723,372.4283,1],
  [18669,2415.817,2283.78,372.902,1],
  [18669,2415.98,2284.423,372.2227,1],
  [18669,2298.93,2174.817,384.374,1],
  [18669,2404.36,2313.313,384.3634,1],
  [18669,2415.547,2283.513,372.9473,1],
  [18669,2393.58,2433.92,385.248,1],
  [18669,2488.36,2324.25,367.294,1],
  [18669,2404.07,2313.2,383.4464,1],
  [18669,2403.383,2313.32,383.384,1],
  [18669,2529.14,2196.12,363.829,1],
  [18670,2648.88,2392.59,404.787,1],
  [18670,2648.08,2357.47,406.782,1],
  [18670,2662.03,2410.97,405.334,1],
  [18674,2259.9,2424.05,407.954,1],
  [18674,2411.66,2137.73,387.228,1],
  [18674,2197.76,2344.5,403.003,1],
  [18674,2485.74,2043.49,404.848,1],
  [18675,1025.584,1024.335,0.350983,8],
  [18675,2440.84,2643.38,388.807,8],
  [18675,2334.35,2521.06,381.042,8],
  [18675,2487.69,2567.85,380.095,3],
  [18675,2109.71,2226.24,394.989,8],
  [18675,2443,2641.71,388.952,8],
  [18675,2306.53,2162.71,379.156,8],
  [18675,2657.86,2050.29,370.455,8],
  [18675,2623.67,2309.37,403.211,4],
  [18675,2449.27,2391.73,375.57,3],
  [18675,2446.86,2448.81,388.301,4],
  [18675,2598.85,2272.11,401.675,3],
  [18675,2504.3,2109.53,374.49,8],
  [18675,2655.31,2050.45,370.313,8],
  [18675,2109.81,2227.94,394.971,8],
  [18677,2251.346,2390.11,400.2453,5],
  [18677,2555.813,2502.089,393.5553,5],
  [18677,2438.106,2119.217,389.403,5],
  [18682,2614.07,2335.36,398.188,1],
  [18682,2488.44,2363.16,377.85,1],
  [18682,2672.97,2400.53,408.315,1],
  [18691,2734.97,2364,411.51,1],
  [18691,2733.44,2361.24,411.657,1],
  [18697,2707.32,2373.72,408.187,1],
  [18698,1025.584,1024.335,0.350983,1],
  [18698,2440.84,2643.38,388.807,1],
  [18698,2334.35,2521.06,381.042,1],
  [18698,2109.71,2226.24,394.989,1],
  [18698,2443,2641.71,388.952,1],
  [18698,2306.53,2162.71,379.156,1],
  [18698,2657.86,2050.29,370.455,1],
  [18698,2623.67,2309.37,403.211,1],
  [18698,2446.86,2448.81,388.301,1],
  [18698,2504.3,2109.53,374.49,1],
  [18698,2655.31,2050.45,370.313,1],
  [18698,2109.81,2227.94,394.971,1],
  [18703,2657.14,2370.65,403.376,1],
  [18703,2374.73,2261.74,366.195,1],
  [18703,2387.26,2368.99,373.883,1],
  [18703,2575.25,2386.75,391.134,1],
  [18703,2214.55,2213.9,380.166,1],
  [18703,2382.84,2542.92,382.221,1],
  [18703,2511.21,2219.42,361.999,1],
  [18703,2486.12,2328.62,366.725,1],
  [18703,2606.38,2127.91,362.971,1],
  [18713,2718.89,2370.35,408.321,1],
  [18714,2718.69,2369.99,408.321,1],
  [18715,2718.49,2369.63,408.321,1],
  [18716,2718.28,2369.28,408.321,1],
  [18720,2778.1,2320.34,423.102,1],
  [18721,2777.94,2322.17,422.973,1],
  [18895,2251.346,2390.11,400.2453,1],
  [18895,2555.813,2502.089,393.5553,1],
  [18895,2438.106,2119.217,389.403,1],
  [18900,2776.37,2320.3,422.973,1],
  [18900,2779.75,2322.28,423,1],
  [18900,2776.12,2321.89,422.973,1],
  [18900,2779.62,2320.57,422.973,1],
  [18902,2759.55,2327.89,420.049,1],
  [18912,2749.33,2352.69,410.747,1],
  [18978,2706.82,2357.31,409.184,1],
  [19031,2761.12,2327.43,420.541,1]];

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
  console.log(camera);
  // scale image to fit the window
  camera.zoom(Math.min(windowWidth / imgMap.width, windowHeight / imgMap.height));
  camera.minScale = 1 / 1.5;
  camera.maxScale = 1 / 0.2;

  // hiram city scene
  npcData = npcData.map(data => { // transform data to icons
    let [x, y] = [
      data[1] * dataScale + dataOffsetX,
      - data[2] * dataScale + dataOffsetY
    ];
    let img;
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
        return new Icon(x, y, 10, imgBrazier);
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

  // camera debug info
  camera.debug();
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