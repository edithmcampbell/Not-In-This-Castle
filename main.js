var AM = new AssetManager();
var dir = true;
//var isCollision = false;
var isDead = false;
var level = 1;
var isFalling = true;
var gstmp = new Audio("./Stomp.wav");
bgm = new Audio("./Castle.mp3");

function Animation(spritesheets, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spritesheets = spritesheets;
    this.spritesheet = spritesheets[0];
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

Animation.prototype.change = function (spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spritesheet = spritesheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    //this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;

}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {

    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop)
            this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spritesheet,
            xindex * this.frameWidth, yindex * this.frameHeight, // source from sheet
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

Entity.prototype.collisionY = function (other) {

    if (this.y <= other.y) {
        if (this.y + this.height < other.y)
            return false;
        return true;
    } else {
        if (this.y > other.y + other.height)
            return false;
        return true;
    }
}
Entity.prototype.collision = function (other) {

    if (this.abs <= other.abs && !(this.isDead) && !(other.isDead))
    {
        if (this.abs + this.width < other.abs) {
            return false;
        }
        if (!(this instanceof Fireball)) {

            return this.collisionY(other);
        } else if (Math.abs((this.abs + this.width) - other.abs) < 2000 && Math.abs(this.y - other.y) < 10) {
            return true;
        } else {
            return false;
        }
    } else {
        if (this.abs > other.abs + other.width)
            return false;
        if (!(this instanceof Fireball)) {
            return this.collisionY(other);
        } else if (Math.abs((this.abs) - other.abs + other.width) < 2000 && Math.abs(this.y - other.y) < 10) {
            return true;
        } else {
            return false;
        }
    }
    return false;
    /* 
     return (this.x + this.width < other.x + other.width
     && this.x + this.width > other.x 
     && this.y < other.y + other.height
     && this.height + this.y > other.y); */
}


// no inheritance
function Background(game, spritesheets) {
    this.animation = new Animation(spritesheets, 2000, 320, 1, 0.4, 1, true, 2);
    this.spritesheets = spritesheets;
    this.x = 0;
    this.y = 0;
    this.level = 1;
    //this.width = 1200;
    //this.height = 640;
    this.game = game;
    this.ctx = game.ctx;
    this.drawPriority = 1;

}


Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
};

Background.prototype.update = function () {
};
// no inheritance
function cutscene(game, spritesheets) {
    this.animation = new Animation(spritesheets, 800, 700, 40, 0.4, 40, false, 1);
    this.x = 0;
    this.y = 0;
    //this.width = 1200;
    //this.height = 640;
    this.game = game;
    this.ctx = game.ctx;
    this.drawPriority = 5;

}


cutscene.prototype = new Entity();
cutscene.prototype.constructor = Background;

cutscene.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
};


function endscreen(game, spritesheets, frames) {
    this.animation = new Animation(spritesheets, 800, 700, frames, 0.2, frames, true, 1);
    this.x = 0;
    this.y = 0;
    //this.width = 1200;
    //this.height = 640;
    this.game = game;
    this.ctx = game.ctx;
    this.visible = true;
    this.drawPriority = 5;

}


endscreen.prototype = new Entity();
endscreen.prototype.constructor = Background;

endscreen.prototype.draw = function () {
    if (this.visible){
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
};


function Block(game, spritesheets, background, x, y) {
    this.bg = background;
    this.spritesheets = spritesheets;
    this.spritesheet = spritesheets[0];
    this.origin = x;
    this.abs = x;
    this.x = x;
    this.y = y;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, x, y, 0, 0);
    this.isDead = false;
    this.drawPriority = 2;
}
;


Block.prototype = new Entity();
Block.prototype.constructor = Block;

Block.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Block.prototype.update = function () {
    this.x = this.bg.x + this.origin;
    this.abs = this.bg.x + this.origin;
};

function Cam(game, background, princess) {
    this.x = 350;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    bg = background;
    mc = princess;
    this.drawPriority = 4;
}

Cam.prototype.update = function () {
    if(bg.level%2>0){
        if (mc.x >= this.x &&(mc.game.walking || mc.game.jump) && bg.x > bg.game.surfaceWidth - bg.animation.frameWidth * bg.animation.scale) {
            bg.x = bg.x - mc.speed * mc.game.clockTick;
        } else if (mc.x > 0 && (mc.game.walking || mc.game.jump) && !mc.dir && bg.x < 0) {
            bg.x = bg.x + mc.speed * mc.game.clockTick;
        }
    } else {
        if (mc.game.ctx.canvas.width - mc.x - mc.width * 2 > this.x &&(mc.game.walking || mc.game.jump) && bg.x < 0) {
            bg.x = bg.x + mc.speed * mc.game.clockTick;
        } else if (mc.x + mc.width + 10 >= mc.game.ctx.canvas.width && (mc.game.walking || mc.game.jump) && bg.x > bg.game.surfaceWidth - bg.animation.frameWidth * bg.animation.scale) {
            bg.x = bg.x - mc.speed * mc.game.clockTick;
        }
    }
};


Cam.prototype.draw = function () {

};

