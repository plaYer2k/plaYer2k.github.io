/*
  TODO features
  > essential
  add time controls (reset, +-5s, +-10s, +-1min)
  waves of civillians and wolfes
  - give waves a pre-spawn animation
  - give waves a path (animate it)
  
  > quality
  resource sources with clickable gather times and respawns
  add sounds on wave spawn (+checkbox)
  
  > luxory
  add colorpicker for background
*/

var img;
const imgWidth = 928;
const imgHeight = 556;
const headerHeight = 40;
const canvasHeight = headerHeight + imgHeight;
let howlSound;
let settlerSound;

const tStart = 1220;
const tStartDelay = 6;
const tShifts = [1, 5, 10, 30, 60];
let t = tStart + tStartDelay + 10;
let scale = 1.0;
let scaleSlider;

let campNode;
let spawns = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  img = createImg('textures/TheFallOfHiramCity.png');
  img.hide();
  
  // should create a state update etc. here
  setInterval(() => t--, 1000);
  
  // buttons and slider
  scaleSlider = createSlider(0.5, 4.0, 1.0, 0.05);
  scaleSlider.position(45,10);
  
  let buttonStart = createButton("Start: 20:20");
  buttonStart.position(180,0);
  buttonStart.size(120,20);
  buttonStart.mousePressed(tSetStart);
  
  let buttonPreStart = createButton("Ready: 30s");
  buttonPreStart.position(180,20);
  buttonPreStart.size(120,20);
  buttonPreStart.mousePressed(tSetThirtySecToStart);
  
  tShifts.forEach((time, index) => {
    let shift = e => t += Number.parseInt(e.target.dataset.time) || 0;
    let button = createButton('+' + time + 's');
    button.position(300 + 60 * index, 0);
    button.size(60,20);
    button.elt.dataset.time = time;
    button.elt.addEventListener('click', shift);
    
    button = createButton('-' + time + 's');
    button.position(300 + 60 * index, 20);
    button.size(60,20);
    button.elt.dataset.time = -time;
    button.elt.addEventListener('click', shift);
  });
  
  // Sound elements
  howlSound = createAudio("sounds/howl.mp3");
  howlSound.volume(0.2);
  
  settlerSound = createAudio("sounds/okayLetsGo.mp3");
  settlerSound.volume(0.2);
  
  campNode = new PathNode(731, 229, null);
  let lastNode;
  lastNode = new PathNode(715, 226, campNode);
  lastNode = new PathNode(695, 224, lastNode);
  lastNode = new PathNode(674, 223, lastNode);
  lastNode = new PathNode(651, 224, lastNode);
  lastNode = new PathNode(643, 225, lastNode);
  lastNode = new PathNode(634, 229, lastNode);
  lastNode = new PathNode(607, 245, lastNode);
  lastNode = new PathNode(601, 250, lastNode);
  lastNode = new PathNode(595, 258, lastNode);
  lastNode = new PathNode(588, 271, lastNode);
  let nodeJunk = lastNode;
  lastNode = new PathNode(589, 283, lastNode);
  lastNode = new PathNode(592, 296, lastNode);
  lastNode = new PathNode(594, 303, lastNode);
  lastNode = new PathNode(599, 311, lastNode);
  lastNode = new PathNode(606, 321, lastNode);
  lastNode = new PathNode(612, 331, lastNode);
  lastNode = new PathNode(617, 341, lastNode);
  lastNode = new PathNode(621, 353, lastNode);
  lastNode = new PathNode(623, 360, lastNode);
  lastNode = new PathNode(624, 370, lastNode);
  let nodeJunkL = lastNode;
  lastNode = new PathNode(623, 378, lastNode);
  lastNode = new PathNode(617, 388, lastNode);
  lastNode = new PathNode(607, 399, lastNode);
  lastNode = new PathNode(602, 403, lastNode);
  spawns.push(new Spawn(lastNode, 'LR'));
  lastNode = nodeJunkL;
  
  lastNode = new PathNode(629, 379, lastNode);
  lastNode = new PathNode(637, 385, lastNode);
  lastNode = new PathNode(645, 388, lastNode);
  lastNode = new PathNode(673, 388, lastNode);
  lastNode = new PathNode(681, 392, lastNode);
  lastNode = new PathNode(688, 400, lastNode);
  lastNode = new PathNode(703, 427, lastNode);
  lastNode = new PathNode(705, 434, lastNode);
  lastNode = new PathNode(704, 444, lastNode);
  lastNode = new PathNode(698, 451, lastNode);
  spawns.push(new Spawn(lastNode, 'LL'));
  lastNode = nodeJunk;
  lastNode = new PathNode(582, 274, lastNode);
  lastNode = new PathNode(564, 273, lastNode);
  lastNode = new PathNode(549, 270, lastNode);
  let nodeJunkR = lastNode;
  lastNode = new PathNode(539, 275, lastNode);
  lastNode = new PathNode(524, 289, lastNode);
  lastNode = new PathNode(519, 296, lastNode);
  lastNode = new PathNode(508, 315, lastNode);
  lastNode = new PathNode(498, 325, lastNode);
  lastNode = new PathNode(485, 331, lastNode);
  lastNode = new PathNode(462, 336, lastNode);
  lastNode = new PathNode(408, 337, lastNode);
  lastNode = new PathNode(376, 334, lastNode);
  lastNode = new PathNode(347, 324, lastNode);
  spawns.push(new Spawn(lastNode, 'RL'));
  lastNode = nodeJunkR;
  lastNode = new PathNode(543, 264, lastNode);
  lastNode = new PathNode(533, 247, lastNode);
  lastNode = new PathNode(528, 236, lastNode);
  lastNode = new PathNode(527, 215, lastNode);
  lastNode = new PathNode(529, 202, lastNode);
  lastNode = new PathNode(529, 188, lastNode);
  lastNode = new PathNode(527, 177, lastNode);
  lastNode = new PathNode(519, 162, lastNode);
  lastNode = new PathNode(518, 156, lastNode);
  lastNode = new PathNode(518, 141, lastNode);
  lastNode = new PathNode(521, 131, lastNode);
  lastNode = new PathNode(528, 114, lastNode);
  lastNode = new PathNode(547, 72, lastNode);
  lastNode = new PathNode(551, 65, lastNode);
  lastNode = new PathNode(568, 47, lastNode);
  lastNode = new PathNode(571, 37, lastNode);
  lastNode = new PathNode(571, 25, lastNode);
  lastNode = new PathNode(568, 12, lastNode);
  spawns.push(new Spawn(lastNode, 'RR'));
  
}

