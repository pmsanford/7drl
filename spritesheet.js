var Spritesheet = function(image, sw, sh, callback) {
  this.sw = sw;
  this.sh = sh;
  var int_callback = function(loader, resources) {
      this.texture = resources.sheet.texture;
      this.rowlen = Math.floor(this.texture.baseTexture.width / this.sw);
      this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      callback(this);
  };
  PIXI.loader.add('sheet', image).load(int_callback.bind(this));
};

Spritesheet.prototype.GetTexture = function(index) {
    var xidx = index % this.rowlen;
    var yidx = Math.floor(index / this.rowlen);
    xidx = xidx * this.sw;
    yidx = yidx * this.sh;
    tex = new PIXI.Texture(this.texture, new PIXI.Rectangle(xidx, yidx, this.sw, this.sh));
    return tex;
};