var AM = new AssetManager();

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

Animation.prototype.drawFrame2 = function (tick, ctx, xsrc, ysrc, xdest, ydest) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    ctx.drawImage(this.spriteSheet, 
		xsrc, ysrc, 
		this.frameWidth, this.frameHeight, 
		xdest, ydest, 
		this.frameWidth * this.scale, this.frameHeight * this.scale);
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
    this.animation = new Animation(spritesheet, 199, 300, 10, 0.2, 10, true, .5);
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
    this.x -= this.game.clockTick * this.speed;
    if (this.x < 0) this.x = 900;
    
}

function Goomba(game, spritesheet) {
    this.animation = new Animation(spritesheet, 17.5, 25, 6, 0.2, 6, true, 3);
    this.x = 800;
    this.y = 200;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;

}

Goomba.prototype.draw = function () {
    this.animation.drawFrame2(this.game.clockTick, 0, 0, this.ctx, this.x, this.y);
}

Goomba.prototype.update = function () {
    this.x -= this.game.clockTick * this.speed;
    if (this.x < 0) this.x = 900;
}

AM.queueDownload("./enemies-2.png");
AM.queueDownload("./Goombas.png");
AM.queueDownload("./Princess.png");
AM.queueDownload("./background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./background.jpg")));
    gameEngine.addEntity(new Princess(gameEngine, AM.getAsset("./Princess.png")));
    gameEngine.addEntity(new Goomba(gameEngine, AM.getAsset("./Goombas.png")));

    console.log("All Done!");
});