function Princess(game, spritesheets, backgroundEnt) {
    this.animation = new Animation(spritesheets, 48, 80, 4, 0.2, 4, true, 1.25);
    this.x = 2;
    this.y = 565;
    this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.speed = 125;
    this.game = game;
    this.ctx = game.ctx;
    this.abs = this.x;
    this.dir = true;
    this.walking = false;
    this.jumpAnimation = new Animation(spritesheets, 48, 80, 4, 0.2, 4, true, 1.25);
    this.jumping = false;
    this.isFalling = false;
    this.ground = 565;
    this.isDead = false;
    this.key = false;
    this.jumpPoint = this.ground;
    this.bg = backgroundEnt;
    this.drawPriority = 4;

}
Princess.prototype = new Entity();
Princess.prototype.constructor = Princess;

Princess.prototype.draw = function () {
    if (isDead === false) {

        if (this.jumping) {
            this.jumpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x + 17, this.y - 34);

        } else {
            this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        }
        //Entity.prototype.draw.call(this);
    }
}


Princess.prototype.update = function (gameEngine) {
    if (isDead === false) {
        this.onBlock = false;
        for (var i = 0; i < this.game.blocks.length; i++) {
            var block = this.game.blocks[i];
            //console.log(this.x + " " + this.game.blocks[i].x)
	                if (this.x + 24 >= block.x
                    && this.x <= block.x + 40) {
                if (this.y >= block.y && this.y <= block.y + 74) {
                    this.isFalling = true;
                    console.log("NO BLOCK");
                } else if (this.y >= block.y - 90 && this.y <= block.y + 10) {
                    this.y = block.y - 75;
                    this.ground = block.y - 75;
                    this.onBlock = true;
                    this.isFalling = false;
                    if (this.onBlock && !this.jumping) {
                        this.jumpPoint = this.ground;
                        this.jumpAnimation.elapsedTime = 0;
                    }
                    this.jumping = false;
//                    console.log("BLOCK");
                    break;
                } else if (!this.onBlock) {
                    this.ground = this.game.blocks[0].y - 75;
                    this.onBlock = false;
                    this.isFalling = true;
//                    console.log("NO BLOCK")
                }
            }
        }
//                console.log(this.game.blocks[0].y - 75);

        if (this.isFalling && !this.isDead) {
//			console.log("FALL");
            //this.isFalling = true;
            this.y += 2;
        } else if (this.onBlock && !this.game.w) {
            this.isFalling = false;
            this.jumping = false;
            this.jumpAnimation.elapsedTime = 0;
        }
	//console.log((this.bg >= -10) + " " + (this.x <= 60) + " " + this.key + " " + (this.bg.level == 2));
	if (this.bg.x >= 0 && this.x <= 60 && this.key && !this.game.win && this.bg.level == 2) {
	    this.game.gameOver = true;
	    this.game.win = true;
	    winscreen = new endscreen(this.game, [AM.getAsset("./peachdance.png")], 22);
	    this.game.addEntity(winscreen);
	    bgm.pause();
	    bgm.currentTime = 0;
	    var win = new Audio("./win.wav");
	    win.play();
	    console.log("WIN");
	} else if (this.bg.x <= -3200 && this.x >= 700 && this.key && !this.game.win && this.bg.level%2 !== 0) {
            
            this.game.win = true;
            winscreen = new endscreen(this.game, [AM.getAsset("./peachdance.png")], 22);
            this.game.addEntity(winscreen);
            bgm.pause();
            bgm.currentTime = 0;
            var win = new Audio("./win.wav");
            win.play();
            console.log("LEVEL CLEARED");
            setTimeout(function(){
                winscreen.visible = false;
//                this.ctx.clearRect(0, 0, 700, 800);
                bgm.play();
            }, 10000);
            this.bg.level = this.bg.level + 1;
//            console.log(this.level);
            this.bg.animation.change(this.bg.spritesheets[(this.bg.level)-1], 2000, 320, 2, 0.2, 2, true, 2);
            
            var blocks = [];
            var blockSprites = this.game.blocks[0].spritesheets;
            for (var i = 0; i < 64; i++) {
                var blk = new Block(this.game, blockSprites, this.bg, i * 64, 640);
                blocks.push(blk);
            }
	    for (var i = 300; i<= 428; i+=64) {
		var blk = new Block(this.game, blockSprites, this.bg, i, 576);
		blocks.push(blk);
	    }
	    for (var i = 500; i<= 756; i+=64) {
		var blk = new Block(this.game, blockSprites, this.bg, i, 200);
		blocks.push(blk);
	    }
	    for (var i = 800; i <= 928; i+= 64) {
		var blk = new Block(this.game, blockSprites, this.bg, i, 350);
		blocks.push(blk);
	    }
	    for (var i = 1000; i <= 1512; i+=64) {
		var blk = new Block(this.game, blockSprites, this.bg, i, 500);
		blocks.push(blk);
	    } 
            for (var i = 1600; i <= 1792; i+=64) {
                var blk = new Block(this.game, blockSprites, this.bg, i, 300);
                blocks.push(blk);
            }
            for (var i = 1900; i <= 2156; i+=64) {
                var blk = new Block(this.game, blockSprites, this.bg, i, 450);
                blocks.push(blk);
            }
            for (var i = 2000; i <= 2128; i+=64) {
                var blk = new Block(this.game, blockSprites, this.bg, i, 200);
                blocks.push(blk);
            }
            for (var i = 2300; i <= 2940; i+=64) {
                var blk = new Block(this.game, blockSprites, this.bg, i, 576);
                blocks.push(blk);
            }
            for (var i = 2428; i <= 2812; i+=64) {
                var blk = new Block(this.game, blockSprites, this.bg, i, 512);
                blocks.push(blk);
            }
            for (var i = 2556; i <= 2684; i+=64) {
                var blk = new Block(this.game, blockSprites, this.bg, i, 448);
                blocks.push(blk);
            }
            for (var i = 2850; i <= 3106; i+=64) {
                var blk = new Block(this.game, blockSprites, this.bg, i, 275);
                blocks.push(blk);
            }
            for (var i = 3300; i <= 3492; i+=64) {
                var blk = new Block(this.game, blockSprites, this.bg, i, 200);
                blocks.push(blk);
            }
            this.game.blocks = blocks;
            
            var enemies = [];
	    var koopaSprites = this.game.enemies[0].spritesheets;
            var goombaSprites = this.game.enemies[1].spritesheets;
	    var gmb = new Goomba(this.game, goombaSprites, this.bg, 850, 310, 800, 915);
	    enemies.push(gmb);
	    for (var i = 0; i <= 5; i++) {
		var gmb = new Goomba(this.game, goombaSprites, this.bg, 1050 + i*100, 600, 1000, 1551);
		if (i%2) {
		    gmb.dir = false;
		}
		enemies.push(gmb);
	    }
	    gmb = new Goomba(this.game, goombaSprites, this.bg, 1650, 260, 1600, 1780);
	    enemies.push(gmb);
	    gmb = new Goomba(this.game, goombaSprites, this.bg, 1750, 260, 1600, 1780);
	    gmb.dir = false;
	    enemies.push(gmb);
	    var koopa = new Koopa(this.game, koopaSprites, this.bg, 1800, 575, 1600, 2200);
	    enemies.push(koopa);
	    koopa = new Koopa(this.game, koopaSprites, this.bg, 2000, 385, 1900, 2150);
	    enemies.push(koopa);
            gmb = new Goomba(this.game, goombaSprites, this.bg, 3500, 600, 3000, 3600);
            enemies.push(gmb);
            gmb = new Goomba(this.game, goombaSprites, this.bg, 3400, 160, 3300, 3480);
            enemies.push(gmb);
            this.game.enemies = enemies;
            
            var coins = [];
            var coinSprites = this.game.coins[0].spritesheets;
	    for (var i = 500; i <= 756; i+=80) {
		var cn = new Coin(this.game, coinSprites, this.bg, i, 135);
		coins.push(cn);
	    } 
	    for(var i = 980; i <= 1540; i+=80) {
		var cn = new Coin(this.game, coinSprites, this.bg, i, 435);
		coins.push(cn);
	    }
	    for (var i = 1600; i< 2300; i+=80) {
		var cn = new Coin(this.game, coinSprites, this.bg, i, 575);
		coins.push(cn);
	    }
            for (var i = 2300; i < 2428; i+= 80){
                var cn = new Coin(this.game, coinSprites, this.bg, i, 525);
                coins.push(cn);
            }
            for (var i = 2428; i < 2556; i+=80) {
                var cn = new Coin(this.game, coinSprites, this.bg, i, 450);
                coins.push(cn);
            }
            for (var i = 2556; i < 2800; i+=80) {
                var cn = new Coin(this.game, coinSprites, this.bg, i, 400);
                coins.push(cn);
            }
	    var keySprites = this.game.keyEnt.spritesheets;
            var keyEnt = new Key(this.game, keySprites, backgroundEnt, 2075, 100);
    	    this.game.keyEnt = keyEnt;
            for (var i = 2860; i < 3106; i+=80) {
                var cn = new Coin(this.game, coinSprites, this.bg, i, 225);
                coins.push(cn);
            }
            this.game.coins = coins;
            
            for (var i = 0; i < this.game.entities.length; i++) {
                var ent = this.game.entities[i];
                if (ent.drawPriority === 3 || ent.drawPriority === 2) {
                    ent.removeFromWorld =  true;
                }
            }
            for (var i = 0; i < this.game.blocks.length; i++) {
                this.game.addEntity(this.game.blocks[i]);
            }
            for (var i = 0; i < this.game.enemies.length; i++) {
                //console.log(this.game.enemies[i].x);
                this.game.addEntity(this.game.enemies[i]);
            }
            for (var i = 0; i < this.game.coins.length; i++) {
                //console.log(this.game.coins[i] +this.game.coins[i].x);
                this.game.addEntity(this.game.coins[i]);
            }
	    this.game.addEntity(keyEnt);
            this.dir = false;
            this.key = false;
           
        }
        if (this.game.d) {
            this.dir = true;
        } else if (this.game.a) {
            this.dir = false;
        }
        //if (this.x <= 0) {
        //	this.dir = true;
        //}
        //if (this.x >= 750 ) {
        //	this.dir = false;

        //}

        if (this.dir) {		// facing right
	    if (this.game.walking && 
                    (((this.bg.level%2  < 1 && ((this.x < this.ctx.canvas.width - this.width))))||
                    (this.bg.level%2  > 0 &&((this.x < 350)||(bg.x <= bg.game.surfaceWidth - bg.animation.frameWidth * bg.animation.scale))))) {
                this.x += this.game.clockTick * this.speed;
            }
            if (this.game.walking && ((this.x < 350) || (bg.x <= bg.game.surfaceWidth - bg.animation.frameWidth * bg.animation.scale && this.x < this.game.surfaceWidth - this.animation.frameWidth))) {
                this.x += this.game.clockTick * this.speed;
            }
            // moving/jumping to the right
//                        if(!this.jumping && !this.isFalling && this.game.w){
//                                this.jumping = true;
//                                var jumpPoint = this.ground;
//                            }
//                            console.log(this.jumpPoint);
            if (this.game.w && (this.onBlock || this.jumping)) {
//                                if (this.onBlock){
//					var jumpPoint = this.ground;
//					this.animation.elapsedTime = 0;
//				}
//                                this.jumping = true;
                var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
                if (this.jumpAnimation.elapsedTime > this.jumpAnimation.totalTime * 5 / 7) {
                    this.jumping = false;
                } else {
                    this.jumping = true;
                }
                var totalHeight = 200;

                if (jumpDistance > 0.5)
                    jumpDistance = 1 - jumpDistance;

                //var height = jumpDistance * 2 * totalHeight;
                var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
                this.y = this.jumpPoint - height;



                this.jumpAnimation.change(this.jumpAnimation.spritesheets[6], 56, 80, 7, 0.2, 7, true, 1.5);


            } else if (this.game.s) {
                this.animation.change(this.animation.spritesheets[4], 67, 80, 3, 0.2, 3, true, 1.25); 	// crouch right
            } else if (this.game.walking && ((this.x > 0) || (bg.x <= bg.game.surfaceWidth - bg.animation.frameWidth * bg.animation.scale && this.x < this.game.surfaceWidth))) {
                this.animation.change(this.animation.spritesheets[2], 48, 80, 4, 0.2, 4, true, 1.25);	// walking right
            } else if (this.game.throw) {	// throw right
                this.animation.change(this.animation.spritesheets[8], 80, 80, 3, 0.2, 3, true, 1.5)
                if (this.animation.elapsedTime > this.animation.totalTime * 23 / 24) {
                    this.game.addEntity(new Fireball(this.game, fireballSprites, this, bg));
                    this.animation.elapsedTime = 0;
                }
                ;
            } else {
                this.animation.change(this.animation.spritesheets[0], 48, 80, 9, 0.2, 9, true, 1.25);	// standing right
//			console.log("nope");
            }
        } else {			// facing left
            if (this.game.walking && ((this.bg.level%2 <1 &&((this.x >= 350) || ((bg.x >= 0 && this.x > 0)))) || (this.bg.level%2>0 &&this.x > 0 ))){
                this.x -= this.game.clockTick * this.speed;		// walking/moving to the left
            }
            if (this.game.walking && this.x > 0) {
                this.x -= this.game.clockTick * this.speed;		// walking/moving to the left
            }
//            console.log(this.jumpPoint);
            if (this.game.w && (this.onBlock || this.jumping)) {
//                                if (this.onBlock){
//					var jumpPoint = this.ground;
//					this.animation.elapsedTime = 0;
//				}
//                                this.jumping = true;
                var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
                if (this.jumpAnimation.elapsedTime > this.jumpAnimation.totalTime * 3 / 7) {
                    this.jumping = false;
                } else {
                    this.jumping = true;
                }
                var totalHeight = 200;

                if (jumpDistance > 0.5)
                    jumpDistance = 1 - jumpDistance;

                //var height = jumpDistance * 2 * totalHeight;
                var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
                this.y = this.jumpPoint - height;



                this.jumpAnimation.change(this.jumpAnimation.spritesheets[7], 56, 80, 7, 0.2, 7, true, 1.5);


            } else if (this.game.s) {
                this.animation.change(this.animation.spritesheets[5], 67, 80, 3, 0.2, 3, true, 1.25);	// crouch left
            } else if (this.game.walking) {
                this.animation.change(this.animation.spritesheets[3], 48, 80, 4, 0.2, 4, true, 1.25);	// walking left
            } else if (this.game.throw) { // throw left
                this.animation.change(this.animation.spritesheets[9], 80, 80, 3, 0.2, 3, true, 1.5);
                if (this.animation.elapsedTime > this.animation.totalTime * (23 / 24)) {
                    this.game.addEntity(new Fireball(this.game, fireballSprites, this, bg));
                    this.animation.elapsedTime = 0;
                }
            } else {
                this.animation.change(this.animation.spritesheets[1], 48, 80, 9, 0.2, 9, true, 1.25);	// standing left
            }
        }

        if (!this.onBlock && this.dir) {
//			this.jumping = true;
            this.animation.change(this.jumpAnimation.spritesheets[6], 56, 80, 7, 0.2, 7, true, 1.5)
            this.y += 2; // After jump it drops.
            this.isFalling = true;
//			if(this.isFalling && this.game.w){
//				this.isFalling = false;
//			}
        } else if (!this.onBlock && !this.dir) {
//            this.jumping = true;
            this.animation.change(this.jumpAnimation.spritesheets[7], 56, 80, 7, 0.2, 7, true, 1.5)
            this.y += 2; // After jump it drops.
            this.isFalling = true;
//			if(this.isFalling && this.game.w){
//				this.isFalling = false;
//			}

        }
        if (!this.game.w && this.isFalling && this.dir) {
//                    this.jumpAnimation.elapsedTime= ;
            this.jumpAnimation.change(this.jumpAnimation.spritesheets[6], 56, 80, 7, 0.2, 7, true, 1.5);
//                    this.jumpAnimation.
        } else if (!this.game.w && this.isFalling && !this.dir) {
                    this.jumpAnimation.change(this.jumpAnimation.spritesheets[7], 56, 80, 7, 0.2, 7, true, 1.5);
//                    this.jumpAnimation.elapsedTime = 3;
        }

        for (var i = 0; i < this.game.enemies.length; i++) {
            var ent = this.game.enemies[i];
            if (!(ent === this) && this.collision(ent) && (ent instanceof Goomba) && !this.isDead) {
                //console.log("COLLISION!");
                if (ent.y - 35 !== this.y) {
                    var gstmp = new Audio("./Stomp.wav");
                    gstmp.play();
                    ent.removeFromWorld = true;
                    ent.isDead = true;
                    ent.x = -1000;
                    ent.abs = ent.x;
                    ent.y = -1000;
                    this.game.score += 10;
                    //console.log(this.isDead);
                } else if ((ent instanceof Goomba) && !(ent.isDead)) {
                    this.isDead = true;
                    this.x = -1000;
                    this.y = -1200;
                    bgm.pause();
                    bgm.currentTime = 0;
                    var dead = new Audio("./death.mp3");
                    dead.play();
//					 this.game.clockTick.freeze();
                    this.game.gameOver = true;
                    this.game.addEntity(new endscreen(this.game, [AM.getAsset("./peachcry.png")], 3));
                    console.log("GAME OVER");
                } 
            } else if (!(ent === this) && this.collision(ent) && (ent instanceof Koopa) && !this.isDead) {
		//console.log(ent.y + " " + this.y);
		if ((ent.y >= this.y + 10) && !ent.inShell) {
		    var kstomp = new Audio("./Stomp.wav");
		    kstomp.play();
		    ent.inShell = true;
		    ent.speed = 0;
		    if (ent.dir) {
			ent.animation.change(ent.spritesheets[2], 32, 36, 8, .2, 8, true, 2.5);
		    } else {
			ent.animation.change(ent.spritesheets[3], 32, 36, 8, .2, 8, true, 2.5);
		    }
		} else if ((ent.y >= this.y + 10) && ent.inShell && ent.speed === 0) {
		    if (ent.dir) {
			ent.x += 60;
		    } else {
			ent.x -= 60;
		    }
		    ent.speed = 200;
		} else if (!ent.isDead && ent.speed > 0) {
		    this.isDead = true;
		    this.x = -1000;
		    this.y = -1200;
		    bgm.pause();
		    bgm.currentTime = 0;
	    	    var dead = new Audio("./death.mp3");
	  	    dead.play();
		    this.game.gameOver = true;
                    this.game.addEntity(new endscreen(this.game, [AM.getAsset("./peachcry.png")], 3));
                    console.log("GAME OVER");
		}
	    }
        }

        for (var i = 0; i < this.game.coins.length; i++) {
            var ent = this.game.coins[i];
            if (ent !== this && this.collision(ent) && (ent instanceof Coin) && !this.isDead) {
                console.log("COLLISION!");
                ent.x = -1000;
                ent.y = -1000;
                ent.removeFromWorld = true;
                this.game.score += 5;
                var coincollect = new Audio("./coin.wav");
                coincollect.play();
            }
        }
        if (this.collision(this.game.keyEnt) && !this.isDead) {
		var ent = this.game.keyEnt;
                ent.x = -1000;
                ent.y = -1000;
                ent.removeFromWorld = true;
                this.game.score += 100;
                this.key = true;
                var keycollect = new Audio("./key.wav");
                keycollect.play();
                console.log("KEY");
        }
      
        Entity.prototype.update.call(this);

    }
    this.abs = this.x;
}


