function makeLand() {
	consts.posMap = makePositionMap(consts.screenHeight/consts.screenDivision, consts.screenWidth/consts.screenDivision);
}

function makePositionMap(nr, nc) {
	var map = new Array(nc);
	var rBegin = Math.floor((Math.random() * nr/2) + 1);
	var range, valColumn;
	for (c = nc - 1; c >= 0; c--) {
		map[c] = new Array(nr);
		if (c == nc/2 - 1 || c == nc/2) {
			valColumn = 0;
		}
		else {
		}
		valColumn = 1;
		for (r = nr - 1; r >= 0 ; r--) {
			if (r <= rBegin) {
				map[c][r] = valColumn;
			}
			else {
				map[c][r] = 0;
			}
		}
		if (rBegin > nr - 3) {
			rBegin += Math.floor(Math.random() * -1);
		} else if (rBegin == 1) {
			rBegin += Math.floor(Math.random() * 2);
		} else {
			rBegin += Math.floor(Math.random() * 3) - 1;
		}
	}

	map.getPosition = function(rx, ry, division) {
		return {x: Math.floor(rx/division), y: Math.floor(ry/division)};
	}

	this.getPosition = function(rx, ry, sw, sh, division) {
		return { x: Math.floor(rx/division), y: Math.floor(ry/division),
				 w: Math.ceil(sw/division),  h: Math.ceil(sh/division) };
	}
	return map;
}

function drawBackground() {
	consts.ctx.rect(0, 0, consts.screenWidth, consts.screenWidth);
    var grd = consts.ctx.createLinearGradient(0, 0, 0, consts.screenHeight);
    // light blue
    grd.addColorStop(0, '#8ED6FF');   
    // dark blue
    grd.addColorStop(1, '#004CB3');
    consts.ctx.fillStyle = grd;
	consts.ctx.fill();
}

function drawLand() {
	var t = consts.screenDivision;
	for (c = 0; c < consts.posMap.length; c++) {
		for (r = 0; r < consts.posMap[c].length; r++) {
			if(consts.posMap[c][r] == 1) {
				if (consts.posMap[c][r + 1] == 1) {
					h = 127;
              	}
              	else {
              		h = 406;
				}
				consts.imgLib.draw("scenario", null, 514, h, 128, 128, t * c, consts.screenHeight -t * (1 + r), t, t);
			}
		}
	}
}

function initialScreen() {
	consts.imgLib.drawCentered("logo", 100);
}

function drawLeafs() {
	var leafs = [];
	var leaf = function(x, y) {
		var l = new Sprite();
		l.x = x;
		l.y = y;
		l.raio = 3;
		l.vx = vx;
		l.vy = 400;
		l.ay = 0;
		l.ax = consts.windSpeed;
		l.draw = function(){
			var config = {
				ref: "leaf",
				x: this.x,
				y: this.y
			}
			consts.imgLib.draw(config);
		};
		l.move
		l.restrictions = function() {
			if (this.y > consts.screenHeight + 10) 
				return true;
		};
		return l;
	}
	interval = 0;
	var makeLeafs = function() {		
		if (interval < 0) {
				leafs.push(leaf(10,10));
			}
		interval -= consts.dt;
	}

	function drawLeafs() {
		leafs.forEach(function(leaf) {
				if(leaf.restrictions()) 
					leaf.splice(leaf.indexOf(leaf), 1);
				leaf.move(consts.dt);
				leaf.draw();
			});
	}
}

function changeWindSpeed() {
	consts.windSpeed = Math.floor(Math.random() * 5 + 1);
}
