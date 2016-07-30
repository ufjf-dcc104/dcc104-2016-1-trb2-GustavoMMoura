function Worm(config) {
	Sprite.call(this,config);

	var makeActiveStateMachine = function() {
		var stm = new StateMachine();

		var stopped = stm.state("stopped");
		var movright = stm.state("movingright");
		var movleft = stm.state("movingleft");
		var colidingRight = stm.state("colidingRight");
		var colidingLeft = stm.state("colidingLeft");
		var falling = stm.state("falling");
		var jumping = stm.state("jumping");
		var armed = stm.state("armed");

		stopped.addTransition("toRight", movright).addTransition("toLeft", movleft).addTransition("jump", jumping).addTransition("fall", falling).addTransition("arming", armed);
		movright.addTransition("stop", stopped).addTransition("fall", falling);
		movleft.addTransition("stop", stopped).addTransition("fall", falling);
		colidingRight.addTransition("stop", stopped).addTransition("toLeft", movleft);
		colidingLeft.addTransition("stop", stopped).addTransition("toRight", movright);
		falling.addTransition("stop", stopped);
		jumping.addTransition("stop", stopped);
		armed.addTransition("stop", stopped);

		return stm;
	}

	var createAnimation = function() {
		var anim = new Animator();
		anim.createAnimation("stop1", "wstop1", null, 20, 23, 30, 20, 16, 30, 1.4, RETURN);
		anim.createAnimation("walking", "wwalking","walking1", 15, 27, 28, 12, 16, 32, 0.5, CYCLIC);
		anim.createAnimation("fall", "wfall", null, 2, 16, 31, 19, 17, 30, 1, CYCLIC);
		anim.createAnimation("jumping", "wjump", "jump1", 10, 26, 35, 16, 12, 25, 0.3, NO_REPEAT);
		anim.createAnimation("flyup", "wflyup", null, 2, 16, 31, 19, 17, 30, 1, CYCLIC);
		anim.createAnimation("fly", "wfly", null, 7, 16, 34, 20, 15, 27, 1, NO_REPEAT);
		anim.createAnimation("flydown", "wflydown", null, 2, 16, 31, 19, 17, 30, 1, CYCLIC);
		anim.createAnimation("land", "wland", "landing", 6, 24, 26, 18, 17, 34, 1, CYCLIC);
		return anim;
	}

	this.activeStateMachine = makeActiveStateMachine();
	this.animation = createAnimation();
	this.activeState;

	this.life = config.life || 100;
	this.dead = false;
	this.color = config.color || "red";
	this.orientation = -1; //esquerda

	//permissoes
	this.canWalktoRight = true;
	this.canWalktoLeft = true;

	this.modes = []

	this.maxHeight = consts.screenDivision * 1.4; //altura máxima do pulo	
	
} inherit(Worm, Sprite);

Worm.prototype.sumLife = function(value) {
	this.life += value;
	if (this.life <= 0)
		this.dead = true;
}

Worm.prototype.isDead = function() {
	return this.dead;
}

Worm.prototype.key = function() { 
	return "worm"; 
}

Worm.prototype.draw = function(ctx, map) {
	ctx.save();
		ctx.translate(this.x, this.y);
		ctx.save();
			ctx.scale(this.sx, this.sy);
			if(this.animation.hasAnimation()) {
				this.animation.drawFrame(ctx, consts.DT);
			} else {
				ctx.strokeStyle = "#F00";
				ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
			}
		ctx.restore();
	ctx.restore();
	write(this.life, "bold 14", "center", this.color, this.x, this.y - this.height + 5);

}

Worm.prototype.apear = function() {
	var x = Math.floor(Math.random() * (consts.screenWidth/consts.screenDivision - 1));
	for (y = 0; y < consts.posMap.length; y++) {
		if (consts.posMap[x][y] == 0) {
			break;
		}
	}
	this.x = x * consts.screenDivision + consts.screenDivision / 2;
	this.y = consts.screenHeight - y * consts.screenDivision - 10;
	this.activeState = this.activeStateMachine.state("stopped");
	this.update();
}