function Goomba(game, spritesheets, background, x, y, left, right) {
    this.animation = new Animation(spritesheets, 60, 72, 5, .2, 5, true, 1);
    this.spritesheets = spritesheets;
    this.bg = background;
    this.x = x;
    this.origin = this.x;
    this.abs = this.x;
    this.y = y;
    this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.speed = 50;
    this.game = game;
    this.ctx = game.ctx;
    this.dir = true;
    this.isDead = false;
    this.leftbound = left;
    this.rightbound = right;
    this.drawPriority = 3;



}
Goomba.prototype = new Entity();
Goomba.prototype.constructor = Goomba;

Goomba.prototype.draw = function () {
    if (!this.removeFromWorld) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + this.bg.x, this.y);
        //Entity.prototype.draw.call(this);
    }
}

Goomba.prototype.update = function () {
    if (!this.removeFromWorld) {
        //console.log(this.x);
        if (this.x <= this.leftbound) {
            this.dir = true;
        } else if (this.x >= this.rightbound) {
            this.dir = false;
        }
        if (this.dir) {

            this.x += this.game.clockTick * this.speed;
            currX = this.x;
            this.abs = currX + this.bg.x;
//                        this.x = this.abs;

        } else {
            this.x -= (this.game.clockTick * this.speed);
            currX = this.x;
            this.abs = currX + this.bg.x;
//                        this.x = this.abs
        }
    } else {
        this.abs = this.x;
    }

}

