var Game = {
	scheduler: null,
	engine: null,
	player: null,
	level: null,
	display: null,
	textBuffer: null,
	pdisplay: null,
	sheet: null,
	visList: [],
	
	init: function() {
		window.addEventListener("load", this);
	},

	handleEvent: function(e) {
		switch (e.type) {
			case "load":
				window.removeEventListener("load", this);

				this.scheduler = new ROT.Scheduler.Speed();
				this.engine = new ROT.Engine(this.scheduler);
				new Spritesheet('alloy.png', 12, 12, this.finalizeLoad.bind(this));
			break;
		}
	},
	
	finalizeLoad: function(sheet) {
		this.sheet = sheet;
		this.pdisplay = new PixiDisplay(document.body, this.sheet);
		this.textBuffer = new TextBuffer(this.pdisplay);
		this.player = new Player();

		/* FIXME build a level and position a player */
		var level = Level.generateLevel();
		var size = level.getSize();
		this._switchLevel(level);
		this.level.setBeing(this.player, new XY(Math.round(size.x/2), Math.round(size.y/2)));
		
		this.pdisplay.draw();
		this.engine.start();
	},

	draw: function(xy, visible) {
		if (visible === undefined) {
			visible = this.visList.find(function(z) { z.is(xy); }) !== undefined;
		}
		var entity = this.level.getEntityAt(xy, visible);
		var visual = entity.getVisual();
		this.pdisplay.set(xy.x, xy.y, visual.ch, visual.fg, visual.bg);
	},

	drawMany: function(xyList, visible) {
		for (var i = 0; i < xyList.length; i++) {
			Game.draw(xyList[i], visible);
		}
	},

	setVisible: function(visList) {
		var prevVisList = this.visList;
		this.visList = visList;
		Game.drawMany(prevVisList, false);
		Game.drawMany(this.visList, true);
	},
	
	over: function() {
		this.engine.lock();
		/* FIXME show something */
	},

	kill: function(being) {
		this.level.removeBeing(being);
	},

	getItem: function(xy) {
		return this.level.getItemAt(xy);
	},

	isBlocked: function(xy) {
		var size = this.level.getSize();
		return this.level.isBlocked(xy) || xy.x >= size.x || xy.y >= size.y;
	},

	getEnemy: function(xy) {
		return this.level.getBeingAt(xy);
	},

	getPlayer: function() {
		return this.player;
	},

	exploreAt: function(xy) {
		var feature = this.level.getMapFeatureAt(xy);
		if (feature && feature.explore()) {
			Game.draw(xy);
		}
	},

	_getDoor: function(xy) {
		var door = this.level.getMapFeatureAt(xy);
		if (door && door instanceof Door) {
			return door;
		} else {
			Game.textBuffer.write("No door there.");
			Game.textBuffer.flush();
		}
		return null;
	},

	openDoorAt: function(xy) {
		var door = Game._getDoor(xy);
		if (door) {
			return door.open();
		}
		return false;
	},

	closeDoorAt: function(xy) {
		var door = Game._getDoor(xy);
		if (door) {
			return door.close();
		}
		return false;
	},

	_switchLevel: function(level) {
		/* remove old beings from the scheduler */
		this.scheduler.clear();

		this.level = level;
		var size = this.level.getSize();

		var bufferSize = 3;
		this.textBuffer.configure({
			display: this.pdisplay,
			position: new XY(0, size.y),
			size: new XY(size.x, bufferSize)
		});

		/* FIXME draw a level */
		var xy = new XY();
		for (var i=0;i<size.x;i++) {
			xy.x = i;
			for (var j=0;j<size.y;j++) {
				xy.y = j;
				this.draw(xy);
			}
		}

		/* add new beings to the scheduler */
		var beings = this.level.getBeings();
		for (var p in beings) {
			this.scheduler.add(beings[p], true);
		}
	}
}

Game.init();
