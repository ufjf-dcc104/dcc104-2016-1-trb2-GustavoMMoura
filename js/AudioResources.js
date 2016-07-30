function AudioResources (numcanais) {
	this.numcanais = numcanais || 10;
	this.sons = {};
	this.canais = [];
	this.actives = {};
	this.resourcesCount = 0;
    this.resourcesLoaded = 0;
	for (var i = 0; i < this.numcanais; i++) {
		this.canais[i] = {
			audio: new Audio(),
			end: -1
		};
	}

	this.loaded = (function(that){
        return function(){
            that.resourcesLoaded++;
        };
    })(this);

	this.load = function(key, run, src) {
		this.resourcesCount++;
		this.sons[key] = new Audio(src);
		this.sons[key].load();
		this.sons[key].run = run;
		this.loaded();
	}

	this.isReady = function(){
        return (this.resourcesCount === this.resourcesLoaded);
    }

	this.play = function(key) {
		if (this.actives[key])
			return;
		if (this.sons[key].run) {
			this.actives[key] = true;
			setTimeout((function(that){
				return function() {
					delete that.actives[key];
				};
			})(this), this.sons[key].run);
		}
		var now = new Date();
		for (var i = 0; i < this.numcanais; i++) {
			if (this.canais[i].end < now.getTime()) {
				this.canais[i].end = now.getTime() + this.sons[key].duration * 1000;
				this.canais[i].audio.src = this.sons[key].src;
				this.canais[i].audio.play();
				break;
			}
		}
	}
}