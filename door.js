var Door = function(visual, closed) {
	this._state = closed || "closed";
	MapFeature.call(this, visual, this.isBlocking());
}
Door.extend(MapFeature);

Door.prototype.isBlocking = function() {
	return !(this._state == "open");
}