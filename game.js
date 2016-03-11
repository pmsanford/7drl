var Game = {
	scheduler: null,
	engine: null,
	player: null,
	level: null,
	display: null,
	textBuffer: null,
	pdisplay: null,
	sheet: null,
	
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
		var level = new Level();
		var size = level.getSize();
		this._switchLevel(level);
		this.level.setEntity(this.player, new XY(Math.round(size.x/2), Math.round(size.y/2)));
		
		this.pdisplay.draw();
		this.engine.start();
	},

	draw: function(xy) {
		var entity = this.level.getEntityAt(xy);
		var visual = entity.getVisual();
		if (visual.ch === '@') {
		  this.pdisplay.setAni(xy.x, xy.y, ['@', '*'], visual.fg, visual.bg);
		} else {
		  this.pdisplay.set(xy.x, xy.y, visual.ch, visual.fg, visual.bg);
		}
	},
	
	over: function() {
		this.engine.lock();
		/* FIXME show something */
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
		this.textBuffer.clear();

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