function Koopa(game, spritesheets, background, x, y, left, right) {
    this.animation = new Animation(spritesheets, 32, 36, 8, .2, 8, true, 2.5);
    this.spritesheets = spritesheets;
    this.bg = background;
    this.x = x;
    this.origin = this.x;
    this.abs = this.x;
    this.y = y;
    this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.speed = 50;
    this.game = game;
    this.ctx = game.ctx;
    this.dir = true;
    this.isDead = false;
    this.leftbound = left;
    this.rightbound = right;
    this.drawPriority = 3;
    this.inShell = false;

}
Koopa.prototype = new Entity();
Koopa.prototype.constructor = Koopa;

Koopa.prototype.draw = function () {
    if (!this.removeFromWorld) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + this.bg.x, this.y);
        //Entity.prototype.draw.call(this);
    }
}

Koopa.prototype.update = function () {
    if (!this.removeFromWorld) {
        //console.log(this.x);
        if (!this.inShell && this.x <= this.leftbound) {
            this.dir = true;
	    this.animation.change(this.spritesheets[0], 32, 36, 8, .2, 8, true, 2.5);
        } else if (!this.inShell && this.x >= this.rightbound) {
            this.dir = false;
	    this.animation.change(this.spritesheets[1], 32, 36, 8, .2, 8, true, 2.5);
        }
        if (this.dir) {

            this.x += this.game.clockTick * this.speed;
            currX = this.x;
            this.abs = currX + this.bg.x;

        } else {
            this.x -= (this.game.clockTick * this.speed);
            currX = this.x;
            this.abs = currX + this.bg.x;
        }
	if (this.inShell) {
	    for (var i = 0; i < this.game.entities.length; i++) {
		var ent = this.game.entities[i];
		if (ent !== this && (ent instanceof Goomba) && this.collision(ent) && (!ent.isDead)) {
		    ent.removeFromWorld = true;
            	    ent.abs = -1000;
            	    ent.isDead = true;
            	    this.game.score += 10;
		} else if (ent !== this && (ent instanceof Block) && (this.collision(ent)) 
			&& (this.y + 5 >= ent.y) && (this.y <= ent.y + 64)){
		    console.log("koopa: " + this.abs + " block: " + ent.abs);
		    if (this.dir) {
			this.dir = false;
		    } else {
			this.dir = true;
		    }
		}
	    }
        }
    } else {
        this.abs = this.x;
    }

}

