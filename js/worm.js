//modos do worm
const ACTIVE = 0;
const PASSIVE = 1;

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
		var energy = stm.state("energy");

		stopped.addTransition("toRight", movright).addTransition("toLeft", movleft).addTransition("jump", jumping).addTransition("fall", falling).addTransition("armingUp", armed).addTransition("armingDown", armed);
		movright.addTransition("stop", stopped).addTransition("fall", falling).addTransition("jump", jumping);
		movleft.addTransition("stop", stopped).addTransition("fall", falling).addTransition("jump", jumping);
		colidingRight.addTransition("stop", stopped).addTransition("toLeft", movleft);
		colidingLeft.addTransition("stop", stopped).addTransition("toRight", movright);
		falling.addTransition("stop", stopped);
		jumping.addTransition("stop", stopped);
		armed.addTransition("disarmed", stopped).addTransition("jump", jumping).addTransition("toLeft", movleft).addTransition("toRight", movright).addTransition("armingUp", armed).addTransition("armingDown", armed).addTransition("acumulateenergy", energy).addTransition("fire", stopped);
		
		return stm;
	}

	this.animation = library.animLib;
	this.activeStateMachine = makeActiveStateMachine();
	this.activeState;
	this.angleWeapons = 0;
	this.currentWeapon = "bazooka";
	this.onLand = true;
	this.life = config.life || 100;
	this.dead = false;
	this.outSide = false;
	this.color = config.color || "red";
	this.orientation = -1; //esquerda
	this.crosspointer = new Crosspointer(this.color);
	this.soundWeapons = true;
	this.arms = ["bazooka", "granade"]
	this.energy = 0;

	this.maxHeight = consts.screenDivision * 1.4; //altura máxima do pulo	
	
} inherit(Worm, Sprite);

Worm.prototype.sumLife = function(value) {
	this.life += value;
	if (this.life <= 0)
		this.dead = true;
}

Worm.prototype.key = function() { 
	return "worm"; 
}

Worm.prototype.draw = function(ctx, map) {
	ctx.save();
		ctx.translate(this.x, this.y);
		ctx.save();
			ctx.scale(this.sx, this.sy);
			if(!this.animation.isExecuting(this.currentWeapon + "angles") && this.animation.current != null) {
				this.animation.drawFrame(consts.DT);
			} else {
				this.animation.drawNFrame(this.currentWeapon + "angles", this.calcFrameIndex());
			}
		ctx.restore();
	ctx.restore();
	this.life ? write(this.life, "bold 14", "center", this.color, this.x, this.y - this.height + 5):false;


	if (this.activeState.value() == "armed") {
		this.crosspointer.draw(consts.ctx, this.x, this.y, this.angleWeapons, this.sx, this.calcFrameIndex());
		drawEnergyBar(consts.ctx, this.x, this.y, this.angleWeapons, this.sx, this.energy);
	}

	// if(map) {
	// 	var gr = map.getPosition(this.x, this.y + this.height/2 - 1, this.width, this.height, consts.screenDivision);
		
		// ctx.strokeStyle = "#F00";
		// ctx.strokeRect(consts.screenDivision * (gr.x - Math.floor(gr.w/2)), consts.screenDivision * (gr.y - gr.h + 1), consts.screenDivision * gr.w, consts.screenDivision * gr.h);
		
		 //ctx.strokeStyle = "#00F";
		 // ctx.strokeRect(this.left(), this.top(), this.right() - this.left(), this.bottom() - this.top());
	//}
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
	if(this.life > 0 && this.activeState.prox(transition) && this.conditionTransition(transition)) {
		this.activeState = this.activeState.prox(transition);
		this.update();
	}
}

