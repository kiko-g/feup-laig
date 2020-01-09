/** @brief Class that contains all the animation logic for FUSE */
class Animator 
{
	/**
	 * Constructor for the class
	 * @param {GameOrchestrator} - reference to the game orchestrator
	 */
	constructor(orchestrator) {
		this.orchestrator = orchestrator;
		this.scheduledConverts = [];
		this.animationsDone = false;
		this.animationsPending = false;
		this.lastAnimFrame = 0;
	}


	/**
	 * Method that resets the animator fields for the start of a new game
	 */
	reset() {
		this.scheduledConverts = [];
		this.animationsDone = false;
		this.animationsPending = false;
		this.lastAnimFrame = 0;
	}


	/**
	 * Method that generates an animation for a newly created microbe
	 * @param {char} player - player A or B
	 * @param {Tile} newObject - destination tile of the animation
	 */
	assignCreateAnimation(player, newTile) {
		let sideBoard = this.orchestrator.board.generateMicrobeSideBoard(player);

		if (sideBoard.microbe != null) {
			let transX = newTile.x - sideBoard.x;
			let transY = newTile.y - sideBoard.y;

			let raise = new MyKeyframe([0, 1.5, 0], [0, 0, 0], [1, 1, 1], 0.2);
			let float = new MyKeyframe([(1/4) * transY, 1.7, (1/4) * transX], [0, 0, 0], [1, 1, 1], 0.35);
			let top = new MyKeyframe([(1/2) * transY, 1.8, (1/2) * transX], [0, 0, 0], [1, 1, 1], 0.5);
			let release = new MyKeyframe([(3/4) * transY, 1.7, (3/4) * transX], [0, 0, 0], [1, 1, 1], 0.65);
			let arrive = new MyKeyframe([transY, 0.05, transX], [0, 0, 0], [1, 1, 1], 0.8);
			let drop = new MyKeyframe([transY, 0.05, transX], [0, 0, 0], [1, 1, 1], 0.9);
			let squish = new MyKeyframe([transY, 0.05, transX], [0, 0, 0], [1.4, 0.7, 1.4], 0.95);
			let stretch = new MyKeyframe([transY, 0.05, transX], [0, 0, 0], [1, 1, 1], 1.0);

			let keyframes = [raise, float, top, release, arrive, drop, squish, stretch];

			sideBoard.microbe.animation = new KeyframeAnimation(this.orchestrator.scene, keyframes);
			this.animationsDone = false;
			this.animationsPending = true;

			if(this.lastAnimFrame < this.orchestrator.currentTime + 1.0)
				this.lastAnimFrame = this.orchestrator.currentTime + 1.0;
		}
	}


	/**
	 * Method that generates a leaping animation, for when the microbe on this tile moves
	 * @param {Tile} oldTile - source tile of the animation
	 * @param {Tile} newTile - destination tile of the animation
	 */
	assignMoveAnimation(oldTile, newTile) {
		if (oldTile.microbe != null) {

			let transX = newTile.x - oldTile.x;
			let transY = newTile.y - oldTile.y;

			let raise = new MyKeyframe([0, 0.8, 0], [0, 0, 0], [1, 1, 1], 0.1);
			let float = new MyKeyframe([(1 / 4) * transY, 1.1, (1 / 4) * transX], [0, 0, 0], [1, 1, 1], 0.25);
			let top = new MyKeyframe([(1 / 2) * transY, 1.2, (1 / 2) * transX], [0, 0, 0], [1, 1, 1], 0.40);
			let release = new MyKeyframe([(3 / 4) * transY, 1.1, (3 / 4) * transX], [0, 0, 0], [1, 1, 1], 0.65);
			let arrive = new MyKeyframe([transY, 0.8, transX], [0, 0, 0], [1, 1, 1], 0.8);
			let drop = new MyKeyframe([transY, 0, transX], [0, 0, 0], [1, 1, 1], 0.9);
			let squish = new MyKeyframe([transY, 0, transX], [0, 0, 0], [1.4, 0.7, 1.4], 0.95);
			let stretch = new MyKeyframe([transY, 0, transX], [0, 0, 0], [1, 1, 1], 1.0);

			let keyframes = [raise, float, top, release, arrive, drop, squish, stretch];

			oldTile.microbe.animation = new KeyframeAnimation(this.orchestrator.scene, keyframes);
			this.animationsDone = false;
			this.animationsPending = true;

			if(this.lastAnimFrame < this.orchestrator.currentTime + 1.0)
				this.lastAnimFrame = this.orchestrator.currentTime + 1.0;
		}
	}


	/**
	 * Method that generates a conversion animation, for when a microbe is contaminated
	 * @param {Tile} tile - tile where the microbe is standing on
	 */
	assignConvertAnimation(tile) {
		if (tile.microbe != null) {
			let start = new MyKeyframe([0, 0, 0], [0, 0, 0], [1, 1, 1], 0.9);
			let jump = new MyKeyframe([0, 0.5, 0], [0, Math.PI * 4 * (2/3), 0], [0.7, 1.4, 0.7], 1.1);
			let land = new MyKeyframe([0, 0, 0], [0, Math.PI * 4, 0], [1, 1, 1], 1.2);
			let expand = new MyKeyframe([0, 0, 0], [0, Math.PI * 4, 0], [1.4, 0.3, 1.4], 1.3);
			let restore = new MyKeyframe([0, 0, 0], [0, Math.PI * 4, 0], [1, 1, 1], 1.4);

			let keyframes = [start, jump, land, expand, restore];

			tile.microbe.animation = new KeyframeAnimation(this.orchestrator.scene, keyframes);
			this.animationsDone = false;
			this.animationsPending = true;

			if(this.lastAnimFrame < this.orchestrator.currentTime + 1.4)
				this.lastAnimFrame = this.orchestrator.currentTime + 1.4;

			this.scheduleConversion(tile, this.orchestrator.currentTime + 1.2);
		}
	}


	/**
	 * Method that schedules the conversion process of a microbe
	 * @param {Tile} tile - tile where the microbe is at 
	 * @param {float} time - time at when the conversion should be made
	 */
	scheduleConversion(tile, time) {
		this.scheduledConverts.push({tile: tile, time: time});
	}


	/**
	 * Method that converts a microbe to the opponent side
	 * @param {Tile} tile - tile where the microbe is on
	 */
	convert(tile) {
		let microbe = tile.microbe;

		if (microbe.type == 'A') {
			microbe.type = 'B';
			microbe.loadTemplate(this.orchestrator.templates['microbeB']);
		}
		else if (microbe.type == 'B') {
			microbe.type = 'A';
			microbe.loadTemplate(this.orchestrator.templates['microbeA']);
		}
	}


	/**
	 * Update method for all the animations
	 */
	update() {
		for(let i = this.scheduledConverts.length - 1; i >= 0; i--) {
			let scheduledConvert = this.scheduledConverts[i];
			if (scheduledConvert.time <= this.orchestrator.currentTime) {
				this.convert(scheduledConvert.tile);
				this.scheduledConverts.splice(i, 1);
			}
		}

		if (this.animationsPending && !this.animationsDone && this.orchestrator.currentTime > this.lastAnimFrame) {
			this.animationsDone = true;
			this.animationsPending = false;
		}
	}
}