Worm.prototype.updateState = function(transition) {
	if (this.activeState.prox(transition) && this.conditionTransition(transition)) {
		this.activeState = this.activeState.prox(transition);
	}
	this.update();
}

Worm.prototype.update = function() {
	if (this.activeState.value() == "stopped") {
		this.vx = this.ax = 0;
		this.vy = this.ay = 0;		
		this.animation.executeAnimation("stop1");
	} 
	else if (this.activeState.value() == "movingright") {
		this.vx = 40;
		this.sx = -1;
		this.animation.executeAnimation("walking");
		consts.soundLib.play("moving");
	} 
	else if (this.activeState.value() == "movingleft") {
		this.vx = -40;
		this.sx = 1;
		this.animation.executeAnimation("walking");
		consts.soundLib.play("moving");
	} 
	else if (this.activeState.value() == "fall") {
		this.ay = consts.G;
		this.animation.executeAnimation("fall");
		this.animation.linkAnimations("fall", "stop1");
	} 
	else if (this.activeState.value() == "jump") {
		executeJump();
	} 
	else if (this.activeState.value() == "colidingLeft") {
		this.vx = this.ax = 0;
		this.animation.executeAnimation("stop1");
	}
	else if (this.activeState.value() == "colidingRight") {
		this.vx = this.ax = 0;
		this.animation.executeAnimation("stop1");
	}
	else if (this.activeState.value() == "armed") {
		this.vx = this.ax = 0;
		executeArmed();
	}
}

Worm.prototype.canWalk = function(map, x, y, div) {
	this.sideCollision(map, x, y, div);
	var left = this.sideLeftCollision(map, x, y, div);
	var right = this.sideRightCollision(map, x, y, div);
	return !(left && right);
}

Worm.prototype.isOnLand = function(map, div) {
	var posXUnder = Math.floor(this.x/div);
	var posYUnder = Math.floor((400 - this.y + 10)/div) - 1;
	var topUnder = div * (posYUnder) - 10 + div;
	consts.ctx.strokeStyle = "#FFF";
	consts.ctx.strokeRect( div * posXUnder, 404-div * (posYUnder+ 1),div, div);
	if (topUnder == (380 - Math.floor(this.y)) && map[posXUnder][posYUnder] == 1) {
		this.y = Math.floor(this.y);
		if (this.fall) {
			consts.soundLib.play("landing");
		}
		this.fall = false;
		return true;
	}
	this.updateState(4);
	return false;
}

Worm.prototype.sideLeftCollision = function(map, x, y, div) {
	var posX = Math.floor((x - this.width/2)/div);
	var posY = Math.floor((404 -y)/div);
	if (map[posX][posY] == 1) {
		this.canWalktoLeft = false;
		return true;
	}
	this.canWalktoLeft = true;
	return false;
}

Worm.prototype.sideRightCollision = function(map, x, y, div) {
	var posX = Math.floor((x + this.width/2)/div);
	var posY = Math.floor((404 -y)/div);
	if (map[posX][posY] == 1) {
		this.canWalktoRight = false;
		return true;
	}
	this.canWalktoRight = true;
	return false;
}

Worm.prototype.sideCollision = function(map, x, y, div) {
	var posX0 = Math.floor((x - this.width/2)/div);
	var posX1 = Math.floor((x + this.width/2)/div);
	var posY = Math.floor((404 -y)/div);
	consts.ctx.strokeStyle = "#000";
	consts.ctx.strokeRect(Math.floor(this.x/div)*div, Math.floor(this.y/div)*div, div, div);
	consts.ctx.strokeStyle = "#0F0";
	consts.ctx.strokeRect( div * posX0, 404-div * (1 + posY),div, div);
	if (map[posX0][posY] == 1 || map[posX1][posY] == 1 ) {
		return false;
	}
	return true;
}

Worm.prototype.conditionTransition = function(transition) {
	var conditionTransition = new Map();
	return true;
}