Worm.prototype.update = function() {
	if (this.activeState.value() == "stopped") {
		this.vx = this.ax = 0;
		this.vy = this.ay = 0;		
		this.animation.linkAnimations("stop1");
	}
	else if (this.activeState.value() == "movingright") {
		this.vx = 40;
		this.sx = -1;
		this.animation.executeAnimation("walking");
		library.soundLib.play("walking1");
	} 
	else if (this.activeState.value() == "movingleft") {
		this.vx = -40;
		this.sx = 1;
		this.animation.executeAnimation("walking");
		library.soundLib.play("walking1");
	} 
	else if (this.activeState.value() == "falling") {
		this.vx = this.ax = 0;
		this.ay = consts.G;
		this.animation.executeAnimation("fall");
		this.animation.linkAnimations("fall", "stop1");
	} 
	else if (this.activeState.value() == "jumping") {
		this.jump = true;
		this.executeJump();
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
		this.angleWeapons = 0;
		if (this.soundWeapons) library.soundLib.play("weapons");
		this.animation.executeAnimation(this.currentWeapon + "get");
		this.animation.linkAnimations(this.currentWeapon + "get", this.currentWeapon + "angles");
		this.soundWeapons = false;
	}
	else if (this.activeState.value() == "energy") {

	}
}

Worm.prototype.conditionTransition = function(transition) {
	if (transition == "toRight") {
		if (this.activeState.value() == "armed") {
			this.animation.executeAnimation(this.currentWeapon + "back");
			this.animation.lock = false;
		}
		return true;
	}
	else if (transition == "toLeft") {
		if (this.activeState.value() == "armed") {
			this.animation.executeAnimation(this.currentWeapon + "back");
			this.animation.lock = false;
		}
		return true
	}
	else if (transition == "stop") {
		if ((this.activeState.value() != "falling" && this.activeState.value() != "jumping") || this.onLand) {
			if (this.activeState.value() == "falling" || this.activeState.value() == "jumping") {
				library.soundLib.play("landing");
			}
			if (this.activeState.value() == "jumping") {
				this.animation.executeAnimation("land");
			}
			return true;
		} else 
			return false;
	} 
	else if (transition == "armingUp" && this.activeState.value() == "armed") {
		if(this.angleWeapons > -90) {
			this.angleWeapons -= 2;	
		}
		return false;
	}
	else if (transition == "armingDown" && this.activeState.value() == "armed") {
		if (this.angleWeapons < 90) {
			this.angleWeapons += 2;
		}
		return false;
	}
	else if (transition == "acumulateenergy" && this.activeState.value() == "armed") {
		if (this.energy == 0)
			library.soundLib.play("throwpowerup");
		this.energy += 3;
		if (this.energy > 85) {
			this.updateState("fire");
			this.energy = 0;
		}
		return false;
	}
	else if (transition == "fire") {
		this.fire(this.energy);
		this.animation.executeAnimation(this.currentWeapon + "back");
		this.activeState.prox("stop");
		if (this.currentWeapon == "granade") {
			library.soundLib.play("watchthis");
			weapons.push(new Granade({x: this.x, 
									  y:this.y, 
									  vx: Math.cos(this.angleWeapons * this.sx * Math.PI/180) * this.energy, 
									  vy: Math.sin(this.angleWeapons * this.sx * Math.PI/180) * this.energy, 
									  time: 3, 
									  ay: consts.G
									})
			);
		}
		else {
			library.soundLib.play("fire");
			weapons.push(new Bazooka({x: this.x, 
									  y:this.y, 
									  vx: Math.cos(this.angleWeapons * this.sx * Math.PI/180) * this.energy, 
									  vy: Math.sin(this.angleWeapons * this.sx * Math.PI/180) * this.energy, 
									  ay: consts.G, 
									  ax: consts.windSpeed
									})
			);
		}

	}
	return true;
}

Worm.prototype.isOnLand = function() {
	if (!this.outSide) {
		var div = consts.screenDivision;
		var posXUnder = Math.floor(this.x/div);
		var posYUnder = Math.floor((400 - this.y + 10)/div) - 1;
		var topUnder = div * (posYUnder + 1) - 10;
		// consts.ctx.strokeStyle = "#FFF";
		// consts.ctx.strokeRect( div * posXUnder, 404-div * (posYUnder+ 1),div, div);
		if (consts.posMap[posXUnder][posYUnder] == 1 && ((topUnder == (380 - Math.floor(this.y)) || (this.vy >=0 && topUnder > (380 - Math.floor(this.y)))))) {
				this.y = Math.floor(this.y);
				this.onLand = true;
		}
		else 
			this.onLand = false;
	}
	else 
		this.onLand = false;
}