function Fireball(game, spritesheets, princess, bg) {
    this.animation = new Animation(spritesheets, 19, 22, 3, .2, 8, true, 2);
    this.spritesheets = spritesheets;
    if (!princess.dir) {
        this.x = princess.x;
    } else {
        this.x = princess.x + princess.animation.frameWidth;
    }
    this.abs = this.x
    this.y = princess.y + 28;
    this.speed = 170;
    this.game = game;
    this.ctx = game.ctx;
    this.mc = princess;
    this.bg = bg;
    this.dir = this.mc.dir;
    this.movingFireball = true;
    this.isDead = false;
    this.drawPriority = 3;
}

Fireball.prototype = new Entity();
Fireball.prototype.constructor = Fireball;

Fireball.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    //Entity.prototype.draw.call(this);
};

Fireball.prototype.update = function () {
    for (var i = 0; i < this.game.enemies.length; i++) {
        var ent = this.game.enemies[i];
        if (ent !== this && this.collision(ent) && (ent instanceof Goomba) && this.movingFireball && !(ent.isDead)) {
            console.log("HIT!");
//            console.log(this.abs + " " + ent.abs);
            ent.removeFromWorld = true;
            ent.abs = -1000;
            ent.isDead = true;
            this.game.score += 10;
            this.movingFireball = false;
            var gburn = new Audio("./firehitg.wav");
            gburn.play();
        } else if (ent !== this && this.collision(ent) && (ent instanceof Koopa) && this.movingFireball && !(ent.isDead)) {
	    console.log("KOOPA HIT");
	    this.movingFireball = false;
	}
    }
    if (this.movingFireball) {
        if (!this.dir) {
            this.x = this.x - this.game.clockTick * this.speed;
            this.abs = this.x;
        } else {
            this.x = this.x + this.game.clockTick * this.speed;
            this.abs = this.x;
        }
//        console.log(this.abs);
    } else {

        this.y = -700;
    }
};

