var consts = {
	wormsMove: false, 
	roundTime: 45,
	teamColors: colors = ["red","blue"],
    screenWidth: 800,
    screenHeight: 400,
    screenDivision: 40,
    TS: 40,
    G: 200,
    FPS: 40,
    DT: 1/40,
    windSpeed: 0,
    EPS: 0.05,	//< floating error
}

var sprites = {};

var write = function(text, size, align, color, x, y) {
	consts.ctx.fillStyle = color;
	consts.ctx.font = size + "px Arial";
	consts.ctx.filStroke = color;
	consts.ctx.textAlign = align;
	consts.ctx.fillText(text, x, y);
}

function loadConsts() {
	consts.screen = document.getElementById("screen");
	consts.ctx = consts.screen.getContext("2d");
	screen.width = consts.screenWidth;
	screen.height = consts.screenHeight;
}

function loadResources(callback) {
	var lI = false;
	var lS = false;

	function loadImages() {
		var imgLib = new ImageResources(consts.ctx);
    	imgLib.addImage("logo", "images/logo.png");
    	imgLib.addImage("scenario", "images/scenario.png");
    	imgLib.addImage("leaf", "images/leaf.png");
    	imgLib.addImage("ground", null, "scenario",  514, 127, 128, 128);
    	imgLib.addImage("grass", null, "scenario",  514, 406, 128, 128);
    	imgLib.addImage("wbackflip", "images/worm/backflip.png");
    	imgLib.addImage("wbad", "images/worm/bad.png");
    	imgLib.addImage("wbighead", "images/worm/bighead.png");
    	imgLib.addImage("wblink1", "images/worm/blink1.png");
    	imgLib.addImage("wblink2", "images/worm/blink2.png");
    	imgLib.addImage("wblink3", "images/worm/blink3.png");
    	imgLib.addImage("wblink4", "images/worm/blink4.png");
    	imgLib.addImage("wblink5", "images/worm/blink5.png");
    	imgLib.addImage("wdie", "images/worm/die.png");
    	imgLib.addImage("weating", "images/worm/eating.png");
		imgLib.addImage("wfall", "images/worm/fall.png");
		imgLib.addImage("wfly", "images/worm/fly.png");
		imgLib.addImage("wflydown", "images/worm/flydown.png");
		imgLib.addImage("wflyup", "images/worm/flyup.png");
		imgLib.addImage("wjump", "images/worm/jump.png");
		imgLib.addImage("wland", "images/worm/land.png");
		imgLib.addImage("wlazy", "images/worm/lazy.png");
		imgLib.addImage("wlook1", "images/worm/look1.png");
		imgLib.addImage("wlook2", "images/worm/look2.png");
		imgLib.addImage("wlook3", "images/worm/look3.png");
		imgLib.addImage("wlook4", "images/worm/look4.png");
		imgLib.addImage("wlook5", "images/worm/look5.png");
		imgLib.addImage("wmustache", "images/worm/mustache.png");
		imgLib.addImage("wonair", "images/worm/onair.png");
		imgLib.addImage("wscratch", "images/worm/scratch.png");
    	imgLib.addImage("wsonofabitch", "images/worm/sonofabitch.png");
    	imgLib.addImage("wstop1", "images/worm/stop1.png");
    	imgLib.addImage("wstop2", "images/worm/stop2.png");
    	imgLib.addImage("wwalking", "images/worm/walking.png");
    	imgLib.addImage("wwinner", "images/worm/winner.png");
    	imgLib.addImage("bazooka", "images/weapons/bazooka.png");
    	imgLib.addImage("bazookaangles", "images/weapons/bazookaangles.png");
    	imgLib.addImage("bazookaback", "images/weapons/bazookaback.png");
    	imgLib.addImage("bazookaget", "images/weapons/bazookaget.png");
    	imgLib.addImage("bazookasmoke", "images/weapons/bazookasmoke.png");
    	imgLib.addImage("explosioncircle", "images/weapons/explosioncircle.png");
    	imgLib.addImage("explosionsign", "images/weapons/explosionsign.png");
    	imgLib.addImage("granade", "images/weapons/granade.png");
    	imgLib.addImage("granadeangles", "images/weapons/granadeangles.png");
    	imgLib.addImage("granadeapear", "images/weapons/granadeapear.png");
    	imgLib.addImage("granadeback", "images/weapons/granadeback.png");
    	imgLib.addImage("grave", "images/weapons/grave.png");

    	(function pull(){
      	if(!imgLib.isReady()){
	        setTimeout(pull, 0);
      	}else{
	        consts.imgLib = imgLib;
        	lI = true;
      	}
    	})();
	}

	function loadSounds() {
		var soundLib = new AudioResources(5);
		soundLib.load("amazing", "sounds/worm/amazing.wav");
		soundLib.load("firstblood", "sounds/worm/firstblood.wav");
		soundLib.load("missed", "sounds/worm/missed.wav");
		soundLib.load("fire", "sounds/worm/fire.wav");
		soundLib.load("hello", "sounds/worm/hello.wav");
		soundLib.load("hurry", "sounds/worm/hurry.wav");
		soundLib.load("jump1", "sounds/worm/jump1.wav");
		soundLib.load("jump2", "sounds/worm/jump2.wav");
		soundLib.load("justyouwait", "sounds/worm/justyouwait.wav");
		soundLib.load("landing", "500", "sounds/worm/landing.wav");
		soundLib.load("ohdear", "sounds/worm/ohdear.wav");
		soundLib.load("oinutter", "sounds/worm/oinutter.wav");
		soundLib.load("stupid", "sounds/worm/stupid.wav");
		soundLib.load("traitor", "sounds/worm/traitor.wav");
		soundLib.load("watchthis", "sounds/worm/watchthis.wav");
		soundLib.load("victory", "sounds/worm/victory.wav");
		soundLib.load("watchthis", "sounds/worm/watchthis.wav");
		soundLib.load("yessir", "sounds/worm/yessir.wav");
		soundLib.load("youllregretthat", "sounds/worm/youllregretthat.wav");
		soundLib.load("walking1", "500", "sounds/worm/Walk-Compress.wav");
		soundLib.load("walking2", "sounds/worm/Walk-Expand.wav");
		consts.soundLib = soundLib;
		(function pull(){
      		if(!soundLib.isReady()){
		        setTimeout(pull, 0);
      		}else{
		        consts.soundLib = soundLib;
				lS = true;
      		}
    	})();
	}

	loadImages();
	loadSounds();
	(function waitForIt(){
        if (!(lI && lS)) {
            setTimeout(function(){waitForIt()}, 0);
        }
        else {
        	callback();
        };
    })();
}