Worm.prototype.sideLeftCollision = function(map, x, y, div) {
	x -= this.vx * consts.DT;
	var posX = Math.floor((x - this.width/2)/div);
	var posY = Math.floor((404 - y)/div);
	if (posX >= 0 && map[posX][posY] == 1) {
		return true;
	}
	return false;
}

Worm.prototype.sideRightCollision = function(map, x, y, div) {
	x += this.vx * consts.DT;
	var posX = Math.floor((x + this.width/2)/div);
	var posY = Math.floor((404 - y)/div);
	if (posX < map.length && map[posX][posY] == 1) {
		return true;
	}
	return false;
}

Worm.prototype.sideCollision = function(map, x, y, div) {
	return (this.sideLeftCollision(map, x, y, div) || this.sideRightCollision(map, x, y, div));
}

Worm.prototype.canMove = function() {
	var result;
	this.isOnLand();
	if (this.activeState.value() == "movingright") {
		result = (!this.sideRightCollision(consts.posMap, this.x, this.y, consts.screenDivision) && this.onLand);
	} 
	else if (this.activeState.value() == "movingleft") {
		result = !(this.sideLeftCollision(consts.posMap, this.x, this.y, consts.screenDivision) && this.onLand);
	} 
	else if (this.activeState.value() == "falling") {
		result = !this.onLand;
		if (this.onLand) {
			this.updateState("stop");
		}
	}
	else if (this.activeState.value() == "stopped") { 
		result = (this.activeState.value() != "falling" && this.activeState.value() != "jumping");
	}
	else if (this.activeState.value() == "jumping") {
		this.executeJump();
		if (this.onLand && this.down) {
			this.down = false;
			this.updateState("stop");
			result = true;
		}
		else {
			if (this.sideLeftCollision(consts.posMap, this.x, this.y, consts.screenDivision)) {
				this.vx *= this.vx < 0 ? -1 : 1;
				this.sx *= this.sx > 0 ? -1 : 1;
			}
			if (this.sideRightCollision(consts.posMap, this.x, this.y, consts.screenDivision)){
				this.vx *= this.vx > 0 ? -1 : 1;
				this.sx *= this.sx < 0 ? -1 : 1;
			}
			result = true;
		}
	} else {
		result = true;
	}
	if (!this.onLand && this.activeState.value() != "jumping") {
		this.updateState("fall");
	}
	if(this.isOutSide()) {
		this.updateState("outland");
	}
	return result;
}



Worm.prototype.isOutSide = function() {
	if (this.x < 0 || this.x > consts.screenWidth) {
		this.outSide = true;
		return true;
	}
	return false;
}

Worm.prototype.executeJump = function() {
	if (this.jump) {
		this.animation.executeAnimation("jump");
		this.animation.linkAnimations("jump", "flyup");
		this.flying = true;
		this.jump = false;
	}
	else if (this.flying) {
		this.vx = this.sx * -40;
		this.vy = -Math.sqrt(2 * Math.abs(consts.G) * this.maxHeight);
		this.ay = consts.G;
		this.flying = false;
	} 
	else if (this.vy < -20) {
		this.animation.executeAnimation("fly");
		this.animation.linkAnimations("fly", "flydown");
	}
	else if (this.vy > 0)
		this.down = true;
}

Worm.prototype.calcFrameIndex = function() {
	return Math.round(31/-180*(this.angleWeapons - 90));
}

Worm.prototype.selectArm = function(arm) {
	if (this.currentWeapon != this.arms[arm]) {
		this.currentWeapon = this.arms[arm];
		if (this.activeState.value() == "armed") {
			this.animation.executeAnimation(this.arms[1 - arm] + "back");
			this.animation.linkAnimations(this.arms[1 - arm] + "back", this.arms[arm] + "get");
			this.animation.linkAnimations(this.arms[arm] + "get", this.arms[arm] + "angles");
		}
	}
}

Worm.prototype.die = function() {
	this.animation.executeAnimation("die");
	this.animation.linkAnimations("die", "explosion25");
	this.animation.linkAnimations("explosion25", "grave");
	library.soundLib.play("byebye");
}

Worm.prototype.fire = function() {

}