function Coin(game, spritesheets, backgroundEnt, x, y) {

    this.animation = new Animation(spritesheets, 32, 36, 7, .2, 7, true, 1);
    this.spritesheets = spritesheets;
    this.x = x;
    this.y = y;
    this.bg = backgroundEnt;
    this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.speed = 170;
    this.game = game;
    this.ctx = game.ctx;
    this.abs = this.x;
    this.drawPriority = 3;
}
Coin.prototype = new Entity();
Coin.prototype.constructor = Coin;

Coin.prototype.draw = function () {
    if (this.removeFromWorld != true)
    {
        //console.log(this.x + " " + this.bg.x);
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + this.bg.x, this.y);
        //Entity.prototype.draw.call(this);
    }
}

Coin.prototype.update = function () {
    this.abs = this.x + this.bg.x;
    //Entity.prototype.update.call(this);
}

function Key(game, spritesheets, backgroundEnt, x, y) {
    this.animation = new Animation(spritesheets, 50, 120, 8, .2, 8, true, .5);
    this.spritesheets = spritesheets;
    this.x = x;
    this.y = y;
    this.game = game;
    this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.ctx = game.ctx;
    this.speed = 170;
    this.bg = backgroundEnt;
    this.abs = this.x;
    this.drawPriority = 3;
}
Key.prototype = new Entity();
Key.prototype.constructor = Key;

