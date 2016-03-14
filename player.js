var Player = function() {
	Being.call(this, {ch:"@", fg:"#fff"});
	
	this._dirKeys = {};
	this._dirKeys[ROT.VK_K] = 0;
	this._dirKeys[ROT.VK_UP] = 0;
	this._dirKeys[ROT.VK_NUMPAD8] = 0;
	this._dirKeys[ROT.VK_U] = 1;
	this._dirKeys[ROT.VK_NUMPAD9] = 1;
	this._dirKeys[ROT.VK_L] = 2;
	this._dirKeys[ROT.VK_RIGHT] = 2;
	this._dirKeys[ROT.VK_NUMPAD6] = 2;
	this._dirKeys[ROT.VK_N] = 3;
	this._dirKeys[ROT.VK_NUMPAD3] = 3;
	this._dirKeys[ROT.VK_J] = 4;
	this._dirKeys[ROT.VK_DOWN] = 4;
	this._dirKeys[ROT.VK_NUMPAD2] = 4;
	this._dirKeys[ROT.VK_B] = 5;
	this._dirKeys[ROT.VK_NUMPAD1] = 5;
	this._dirKeys[ROT.VK_H] = 6;
	this._dirKeys[ROT.VK_LEFT] = 6;
	this._dirKeys[ROT.VK_NUMPAD4] = 6;
	this._dirKeys[ROT.VK_Y] = 7;
	this._dirKeys[ROT.VK_NUMPAD7] = 7;

	this._dirKeys[ROT.VK_PERIOD] = -1;
	this._dirKeys[ROT.VK_CLEAR] = -1;
	this._dirKeys[ROT.VK_NUMPAD5] = -1;

	this._inventory = [];
}
Player.extend(Being);

Player.prototype.act = function() {
	Game.textBuffer.write("It is your turn, press any relevant key.");
	Game.textBuffer.flush();
	Game.engine.lock();
	window.addEventListener("keydown", this);
}

Player.prototype.die = function() {
	Being.prototype.die.call(this);
	Game.over();
}

Player.prototype.handleEvent = function(e) {
	var code = e.keyCode;

	var keyHandled = this._handleKey(e.keyCode);

	if (keyHandled) {
		window.removeEventListener("keydown", this);
		Game.engine.unlock();
	}
}

Player.prototype._handleKey = function(code) {
	if (code in this._dirKeys) {
		Game.textBuffer.clear();

		var direction = this._dirKeys[code];
		if (direction == -1) { /* noop */
			/* FIXME show something? */
			return true;
		}

		var dir = ROT.DIRS[8][direction];
		var xy = this._xy.plus(new XY(dir[0], dir[1]));

		this._level.setEntity(this, xy); /* FIXME collision detection */
		return true;
	}
	if (code == ROT.VK_COMMA) {
		var item = Game.getItem(this._xy);
		if (item !== null) {
			this._inventory.push(item);
			Game.textBuffer.write("Picked up a " + item.name + ".");
		} else {
			Game.textBuffer.write("There's nothing to pick up.");
		}
		Game.textBuffer.flush();
	}
	if (code == ROT.VK_I) {
		Game.textBuffer.write("Inventory: ");
		for (var i = 0; i < this._inventory.length; i++) {
			Game.textBuffer.write(String.fromCharCode(i + 97) + ". " + this._inventory[i].name + ";");
		}
		Game.textBuffer.flush();
	}

	return false; /* unknown key */
}
