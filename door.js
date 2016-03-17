var Door = function(visual, closed) {
	this._state = closed || "closed";
	MapFeature.call(this, visual, this.isBlocking());
}
Door.extend(MapFeature);

Door.prototype.isBlocking = function() {
	return !(this._state == "open");
}

Door.prototype.open = function() {
	if (this._state == "closed") {
		this._state = "open";
		this._visual = {ch: "/", fg: this._visual.fg};
		Game.draw(this._xy);
		return true;
	} else {
		Game.textBuffer.write("That door is already open!");
		Game.textBuffer.flush();
	}
	return false;
}

Door.prototype.close = function() {
	if (this._state == "open") {
		this._state = "closed";
		this._visual = {ch: "+", fg: this._visual.fg};
		Game.draw(this._xy);
		return true;
	} else {
		Game.textBuffer.write("That door is already closed!");
		Game.textBuffer.flush();
	}
	return false;
}