var PixiDisplay = function(parent, spritesheet) {
    this.stage = new PIXI.Container();
    this.sheet = spritesheet;
    this.scale = 1;
    this.sprites = {};
    renderer = new PIXI.autoDetectRenderer(this._to_x(80), this._to_y(28), {"antialias": false});
    parent.appendChild(renderer.view);
};

PixiDisplay.prototype.draw = function() {
  renderer.render(this.stage);
  requestAnimationFrame(this.draw.bind(this));
};

PixiDisplay.prototype.set = function(x, y, ch, fg, bg) {
  var spid = this._get_id(ch);
  this.clear(x, y);
  var locstr = this._get_key(x, y);
  
  var tex = this.sheet.GetTexture(spid);
  var spr = new PIXI.Sprite(tex);
  var tint = this._parseHexStr(fg);
  if (fg != NaN) {
    spr.tint = tint;
  }
  spr.scale.x = this.scale;
  spr.scale.y = this.scale;
  spr.position.x = this._to_x(x);
  spr.position.y = this._to_y(y);
  this.stage.addChild(spr);
  this.sprites[locstr] = spr;
};

PixiDisplay.prototype._parseHexStr = function(hex) {
  if (hex[0] == "#") {
    hex = hex.substr(1);
  }
  if (hex.length == 3) {
    hex = hex[0] + hex;
    hex = hex.substr(0, 2) + hex[2] + hex[2] + hex.substr(3);
    hex = hex + hex[4];
  }
  return parseInt(hex, 16);
}

PixiDisplay.prototype.setAni = function(x, y, chs, fg, bg) {
  this.clear(x, y);
  texes = [];
  for (var i = 0; i < chs.length; i++) {
    texes.push(this.sheet.GetTexture(this._get_id(chs[i])));
  }
  
  var spr = new PIXI.extras.MovieClip(texes);
  spr.scale.x = this.scale;
  spr.scale.y = this.scale;
  spr.position.x = this._to_x(x);
  spr.position.y = this._to_y(y);
  spr.animationSpeed = 0.025;
  this.stage.addChild(spr);
  spr.play();
  var locstr = this._get_key(x, y);
  this.sprites[locstr] = spr;
}

PixiDisplay.prototype.clear = function(x, y) {
  var locstr = this._get_key(x, y);
  if (this.sprites[locstr] !== undefined) {
    this.stage.removeChild(this.sprites[locstr]);
  }
};
  
PixiDisplay.prototype.clearText = function() {
  this.stage.removeChild(this._text);
};
  
PixiDisplay.prototype.text = function(x, y, text) {
  spr = new PIXI.Text(text, {'fill': 'red', font: 'bold 10px "Lucida Console"'});
  spr.position.x = this._to_x(x);
  spr.position.y = this._to_y(y);
  this.stage.addChild(spr);
  this._text = spr;
};
  
PixiDisplay.prototype._get_key = function(x, y) {
  return this._pad_left(x) + this._pad_left(y);
};

PixiDisplay.prototype._pad_left = function(x) {
  var istring = String(x);
  if (istring.length < 2) {
    istring = "0" + istring;
  }
  return istring;
};

PixiDisplay.prototype._get_id = function(chr) {
  if (chr == '@') {
    return 1;
  }
  if (chr == '*') {
    return 2;
  }
  if (chr == '.') {
    return 46;
  }
  if (chr == '/') {
    return 47;
  }
  if (chr == '#') {
    return 35;
  }
  return 0;
};

PixiDisplay.prototype._to_x = function(loc) {
  return loc * this.sheet.sw * this.scale;
};

PixiDisplay.prototype._to_y = function(loc) {
  return loc * this.sheet.sh * this.scale;
};

PixiDisplay.prototype._from_x = function(loc) {
  return Math.floor(loc/this.sheet.sw);
};

PixiDisplay.prototype._from_y = function(loc) {
  return Math.floor(loc/this.sheet.sh);
};

PixiDisplay.prototype._snap_x = function(loc) {
  return this._from_x(this._to_x(loc));
};

PixiDisplay.prototype._snap_y = function(loc) {
  return this._from_y(this._to_y(loc));
};