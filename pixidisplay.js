var PixiDisplay = {
  renderer: null,
  stage: null,
  sheet: null,
  scale: 1.5,
  sprites: {},
  init: function(parent, sheet) {
    this.stage = new PIXI.Container();
    this.sheet = sheet;
    renderer = new PIXI.autoDetectRenderer(this._to_x(80), this._to_y(28), {"antialias": false});
    parent.appendChild(renderer.view);
  },
  draw: function() {
    renderer.render(this.stage);
  },
  set: function(x, y, ch, fg, bg) {
    var spid = this._get_id(ch);
    this.clear(x, y);
    var locstr = this._get_key(x, y);
    
    var tex = this.sheet.GetTexture(spid);
    var spr = new PIXI.Sprite(tex);
    spr.scale.x = this.scale;
    spr.scale.y = this.scale;
    spr.position.x = this._to_x(x);
    spr.position.y = this._to_y(y);
    this.stage.addChild(spr);
    this.sprites[locstr] = spr;
  },
  clear: function(x, y) {
    var locstr = this._get_key(x, y);
    if (this.sprites[locstr] !== undefined) {
      this.stage.removeChild(this.sprites[locstr]);
    }
  },
  
  clearText: function() {
    this.stage.removeChild(this._text);
  },
  
  text: function(x, y, text) {
    spr = new PIXI.Text(text, {'fill': 'red'});
    spr.scale.x = this.scale;
    spr.scale.y = this.scale;
    spr.position.x = this._to_x(x);
    spr.position.y = this._to_y(y);
    this.stage.addChild(spr);
    this._text = spr;
  },
  
  _get_key: function(x, y) {
    return this._pad_left(x) + this._pad_left(y);
  },
  
  _pad_left: function(x) {
    var istring = String(x);
    if (istring.length < 2) {
      istring = "0" + istring;
    }
    return istring;
  },
  
  _get_id: function(chr) {
    if (chr == '@') {
      return 1;
    }
    if (chr == '.') {
      return 46;
    }
    return 0;
  },
  _to_x: function(loc) {
    return loc * this.sheet.sw * this.scale;
  },
  _to_y: function(loc) {
    return loc * this.sheet.sh * this.scale;
  },
  _from_x: function(loc) {
    return Math.floor(loc/this.sheet.sw);
  },
  _from_y: function(loc) {
    return Math.floor(loc/this.sheet.sh);
  },
  _snap_x: function(loc) {
    return this._from_x(this._to_x(loc));
  },
  _snap_y: function(loc) {
    return this._from_y(this._to_y(loc));
  },
};