Key.prototype.draw = function () {
    if (this.removeFromWorld != true) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + this.bg.x, this.y);
        //Entity.prototype.draw.call(this);
    }
}
Key.prototype.update = function () {
    this.abs = this.x + this.bg.x;
}



AM.queueDownload("./PeachWalkLeft.png");
AM.queueDownload("./PeachWalkRight.png");
AM.queueDownload("./PeachThrowLeft.png");
AM.queueDownload("./PeachThrowRight.png");
AM.queueDownload("./PeachIdleRight.png");
AM.queueDownload("./PeachIdleLeft.png");
AM.queueDownload("./PeachCrouchRight.png");
AM.queueDownload("./PeachCrouchLeft.png");
AM.queueDownload("./PeachJumpRight.png");
AM.queueDownload("./PeachJumpLeft.png");
AM.queueDownload("./Fireball.png");
AM.queueDownload("./GoombaWalk.png");
AM.queueDownload("./Level1.png");
AM.queueDownload("./Level2.png");
AM.queueDownload("./Coin.png");
AM.queueDownload("./Block.png");
AM.queueDownload("./Key.png");
AM.queueDownload("./cutscene.png");
AM.queueDownload("./peachcry.png");
AM.queueDownload("./peachdance.png");
AM.queueDownload("./koopawalkleft.png");
AM.queueDownload("./koopawalkright.png");
AM.queueDownload("./koopaspinright.png");
AM.queueDownload("./koopaspinleft.png");