function makeTeams() {
	var teams = new Teams(null, 1, 1);
	consts.teams = teams;
}

function load() {
	loadConsts();
	loadResources(begin);
	sprites.worms = new Array();
	sprites.worms.push(new Worm({x: 100, y:100, width: 20, height: 20}));
	setInterval(loop, 1000/consts.FPS);
}

function begin() {
	document.getElementById('begin').removeAttribute('class');
	consts.begin = true;
}

function start() {
	document.getElementById('begin').setAttribute('class','display-none');
	makeLand();
	makeTeams();
	consts.begin = false;
	consts.end = false;
	consts.start = true;
}

function loop(){
	consts.ctx.clearRect(0, 0, consts.screenWidth, consts.screenHeight);
	drawBackground();

	if (consts.begin) {
		initialScreen();
	}
	else if(consts.end) {
	}
	else if(consts.start) {
		drawLand();
		consts.teams.move(consts.DT);
		consts.teams.draw();
	}
}

addEventListener("keydown", function(e){
	switch (e.keyCode) {
		case 65: //A
		case 37: consts.teams.updateState("toLeft"); break; //ArrowLeft
		case 68: //D
		case 39: consts.teams.updateState("toRight"); break; //ArrowRight
		case 87: //W
		case 38: //ArrowUp
		case 83: //S
		case 40: //ArrowDown
		case 32: break;//Space
		case 13: consts.teams.updateState("jump"); break; //Enter
	}
});

addEventListener("keyup", function(e){
	switch (e.keyCode) {
		case 65: //A
		case 37: //ArrowLeft
		case 68: //D
		case 39: //ArrowRight
		case 87: //W
		case 38: //ArrowUp
		case 83: //S
		case 40: //ArrowDown
			consts.teams.updateState("stop");
	}
});