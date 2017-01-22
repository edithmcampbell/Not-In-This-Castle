var AM = new AssetManager();
var dir = true;

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Princess(game, spritesheet) {
    this.animation = new Animation(spritesheet, 199, 300, 10, 0.2, 10, true, 1);
    this.x = 1000;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

Princess.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}


Princess.prototype.update = function () {
    if (this.x <= 0) {
		dir = false;

	}
	if (this.x >= 1000 ) {
	    dir = true;
	   
	}
	if(dir){
	    this.x -= this.game.clockTick * this.speed;
		Entity.prototype.update.call(this);
	}
	if(dir == false){
	    this.x += this.game.clockTick * this.speed;
		Entity.prototype.update.call(this);
	}
	
  
}


function MushroomDude(game, spritesheet) {
    this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true, 1);
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

MushroomDude.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

MushroomDude.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
}


// inheritance 
function Cheetah(game, spritesheet) {
    this.animation = new Animation(spritesheet, 512, 256, 2, 0.05, 8, true, 0.5);
    this.speed = 350;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 250);
}

Cheetah.prototype = new Entity();
Cheetah.prototype.constructor = Cheetah;

Cheetah.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Cheetah.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

// inheritance 
function Guy(game, spritesheet) {
    this.animation = new Animation(spritesheet, 154, 215, 4, 0.15, 8, true, 0.5);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 450);
}

Guy.prototype = new Entity();
Guy.prototype.constructor = Guy;

Guy.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Guy.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}
//new code
function Fireball(game, spritesheet) {
    this.animation = new Animation(spritesheet,1000, 1000, 4, .5, 8, true, 0.10);
	this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 100, 350);
}

Fireball.prototype = new Entity();
Fireball.prototype.constructor = Fireball;

Fireball.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = 0; 
    Entity.prototype.update.call(this);
}

Fireball.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

//AM.queueDownload("./backgroundCastle.jpg");
AM.queueDownload("./Princess.png");
AM.queueDownload("./RobotUnicorn.png");
AM.queueDownload("./guy.jpg");
AM.queueDownload("./mushroomdude.png");
AM.queueDownload("./runningcat.png");
AM.queueDownload("./background.jpg");
AM.queueDownload("./Fireball.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./background.jpg")));
    gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./mushroomdude.png")));
    gameEngine.addEntity(new Princess(gameEngine, AM.getAsset("./Princess.png")));
    gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./runningcat.png")));
    gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./guy.jpg")));
	gameEngine.addEntity(new Fireball(gameEngine, AM.getAsset("./Fireball.png")));

    console.log("All Done!");
});

/**
//var canvas;// the canvas element which will draw on
//var ctx;// the "context" of the canvas that will be used (2D or 3D)function
Function Animation_jump(){
var dx = 50;// the rate of change (speed) horizontal object
var x = 30;// horizontal position of the object (with initial value)
var y = 150;// vertical position of the object (with initial value)
var limit = 10; //jump limit
var jump_y = y;
var WIDTH = 1000;// width of the rectangular area
var HEIGHT = 340;// height of the rectangular area
//var tile1 = new Image ();// Image to be loaded and drawn on canvas
var posicao = 0;// display the current position of the character
var NUM_POSICOES = 6;// Number of images that make up the movement
var goingDown = false;
var jumping;
}

function KeyDown(evt){
    switch (evt.keyCode) {
        case 39:  /* Arrow to the right 
            if (x + dx < WIDTH){
                x += dx;
                posicao++;
                if(posicao == NUM_POSICOES)
                    posicao = 1;

                Update();
            }
            break;    
        case 38:
            jumping = setInterval(Jump, 100);
    }
}

Guy.prototype.draw = function() {      
    ctx.font="20px Georgia";
    ctx.beginPath();
    ctx.fillStyle = "red";   
    ctx.beginPath();
    ctx.rect(x, y, 10, 10);
    ctx.closePath();
    ctx.fill();   
    console.log(posicao);
	}
function LimparTela() {
    ctx.fillStyle = "rgb(233,233,233)";   
    ctx.beginPath();
    ctx.rect(0, 0, WIDTH, HEIGHT);
    ctx.closePath();
    ctx.fill();   
}
function Update() {
    LimparTela();    
    Draw();
}

var Jump = function(){
    if(y > limit && !goingDown){
        y-=10;
        console.log('jumping: ' + y);
    } else{
    goingDown = true;
        y +=10;
        if(y > jump_y){
            clearInterval(jumping);
            goingDown = false;
        }

    }
}

function Start() {
    canvas = document.getElementById("gameWorld");
    ctx = canvas.getContext("2d");
    return setInterval(Update, 100);
}

window.addEventListener('keydown', KeyDown);
Start();
*/
