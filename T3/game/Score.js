/**
 * Timer
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Scoreboard extends CGFobject 
{
    constructor(scene, board, gameboard) 
    {
        super(scene);
        this.board = board;
        this.gameboard = gameboard;
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
        this.scoreTEX = new CGFtexture(this.scene, 'scenes/img/numbers/score.png')
        this.square = new Plane(this.scene, 'scoreboardDisplay', 4, 4);

        this.MAT = new CGFappearance(this.scene);
        this.MAT.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.MAT.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.MAT.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.MAT.setShininess(100);
        this.MAT.setEmission(0.2, 0.2, 0.2, 1.0);
	}

    display() 
    {
        this.update();
        this.MAT.apply();
        
        //black score
        this.scene.pushMatrix();
        this.MAT.setTexture(this.numberTEX[Math.floor(this.blackScore / 10)]);
        this.scene.translate(2.22, -2.5, 0.6);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(0.7 * 0.8, 0.8, 0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.MAT.setTexture(this.numberTEX[this.blackScore % 10]);
        this.scene.translate(1.66, -2.5, 0.6);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(0.7 * 0.8, 0.8, 0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.MAT.setTexture(this.scoreTEX);
        this.scene.translate(-1.94, 2.5, 1.16);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(1.4 * 0.8, 0.8, 0.4 * 0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();

        //white score
        this.scene.pushMatrix();
        this.MAT.setTexture(this.numberTEX[Math.floor(this.whiteScore / 10)]);
        this.scene.translate(-2.22, 2.5, 0.6);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(0.7 * 0.8, 0.8, 0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.MAT.setTexture(this.numberTEX[this.whiteScore % 10]);
        this.scene.translate(-1.66, 2.5, 0.6);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(0.7 * 0.8, 0.8, 0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.MAT.setTexture(this.scoreTEX);
        this.scene.translate(1.94, -2.5, 1.16);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(1.4 * 0.8, 0.8, 0.4 * 0.8);
        this.MAT.apply();
        this.square.display();
        this.scene.popMatrix();

    }

    update() 
    {
        let score = getWinner(this.board);
        this.whiteScore = score.white.value;
        this.blackScore = score.black.value;
    }
}
