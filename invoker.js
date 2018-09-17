// Screen dimensions
const WIDTH = 755;
const HEIGHT = 745;

// Set enemy state
var enemy = [];

var enemyBullets = [];

var enemyDirection = 0;

var enemyLeft = 0;
var enemyRight = 5;
var teamLeft = 155;
var teamRight = teamLeft + 75 * enemyRight - 5;

var enemySpeed = 0.05;

//Set Game state
var end = false;
var start = false;

var currentInput = {
  space: false,
  left: false,
  right: false,
}

var priorInput = {
  space: false,
  left: false,
  right: false,
}

var x = 0;
var y = 710;
var bullets = [];

var score = 0;
var life = 3;

// Create the canvas and context
var screen = document.createElement('canvas');
var screenCtx = screen.getContext('2d');
screen.height = HEIGHT;
screen.width = WIDTH;
document.body.appendChild(screen);

// Create the back buffer and context
var backBuffer = document.createElement('canvas');
var backBufferCtx = screen.getContext('2d');
backBuffer.height = HEIGHT;
backBuffer.width = WIDTH;

//Create the bullet
function Bullet(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
}

Bullet.prototype.update = function(deltaT,shooter) {
  if(shooter === 0){
    this.y -= deltaT * 0.5;
  }
  else{
    this.y += deltaT * 0.5;
  }

}

Bullet.prototype.render = function(context) {
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(this.x - this.r, this.y - this.r, 2*this.r, 2*this.r, 0, 2 * Math.pi);
  context.fill();
}

//Create the enemy
function Enemy(x,y,alive){
  this.x = x;
  this.y = y;
  this.alive = alive;
}

Enemy.prototype.update = function(deltaT,speed){
  if(teamLeft >= 0 && enemyDirection === 0){
    this.x -= deltaT * speed;
    checkTL();
  }
  else if (teamRight <= WIDTH - 70 && enemyDirection === 1) {
    this.x += deltaT * speed;
    checkTR();
  }
  else{
    updateY();
    enemyDirection = (enemyDirection + 1) % 2;
    checkTR();
    checkTL();
  }

}

Enemy.prototype.render = function(context) {
  context.beginPath();
  context.fillStyle = 'pink';
  context.fillRect(this.x,this.y,70,70);
}

/** @function checkTL
  * track the most left enemy or enemies
  */
function checkTL(){
  var col = 5;
  var row = 0;
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 6; j++){
      if(enemy[i][j].alive === 1){
        if(col > j){
          col = j;
          row = i;
        }
        break;
      }
    }
  }
  enemyLeft = col;
  teamLeft = enemy[row][col].x;
}

/** @function checkTR
  * track the most right enemy or enemies
  */
function checkTR(){
  var col = 0;
  var row = 0;
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 6; j++){
      if(enemy[i][j].alive === 1){
        if(col < j){
          col = j;
          row = i;
        }
      }
    }
  }
  enemyRight = col;
  teamRight = enemy[row][col].x;
}

/** @function updateY
  * let enemies move forward
  */
function updateY(){
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 6; j++){
      enemy[i][j].y += 75;
    }
  }
}


/** @function handleKeydown
  * Event handler for keydown events
  * @param {KeyEvent} event - the keydown event
  */
function handleKeydown(event) {
  switch(event.key) {
    case ' ':
      currentInput.space = true;
      break;
    case 'ArrowLeft':
    case 'a':
      currentInput.left = true;
      break;
    case 'ArrowRight':
    case 'd':
      currentInput.right = true;
      break;
  }
}
// Attach keyup event handler to the window
window.addEventListener('keydown', handleKeydown);

/** @function handleKeyup
  * Event handler for keyup events
  * @param {KeyEvent} event - the keyup event
  */
function handleKeyup(event) {
  switch(event.key) {
    case ' ':
      currentInput.space = false;
      break;
    case 'ArrowLeft':
    case 'a':
      currentInput.left = false;
      break;
    case 'ArrowRight':
    case 'd':
      currentInput.right = false;
      break;
  }
}
// Attach keyup event handler to the window
window.addEventListener('keyup', handleKeyup);




/** @function init
  * initialize the Game
  */
function init(){
  enemy =[];
  enemyBullets = [];
  enemyDirection = 0;
  enemyLeft = 0;
  enemyRight = 5;
  teamLeft = 155;
  teamRight = teamLeft + 75 * enemyRight - 5;
  enemySpeed = 0.05;
  end = false;
  start = false;
  x = 0;
  y = 710;
  bullets = [];
  score = 0;
  life = 3;
  createEnemies();
  window.requestAnimationFrame(loop);
}

/** @function createEnemies
  * fill the enemy array with Enemy object
  */
function createEnemies(){
  var tempx = 80;
  var tempy = -75;
  for(var i = 0; i < 4; i++){
    tempx = 80;
    tempy += 75;
    var enemyArray = [];
    for(var j = 0; j < 6; j++){
      tempx += 75;
      enemyArray.push(new Enemy(tempx,tempy,1));
    }
    enemy.push(enemyArray);
  }
}

