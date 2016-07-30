function ImageResources(ctx){
    this.ctx = ctx;
    this.resourcesCount = 0;
    this.resourcesLoaded = 0;
    this.images = {};
    this.loaded = (function(that){
        return function(){
            that.resourcesLoaded++;
        };
    })(this);
    this.addImage = function(key, url, ref, sx, sy, swidth, sheight){
        this.resourcesCount++;
        if (!ref) {
            var img = new Image();
            img.onload = this.loaded;
            img.src = url;
            this.images[key] = img;
        } else {
            this.images[key] = key;
            this.images[key].ref = ref;
            this.images[key].sx = sx;
            this.images[key].sy = sy;
            this.images[key].swidth = swidth;
            this.images[key].sheight = sheight;
            this.loaded();
        }
    };
    this.isReady = function(){
        return (this.resourcesCount === this.resourcesLoaded);
    }
    this.get = function(key){
        return this.images[key];
    }
    this.draw = function(key, ref, sx, sy, swidth, sheight, x, y, width, height) {
        if (ref) {
            this.ctx.drawImage(this.images[ref], this.images[key].sx, this.images[key].sy, this.images[key].swidth, this.images[key].sheight, x, y, width, height);
        } else if(swidth) {
            this.ctx.drawImage(this.images[key], sx, sy, swidth, sheight, x, y, width, height);
        } else if (width) {
            this.ctx.drawImage(this.images[key], x, y, width, height);
        } else {
            this.ctx.drawImage(this.images[key], x, y);
        }
    }
    this.drawCentered = function(key, h){
        this.ctx.save();
        this.ctx.translate(consts.screenWidth/2, h);
        this.ctx.drawImage(this.images[key], -this.images[key].width/2, -this.images[key].height/2);
        this.ctx.restore();
    }
    this.drawRotated = function(key, x, y, w, h, angle){
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        this.ctx.drawImage(this.images[key], -w/2, -h/2);
        this.ctx.restore();
    }
    this.drawRotatedScale = function(key, x, y, w, h, angle, scale){
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        this.ctx.scale(scale, scale);
        this.ctx.drawImage(this.images[key], -w/2, -h/2);
        this.ctx.restore();
    }
}