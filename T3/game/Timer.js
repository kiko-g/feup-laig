/**
 * Timer
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Timer extends CGFobject {
	constructor(scene, board) {
        super(scene);
        this.board = board;
        this.numberTEX = [
            new CGFtexture(this.scene, 'scenes/img/numbers/0.jpg'),
            new CGFtexture(this.scene, 'scenes/img/numbers/1.jpg'),
            new CGFtexture(this.scene, 'scenes/img/numbers/2.jpg'),
            new CGFtexture(this.scene, 'scenes/img/numbers/3.jpg'),
            new CGFtexture(this.scene, 'scenes/img/numbers/4.jpg'),
            new CGFtexture(this.scene, 'scenes/img/numbers/5.jpg'),
            new CGFtexture(this.scene, 'scenes/img/numbers/6.jpg'),
            new CGFtexture(this.scene, 'scenes/img/numbers/7.jpg'),
            new CGFtexture(this.scene, 'scenes/img/numbers/8.jpg'),
            new CGFtexture(this.scene, 'scenes/img/numbers/9.jpg')
        ];
        this.timerTEX = new CGFtexture(this.scene, 'scenes/img/numbers/timer.png')

        this.square = new Plane(this.scene, 'timerDisplay', 4, 4);

        this.MAT = new CGFappearance(this.scene);
        this.MAT.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.MAT.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.MAT.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.MAT.setShininess(100);
        this.MAT.setEmission(0.2, 0.2, 0.2, 1.0);
        
        this.movesReq = false;      //vvalid moves request
        this.chosenReq = false;     //move chosen request
        this.countStart = 0;        //count start
        this.counting = true;       //timer is counting
	}

    display() 
    {
        if(this.counting) this.update();
        this.MAT.apply();
        
        this.scene.pushMatrix();
        if (this.counting) this.MAT.setTexture(this.numberTEX[this.time % 10])
        else this.MAT.setTexture(this.numberTEX[0]);
        this.scene.translate(-2.22, -2.5, 0.6);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(0.7*0.8, 0.8, 0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if (this.counting) this.MAT.setTexture(this.numberTEX[Math.floor(this.time / 10)]);
        else this.MAT.setTexture(this.numberTEX[0]);
        this.scene.translate(-1.66, -2.5, 0.6);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(0.7*0.8, 0.8, 0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if (this.counting) this.MAT.setTexture(this.numberTEX[this.time % 10])
        else this.MAT.setTexture(this.numberTEX[0]);
        this.scene.translate(2.22, 2.5, 0.6);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(0.7*0.8, 0.8, 0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if (this.counting) this.MAT.setTexture(this.numberTEX[Math.floor(this.time / 10)]);
        else this.MAT.setTexture(this.numberTEX[0]);
        this.scene.translate(1.66, 2.5, 0.6);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(0.7*0.8, 0.8, 0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.MAT.setTexture(this.timerTEX);
        this.scene.translate(-1.94, -2.5, 1.16);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(1.4*0.8, 0.8, 0.4*0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.MAT.setTexture(this.timerTEX);
        this.scene.translate(1.94, 2.5, 1.16);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(1.4*0.8, 0.8, 0.4*0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();
    }

    update() 
    {
        if(this.scene.game.ended) this.stopCount();
        this.time = this.scene.game.timePerPlay - Math.floor((performance.now() - this.countStart)/1000);

        if(this.time <= this.scene.game.timePerPlay-0.01 && !this.movesReq)
        {
            this.scene.game.getValidMoves("white");
            this.scene.game.getValidMoves("black");
            this.movesReq = true;
        }

        if(this.time <= 0) { 
            this.counting = false;
            this.scene.gameboard.clearAllPicked();
            this.board.timeOut();
        }
    }

    resetCount() { this.countStart = performance.now(); this.counting = true; this.movesReq = false; this.chosenReq = false; }
    stopCount() { this.counting = false; this.movesReq = false; this.chosenReq = false; }
}

