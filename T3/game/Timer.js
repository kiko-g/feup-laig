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

        this.square = new Plane(this.scene, 'timerDisplay', 4, 4);

        this.MAT = new CGFappearance(this.scene);
        this.MAT.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.MAT.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.MAT.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.MAT.setShininess(100);
        this.MAT.setEmission(0.2, 0.2, 0.2, 1.0);

        this.countStart = 0;
        this.counting = true;
	}

    display() 
    {
        this.update();
        this.MAT.apply();
        
        this.scene.pushMatrix();
        if (this.counting) this.MAT.setTexture(this.numberTEX[this.time % 10])
        else this.MAT.setTexture(this.numberTEX[0]);
        this.scene.translate(-2.15, -2.5, 0.7);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(0.7, 1, 1);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if (this.counting) this.MAT.setTexture(this.numberTEX[Math.floor(this.time / 10)]);
        else this.MAT.setTexture(this.numberTEX[0]);
        this.scene.translate(-1.45, -2.5, 0.7);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(0.7, 1, 1);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if (this.counting) this.MAT.setTexture(this.numberTEX[this.time % 10])
        else this.MAT.setTexture(this.numberTEX[0]);
        this.scene.translate(2.15, 2.5, 0.7);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(0.7, 1, 1);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if (this.counting) this.MAT.setTexture(this.numberTEX[Math.floor(this.time / 10)]);
        else this.MAT.setTexture(this.numberTEX[0]);
        this.scene.translate(1.45, 2.5, 0.7);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(0.7, 1, 1);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();
    }

    update() {
        if(this.counting) {
            this.time = this.scene.game.timePerPlay - Math.floor((performance.now() - this.countStart)/1000);
            if(this.time <= 0) { this.counting = false; this.board.timeOut(); }
        }
    }

    resetCount() { this.countStart = performance.now(); this.counting = true; }
    stopCount() { this.counting = false; }
}