/** @function displayInterface
  * display the user interface
  */
function displayInterface(){
  document.getElementById("ui").innerHTML =
  "Life: " + life + "<br />" +
  "Score: " + score;
}

/** @function allDestoryed
  * check whether all enemy has destoryed
  */
function allDestoryed(){
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 6; j++){
      if(enemy[i][j].alive === 1 ){
        return false;
      }
    }
  }
  return true;
}

/** @function ETisCollision
  * check whether the bullet is collision with the enemy
  * @param {Bullet} bullet - the bullet gonna check
  */
function ETisCollision(b){
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 6; j++){
      if(enemy[i][j].alive === 1){
        if(b.y-b.r <= enemy[i][j].y+70 && b.x+b.r >= enemy[i][j].x && b.x-b.r <= enemy[i][j].x+70){
          enemy[i][j].alive = 0;
          return true;
        }
      }
    }
  }
  return false;
}

/** @function PTisCollision
  * check whether the bullet is collision with the player
  * @param {Bullet} bullet - the bullet gonna check
  */
function PTisCollision(b){
  if(b.y + b.r >= 710){
    if(b.x+b.r >= x && b.x-b.r <= x+70){
      return true;
    }
  }
  return false;
}

/** @function touchBottom
  * check whether the enemies arrived the bottom
  */
function touchBottom(){
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 6; j++){
      if(enemy[i][j].alive === 1 && enemy[i][j].y >= HEIGHT - 70){
        return true;
      }
    }
  }
  return false;
}

/** @function checkEnd
  * check whether the game should be ended
  */
function checkEnd(){
  if(life <= 0 || touchBottom()){
    end = true;
  }
}

/** @function loop
  * The main game loop
  * @param {DomHighResTimestamp} timestamp - the current system time,
  * in milliseconds, expressed as a double.
  */
function loop(timestamp) {
  if(!start) start = timestamp;
  var elapsedTime = timestamp - start;
  start = timestamp;
  update(elapsedTime);
  render(elapsedTime);
  copyInput();
  screenCtx.drawImage(backBuffer,0,0);
  displayInterface();
  checkEnd();
  if(allDestoryed()){
    enemy = [];
    createEnemies();
  }
  if(!end){
    window.requestAnimationFrame(loop);
  }
  else{
    var restartButton = document.createElement("BUTTON");
    restartButton.onclick = function(){
      init();
    }
    var t = document.createTextNode("Restart!");
    restartButton.appendChild(t);
    document.getElementById('ui').appendChild(restartButton);
  }
}

/** @function copyInput
  * Copies the current input into the previous input
  */
function copyInput() {
  priorInput = JSON.parse(JSON.stringify(currentInput));
}

/** @function update
  * Updates the game's state
  * @param {double} elapsedTime - the amount of time
  * elapsed between frames
  */
function update(elapsedTime) {
  if(currentInput.space && !priorInput.space) {
    bullets.push(new Bullet(x+35, y , 2));
  }
  if(currentInput.left) {
    x -= 0.5 * elapsedTime;
  }
  if(currentInput.right) {
    x += 0.5 * elapsedTime;
  }
  enemy.forEach(function(el){
    el.forEach(function(e){
      e.update(elapsedTime,enemySpeed);
      var fireChance = Math.floor(Math.random()*2001);
      if(fireChance < 3 && e.alive === 1) enemyBullets.push(new Bullet(e.x+35,e.y+70, 2));
    });
  });
  bullets.forEach(function(bullet, index){
    bullet.update(elapsedTime, 0);
    if(bullet.y <= 0) bullets.splice(index, 1);
    if(ETisCollision(bullet)){
      bullets.splice(index, 1);
      score += 100;
    }
  });
  enemyBullets.forEach(function(eb, index){
    eb.update(elapsedTime, 1);
    if(eb.y >= HEIGHT + eb.r) enemyBullets.splice(index, 1);
    if(PTisCollision(eb)){
      enemyBullets.splice(index, 1);
      life -= 1;
    }
  });
  enemySpeed += 0.000005 * elapsedTime;
}

/** @function render
  * Renders the game into the canvas
  * @param {double} elapsedTime - the amount of time
  * elapsed between frames
  */
function render(elapsedTime) {
  backBufferCtx.clearRect(0, 0, WIDTH, HEIGHT);
  backBufferCtx.fillStyle = "#ff0000";
  backBufferCtx.fillRect(x,y,70,35);
  enemy.forEach(function(el){
    el.forEach(function(e){
      if(e.alive === 1) e.render(backBufferCtx);
    });
  });
  bullets.forEach(function(bullet){
    bullet.render(backBufferCtx);
  });
  enemyBullets.forEach(function(eb){
    eb.render(backBufferCtx);
  });
}

// Start the game loop
init();
