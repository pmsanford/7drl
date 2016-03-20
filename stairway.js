var Stairway = function(direction) {
	this._direction = direction;
	var ch = direction == "up" ? "<" : ">";
	MapFeature.call(this, {ch: ch, fg: "#ff0"}, false, false);
};

Stairway.extend(MapFeature);