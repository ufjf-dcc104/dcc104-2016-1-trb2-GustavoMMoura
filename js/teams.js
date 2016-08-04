function Team(name, color, numbersWorms) {
	this.color;
	this.numbersWorms = numbersWorms || 1;
	this.lifeTeam = 0;
	this.current = 0;

	this.listWorms = new Array(numbersWorms);
	for (i = 0; i < numbersWorms; i++) {
		config = {width: 23, height: 26};
		this.listWorms[i] = new Worm(config);
		this.listWorms[i].apear();
	}

	this.draw = function() {
		this.lifeTeam = 0;
		for (i = 0; i < numbersWorms; i++) {
			if (!this.listWorms[i].outSide) {
				this.listWorms[i].draw(consts.ctx, consts.posMap);
				this.lifeTeam += this.listWorms[i].life;
			}
		}
	}

	this.changeWorm = function() {
		this.current++;
		while (!this.listWorms[this.current].dead) {
			this.current++;
			if (this.current >= this.numbersWorms)
				this.current = 0;
		}
	}

	this.updateState = function(state) {
		this.listWorms[this.current].updateState(state);
	}

	this.move = function(dt) {
		this.listWorms[this.current].move(dt);
	}

	this.selectArm = function(arm) {
		this.listWorms[this.current].selectArm(arm);
	}
}

function Teams(namesTeams, numberTeams, numbersWorms) {
	this.numberTeams = numberTeams;
	this.teams = new Array(numberTeams);

	this.current = 0;

	for(i = 0; i < numberTeams; i++) {
		var color = consts.teamColors[i % 2];
		this.teams[i] = new Team(null, color, numbersWorms);
	}

	this.draw = function() {
		for(i = 0; i < numberTeams; i++) {
			this.teams[i].draw();
		}
	}

	this.changeTeam = function() {
		this.teams[this.current].changeWorm();
		this.current++;
		if (this.current >= this.numberTeams)
			this.current = 0;
	}

	this.updateState = function(state) {
		this.teams[this.current].updateState(state);
	}

	this.move = function(dt) {
		this.teams[this.current].move(dt);
	}

	this.selectArm = function(arm) {
		this.teams[this.current].selectArm(arm);	
	}
}