// Time shift functions
function tSetStart() { t = tStart; }
function tSetThirtySecToStart() { t = tStart + tStartDelay + 30; }

function draw() {
  if(t < 0) t = 0;
  
  background(220,215,160);
  image(img, 0, headerHeight, imgWidth*scale, imgHeight*scale);
  
  
  /*
  var tMod = t%30;
  if(tMod == 0)
    howlSound.play();
  else if (tMod == 15)
    settlerSound.play();
  */
  
  stroke(0);
  strokeWeight(0);
  // Scale slider
  textSize(14);
  text("Scale: ", 5, 15);
  scale = scaleSlider.value();
  text(scale, 10, 30);
  
  // Time display
  textSize(14*scale);
  text(timeToString(t) ,
    125*scale,
    headerHeight + 95*scale
  );
  
  
  // Draw path from all spawns to camp
  stroke(255,0,0);
  strokeWeight(3*scale);
  for(let i = 0; i < spawns.length; i++){
    let curNode = spawns[i].node;
    while(curNode.prevNode != null) {
      line(curNode.x * scale, curNode.y * scale + headerHeight, curNode.prevNode.x * scale, curNode.prevNode.y * scale + headerHeight);
      curNode = curNode.prevNode;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function timeToString(t) {
  let text;
  if( t <= 0) return '     - finished -';
  else if (t <= tStart) return 'Time: 00:' + ('00' + floor(t/60)).slice(-2) + ':' + ('00' + t%60).slice(-2);
  else if (t >= tStart + tStartDelay) return 'Wait time: ' + ('00' + floor((t-tStart-tStartDelay)/60)).slice(-2) + ':' + ('00' + (t-tStart-tStartDelay)%60).slice(-2);
  else return ' starting in: ' + (t - tStart) + ' s';
}