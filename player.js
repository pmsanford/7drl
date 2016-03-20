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

	this._wielded = null;

	this._keyHandler = null;

	this._unarmedDamage = 1;
};
Player.extend(Being);

Player.prototype.act = function() {
	Game.engine.lock();

	var visible = [];

	this._computeFOV(function(x, y, r, vis) {
		var xy = new XY(x, y);
		visible.push(xy);
		Game.exploreAt(xy);
	});

	visible.push(this._xy);

	Game.setVisible(visible);

	window.addEventListener("keydown", this);
};

Player.prototype.die = function() {
	Game.textBuffer.write("You're dead! Game over!");
	Game.textBuffer.flush();
	Being.prototype.die.call(this);
	Game.over();
};

Player.prototype.handleEvent = function(e) {
	var code = e.keyCode;

	var keyHandled = this._handleKey(e.keyCode, e.getModifierState("Shift"));

	if (keyHandled) {
		window.removeEventListener("keydown", this);
		Game.engine.unlock();
	}
};

Player.prototype._calcDamage = function() {
	if (this._wielded && this._wielded instanceof Weapon) {
		return this._wielded.getDamage();
	}
	return this._unarmedDamage;
};

Player.prototype._getXYFromDirection = function(direction) {
	var dir = ROT.DIRS[8][direction];
	var xy = this._xy.plus(new XY(dir[0], dir[1]));
	return xy;
};

Player.prototype._getDirectionFromKeycode = function(code) {
	return this._dirKeys[code];
};

Player.prototype._handleKey = function(code, shift) {
	var acted = false;
	if (this._keyHandler) {
		return this._keyHandler(code);
	}
	if (code in this._dirKeys && !shift) {
		var direction = this._getDirectionFromKeycode(code);
		if (direction == -1) { /* noop */
			/* FIXME show something? */
			return true;
		}
		var xy = this._getXYFromDirection(direction);

		var enemy = null;

		if (enemy = Game.getEnemy(xy)) {
			var damage = this._calcDamage();
			Game.textBuffer.write(`You hit the ${enemy.name} for ${damage} points of damage!`);
			Game.textBuffer.flush();
			enemy.damage(damage);
		}
		else if (Game.isBlocked(xy)) {
			Game.textBuffer.write("Can't go that way.");
			Game.textBuffer.flush();
		} else {
			this._level.setBeing(this, xy);
		}
		return true;
	}
	if (code == ROT.VK_COMMA) {
		var item = Game.getItem(this._xy);
		if (item !== null) {
			this._inventory.push(item);
			Game.textBuffer.write("Picked up a " + item.name + ".");
			acted = true;
		} else {
			Game.textBuffer.write("There's nothing to pick up.");
		}
		Game.textBuffer.flush();
	}
	if (code == ROT.VK_O) {
		Game.textBuffer.write("What direction? ");
		Game.textBuffer.flush();
		this._keyHandler = this._manipulateDoor.bind(this, Game.openDoorAt);
	}
	if (code == ROT.VK_C) {
		Game.textBuffer.write("What direction? ");
		Game.textBuffer.flush();
		this._keyHandler = this._manipulateDoor.bind(this, Game.closeDoorAt);
	}
	if (code == ROT.VK_I) {
		Game.textBuffer.write("Inventory: ");
		this._showInventory();
		Game.textBuffer.flush();
	}
	if (code == ROT.VK_W) {
		Game.textBuffer.write("What do you want to wield? ");
		this._showInventory();
		Game.textBuffer.flush();
		this._keyHandler = this._wieldWeapon.bind(this);
	}
	if (code == ROT.VK_PERIOD && shift) {
		Game.descendAt(this.getXY());
		acted = true;
	}

	return acted; /* unknown key */
};

Player.prototype._manipulateDoor = function(call, code) {
	var succeeded = false;
	if (code in this._dirKeys) {
		var dir = this._getDirectionFromKeycode(code);
		if (dir == -1) {
			Game.textBuffer.write("Nevermind.");
			Game.textBuffer.flush();
		} else {
			var xy = this._getXYFromDirection(dir);
			succeeded = call(xy);
		}
	} else {
		Game.textBuffer.write("Nevermind.");
		Game.textBuffer.flush();
	}
	this._keyHandler = null;
	return succeeded;
};

Player.prototype._wieldWeapon = function(code) {
	var acted = false;
	if (code == 189) {
		Game.textBuffer.write("Now fighting with bare hands.");
		this._wielded = null;
		acted = true;
	} else {
		var idx = code - 65;
		if (this._inventory[idx]) {
			this._wielded = this._inventory[idx];
			Game.textBuffer.write("Wielded " + this._wielded.name + ".");
			acted = true;
		} else {
			Game.textBuffer.write("No such item.");
		}
	}
	Game.textBuffer.flush();
	this._keyHandler = null;
	return acted;
};

Player.prototype._showInventory = function() {
	for (var i = 0; i < this._inventory.length; i++) {
		Game.textBuffer.write(String.fromCharCode(i + 97) + ". " + this._inventory[i].name + (this._wielded == this._inventory[i] ? "(w)" : "") + ";");
	}
};

Player.prototype.addItem = function(item) {
	var loc = this._inventory.push(item);
	return String.fromCharCode(loc - 1 + 65);
};

Player.prototype.forceWield = function(loc) {
	var idx = loc.charCodeAt(0) - 65;
	if (this._inventory[idx]) {
		this._wielded = this._inventory[idx];
	}
}