AM.downloadAll(function () {
//    console.log("hello");
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    document.getElementById('gameWorld').focus();
    gameEngine.start();

    backgroundSprites = [AM.getAsset("./Level1.png"), AM.getAsset("./Level2.png")];
    princessSprites = [AM.getAsset("./PeachIdleRight.png"), AM.getAsset("./PeachIdleLeft.png"), AM.getAsset("./PeachWalkRight.png"), AM.getAsset("./PeachWalkLeft.png"), AM.getAsset("./PeachCrouchRight.png"), AM.getAsset("./PeachCrouchLeft.png"), AM.getAsset("./PeachJumpRight.png"), AM.getAsset("./PeachJumpLeft.png"), AM.getAsset("./PeachThrowRight.png"), AM.getAsset("./PeachThrowLeft.png")];
    goombaSprites = [AM.getAsset("./GoombaWalk.png")];
    fireballSprites = [AM.getAsset("./Fireball.png")];
    CoinSprites = [AM.getAsset("./Coin.png")];
    blockSprites = [AM.getAsset("./Block.png")];
    keySprites = [AM.getAsset("./Key.png")];
    cutsceneSprites = [AM.getAsset("./cutscene.png")];
    koopaSprites = [AM.getAsset("./koopawalkright.png"), AM.getAsset("./koopawalkleft.png"), AM.getAsset("./koopaspinright.png"), AM.getAsset("./koopaspinleft.png")];

    bgm.play();
    backgroundEnt = new Background(gameEngine, backgroundSprites);
    princessEnt = new Princess(gameEngine, princessSprites, backgroundEnt);
    gameEngine.addEntity(backgroundEnt);

    blocks = []
    for (var i = 0; i < 64; i++) {
        var blk = new Block(gameEngine, blockSprites, backgroundEnt, i * 64, 640);
        gameEngine.addEntity(blk);
        blocks.push(blk);
    }
    //var blk = new Block(gameEngine, blockSprites, backgroundEnt, 500, 576);
    //gameEngine.addEntity(blk);
    //blocks.push(blk);
    for (var i = 500; i < 692; i += 64) {
        var blk = new Block(gameEngine, blockSprites, backgroundEnt, i, 450);
        gameEngine.addEntity(blk);
        blocks.push(blk);
    }
    for (var i = 800; i < 900; i += 64) {
        var blk = new Block(gameEngine, blockSprites, backgroundEnt, i, 375);
        gameEngine.addEntity(blk);
        blocks.push(blk);
    }
    for (var i = 1000; i < 1200; i += 64) {
        var blk = new Block(gameEngine, blockSprites, backgroundEnt, i, 300);
        gameEngine.addEntity(blk);
        blocks.push(blk);
    }
    for (var i = 1475; i < 1975; i += 64) {
        var blk = new Block(gameEngine, blockSprites, backgroundEnt, i, 375);
        gameEngine.addEntity(blk);
        blocks.push(blk);
    }
    for (var i = 2350; i < 2550; i += 64) {
        var blk = new Block(gameEngine, blockSprites, backgroundEnt, i, 450);
        gameEngine.addEntity(blk);
        blocks.push(blk);
    }
    for (var i = 2700; i <= 2828; i += 64) {
        var blk = new Block(gameEngine, blockSprites, backgroundEnt, i, 375);
        gameEngine.addEntity(blk);
        blocks.push(blk);
    }
    for (var i = 3000; i <= 3128; i += 64) {
        var blk = new Block(gameEngine, blockSprites, backgroundEnt, i, 300);
        gameEngine.addEntity(blk);
        blocks.push(blk);
    }
    gameEngine.blocks = blocks;

    var enemies = [];
    var koopa = new Koopa(gameEngine, koopaSprites, backgroundEnt, 300, 575, 200, 400);
    gameEngine.addEntity(koopa);
    enemies.push(koopa);
    for (var i = 0; i <= 5; i++) {
        var gmb = new Goomba(gameEngine, goombaSprites, backgroundEnt, i * 100 + 450, 600, 400, 1000);
        if (i % 2 === 0) {
            gmb.dir = false;
        }
        gameEngine.addEntity(gmb);
	enemies.push(gmb);
    }
    for (var i = 0; i < 4; i++) {
        var gmb = new Goomba(gameEngine, goombaSprites, backgroundEnt, 1475 + i * 125, 335, 1475, 1950);
        gameEngine.addEntity(gmb);
	enemies.push(gmb);
    }
    for (var i = 0; i <= 6; i++) {
        var gmb = new Goomba(gameEngine, goombaSprites, backgroundEnt, 2000 + i * 100, 600, 2000, 3000);
        if (i % 2 === 0) {
            gmb.dir = false;
        }
        gameEngine.addEntity(gmb);
        enemies.push(gmb);
    }
    var gmb = new Goomba(gameEngine, goombaSprites, backgroundEnt, 2750, 335, 2700, 2800)
    gameEngine.addEntity(gmb);
    enemies.push(gmb);
    
    gameEngine.enemies = enemies;

    gameEngine.addEntity(princessEnt);
    //gameEngine.addEntity(new Fireball(gameEngine, fireballSprites));

    gameEngine.addEntity(new Cam(gameEngine, backgroundEnt, princessEnt));

    var coins = [];
    //for(var i = 50; i < 4000; i+=150) {
    //gameEngine.addEntity(new Coin(gameEngine,CoinSprites, backgroundEnt, i, 350));
    //}
    for (var i = 470; i <= 710; i += 80) {
	var cn = new Coin(gameEngine, CoinSprites, backgroundEnt, i, 375);
        gameEngine.addEntity(cn);
	coins.push(cn);
    }
    for (var i = 810; i < 900; i += 80) {
	var cn = new Coin(gameEngine, CoinSprites, backgroundEnt, i, 300);
        gameEngine.addEntity(cn);
	coins.push(cn);
    }
    for (var i = 1000; i < 1300; i += 80) {
	var cn = new Coin(gameEngine, CoinSprites, backgroundEnt, i, 225);
        gameEngine.addEntity(cn);
	coins.push(cn);
    }
    for (var i = 1600; i < 1900; i += 80) {
	var cn = new Coin(gameEngine, CoinSprites, backgroundEnt, i, 575);
        gameEngine.addEntity(cn);
	coins.push(cn);
    }
    for (var i = 2375; i < 2550; i += 80) {
	var cn = new Coin(gameEngine, CoinSprites, backgroundEnt, i, 350);
        gameEngine.addEntity(cn);
	coins.push(cn);
    }
    for (var i = 3000; i <= 3200; i += 80) {
	var cn = new Coin(gameEngine, CoinSprites, backgroundEnt, i, 225);
        gameEngine.addEntity(cn);
	coins.push(cn);
    }
    gameEngine.coins = coins;

    var keyEnt = new Key(gameEngine, keySprites, backgroundEnt, 3500, 350);
    gameEngine.addEntity(keyEnt);
    gameEngine.keyEnt = keyEnt;

    gameEngine.showOutlines = true;
    //gameEngine.addEntity(new cutscene(gameEngine, cutsceneSprites, 1));
    console.log("All Done!");
});
