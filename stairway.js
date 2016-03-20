var Stairway = function(direction, link) {
	this._direction = direction;
	var ch = direction == "up" ? "<" : ">";
	MapFeature.call(this, {ch: ch, fg: "#ff0"}, false, false);
	this.link = null;
};

Stairway.extend(MapFeature);

Stairway.prototype.linkTo = function(stairway) {
	this.link = stairway;
	stairway.link = this;
}